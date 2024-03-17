import { FC } from 'react';

export const ResultBox: FC<{ message: string }> = ({ message }) => {
  return <div className="w-80 min-h-40">{message || 'loading...'}</div>;
};
