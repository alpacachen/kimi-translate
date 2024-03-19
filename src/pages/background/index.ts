import { DEFALUT_PROMPT, KIMI_API_KEY, KIMI_PROMPT } from '@root/src/shared/data';
import { LocalStorage } from '@root/src/shared/storage';
import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';

reloadOnUpdate('pages/background');

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate('pages/content/style.scss');

function readNextChunk(reader: ReadableStreamDefaultReader, port: chrome.runtime.Port) {
  return reader.read().then(({ done, value }) => {
    if (done) {
      reader.cancel();
      return;
    }
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(value, { stream: true });
    const jsonData = JSON.parse(text);
    try {
      port.postMessage(jsonData.choices[0].message.content);
      return readNextChunk(reader, port); // 递归读取下一个块
    } catch {
      console.log('prot disconnect');
    }
  });
}

chrome.runtime.onConnect.addListener(port => {
  port.onMessage.addListener(async message => {
    const token = await LocalStorage.get(KIMI_API_KEY);
    const prompt = await LocalStorage.get(KIMI_PROMPT);
    fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k',
        messages: [
          {
            role: 'user',
            content: `
              你来扮演一个英译中机器，返回内容要求如下
              ${prompt ?? DEFALUT_PROMPT}
              下面我开始给你发英文原文
              `,
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.3,
      }),
    }).then(async res => {
      if (res.ok) {
        const reader = res.body.getReader();
        readNextChunk(reader, port);
      } else {
        switch (res.status) {
          case 429:
            port.postMessage('1分钟内请求次数超限，请稍后再试');
            break;
          case 401:
            port.postMessage('认证失败，apikey写对了吗');
            break;
          default:
            port.postMessage('服务错误，请刷行再试');
            break;
        }
      }
    });
  });
});
