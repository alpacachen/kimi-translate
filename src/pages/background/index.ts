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
      console.log('Stream complete');
      reader.cancel();
      return;
    }
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(value, { stream: true });
    const jsonData = JSON.parse(text);
    port.postMessage(jsonData.choices[0].message.content);
    return readNextChunk(reader, port); // 递归读取下一个块
  });
}

chrome.runtime.onConnect.addListener(port => {
  port.onMessage.addListener(async message => {
    const res = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'sk-xvy5mU4Qq2mc9DTGeSkeaQtlSH3xOCDMgPIc2njpPE00Ay4T',
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k',
        messages: [
          {
            role: 'user',
            content:
              '你来扮演一个翻译机器人，给出内容的翻译，如果输入是中文，你就给出英文，如果输入是中文，你就给翻译为英文。当翻译完为英文后，对其中难一些的单词进行简单的解释',
          },
          { role: 'user', content: message },
        ],
        temperature: 0.3,
      }),
    });
    const reader = res.body.getReader();
    readNextChunk(reader, port);
  });
});
