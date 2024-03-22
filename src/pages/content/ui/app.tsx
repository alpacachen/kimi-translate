import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useEvent } from 'react-use';
import { ResultBox } from '@pages/content/ui/result-box';
import { EXTEND_ID } from '@root/src/shared/data';
import { MoonIcon } from '@chakra-ui/icons';

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
  const portRef = useRef<chrome.runtime.Port>(chrome.runtime.connect());
  useEffect(() => {
    portRef.current.onMessage.addListener(setMessage);
  }, []);

  return (
    <>
      {visible && (
        <div ref={ref} style={{ ...position, zIndex: 9999 }} className="absolute flex border rounded p-1 bg-white">
          {showButton && (
            <button
              onClick={() => {
                setMsgBoxVisible(true);
                portRef.current.postMessage(position.text);
              }}
              className="cursor-pointer">
              <MoonIcon style={{ width: 12, height: 12 }} />
            </button>
          )}
          {msgBoxVisible && <ResultBox message={message} />}
        </div>
      )}
    </>
  );
}
