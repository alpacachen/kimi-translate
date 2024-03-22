import { FC } from 'react';
import Markdown from 'react-markdown';
export const ResultBox: FC<{ message: string }> = ({ message }) => {
  return (
    <div
      className="markdown-body"
      style={{
        width: 250,
        minHeight: 100,
        maxHeight: 300,
        overflow: 'auto',
        whiteSpace: 'pre-wrap',
      }}>
      <Markdown>{message || 'loading...'}</Markdown>
    </div>
  );
};
