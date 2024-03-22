import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import { useEffect, useCallback, useState } from 'react';
import { KIMI_API_KEY, KIMI_PROMPT } from '@root/src/shared/data';
import { LocalStorage } from '@root/src/shared/storage';
import { Button, Flex, Input, Center, Text, Square } from '@chakra-ui/react';
const SidePanel = () => {
  const [key, setKey] = useState('');
  const [prompt, setPrompt] = useState('');
  const svae = useCallback(() => {
    LocalStorage.set(KIMI_API_KEY, key);
    LocalStorage.set(KIMI_PROMPT, prompt);
  }, [key, prompt]);
  useEffect(() => {
    LocalStorage.get(KIMI_API_KEY).then(setKey);
    LocalStorage.get(KIMI_PROMPT).then(setPrompt);
  }, []);
  return (
    <div style={{ background: 'rgb(22, 25, 30)', height: '100vh', width: '100%', padding: 20 }}>
      <img
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        style={{ width: 160, margin: 'auto' }}
        src="https://www.moonshot.cn/assets/logo/normal-dark.png"
        alt="moonshot logo"
      />
      <Flex color={'white'}>
        <Center w="80px">
          <Text fontSize={'sm'}>kimi-key:</Text>
        </Center>
        <Square flex={1} size="80px">
          <Input value={key} size={'sm'} onChange={e => setKey(e.target.value)} placeholder="请输入kimi api-key" />
        </Square>
      </Flex>
      {/* <Flex color={'white'}>
        <Center w="80px">
          <Text fontSize={'sm'}>prompt:</Text>
        </Center>
        <Square flex={1}>
          <Textarea
            rows={10}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder={DEFALUT_PROMPT}
            size="sm"
          />
        </Square>
      </Flex> */}
      <br></br>
      <Button style={{ float: 'right' }} colorScheme="teal" onClick={svae}>
        保存
      </Button>
    </div>
  );
};

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
