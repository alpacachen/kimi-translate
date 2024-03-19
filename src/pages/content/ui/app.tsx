import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useEvent } from 'react-use';
import { ResultBox } from '@pages/content/ui/result-box';
import { EXTEND_ID } from '@root/src/shared/data';
const port = chrome.runtime.connect();

const nextTick = () => new Promise(res => setTimeout(res, 10));

interface PositionValue {
  left: number;
  top: number;
  text: string;
}

const validPosition = (v: PositionValue) => v.left && v.top && v.text;
export default function App() {
  const [position, setPosition] = useState<PositionValue>({ left: 0, top: 0, text: '' });
  const [msgBoxVisible, setMsgBoxVisible] = useState(false);
  const showButton = useMemo(() => validPosition(position) && !msgBoxVisible, [msgBoxVisible, position]);
  const visible = showButton || msgBoxVisible;
  const [message, setMessage] = useState('');

  useEvent('mouseup', async event => {
    if (document.querySelector('#' + EXTEND_ID).contains(event.target)) {
      return;
    }
    await nextTick();
    const selection = window.getSelection().toString().replaceAll(/\n/g, '');
    if (selection.toString()) {
      setPosition({
        top: event.clientY + window.scrollY,
        left: event.clientX + window.scrollX,
        text: selection.toString(),
      });
    }
  });

  const clear = useCallback(() => {
    setMsgBoxVisible(false);
    setMessage('');
    setPosition({ left: 0, top: 0, text: '' });
  }, []);

  const ref = useRef<HTMLDivElement>(null);

  useEvent('mousedown', event => {
    if (!document.querySelector('#' + EXTEND_ID).contains(event.target)) {
      clear();
    }
  });

  useEffect(() => {
    port.onMessage.addListener(setMessage);
  }, []);

  return (
    <>
      {visible && (
        <div ref={ref} style={{ ...position, zIndex: 9999 }} className="absolute border rounded p-1 bg-white">
          {showButton && (
            <button
              onClick={() => {
                setMsgBoxVisible(true);
                port.postMessage(position.text);
              }}
              className="cursor-pointer">
              翻译
            </button>
          )}
          {msgBoxVisible && <ResultBox message={message} />}
        </div>
      )}
    </>
  );
}
