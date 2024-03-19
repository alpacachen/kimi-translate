import { FC } from 'react';
import Markdown from 'react-markdown';
export const ResultBox: FC<{ message: string }> = ({ message }) => {
  return (
    <div
      style={{
        width: 250,
        height: 300,
        overflow: 'auto',
        whiteSpace: 'pre-wrap',
      }}>
      <Markdown>{message || 'loading...'}</Markdown>
    </div>
  );
};
