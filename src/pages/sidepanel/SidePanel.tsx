import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import { useEffect, useCallback, useState } from 'react';
import { DEFALUT_PROMPT, KIMI_API_KEY, KIMI_PROMPT } from '@root/src/shared/data';
import { LocalStorage } from '@root/src/shared/storage';

const SidePanel = () => {
  const [key, setKey] = useState('');
  const [prompt, setPrompt] = useState('');
  const svaeKey = useCallback(() => {
    LocalStorage.set(KIMI_API_KEY, key);
  }, [key]);
  useEffect(() => {
    LocalStorage.get(KIMI_API_KEY).then(setKey);
    LocalStorage.get(KIMI_PROMPT).then(setPrompt);
  }, []);
  return (
    <div className="App">
      <label htmlFor="key">
        输入key:<input value={key} onChange={e => setKey(e.target.value)} id="key"></input>
      </label>
      <br></br>
      <label htmlFor="prompt">
        自定义prompt:
        <textarea
          placeholder={DEFALUT_PROMPT}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          id="key"></textarea>
      </label>
      <button onClick={svaeKey}>确定</button>
    </div>
  );
};

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
