import React, { useState } from 'react';
import useStorage from '@src/shared/hooks/useStorage';
import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';

const SidePanel = () => {
  const localKey = useStorage(exampleThemeStorage);
  console.log(localKey, 'localKey');
  const [key, setKey] = useState(localKey);
  return (
    <div className="App">
      <label htmlFor="api_key">key</label> <input onChange={e => setKey(e.target.value)} id="api_key"></input>
      <button onClick={() => exampleThemeStorage.set(key)}>确定</button>
    </div>
  );
};

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
