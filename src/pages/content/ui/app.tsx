import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useEvent } from 'react-use';
import { ResultBox } from '@pages/content/ui/result-box';
const port = chrome.runtime.connect();

interface PositionValue {
  left: number;
  top: number;
  text: string;
}

const validPosition = (v: PositionValue) => v.left && v.top && v.text;
const id = 'chrome-extension-boilerplate-react-vite-content-view-root';
export default function App() {
  const [position, setPosition] = useState<PositionValue>({ left: 0, top: 0, text: '' });
  const [msgBoxVisible, setMsgBoxVisible] = useState(false);
  const showButton = useMemo(() => validPosition(position) && !msgBoxVisible, [msgBoxVisible, position]);
  const visible = showButton || msgBoxVisible;
  const [message, setMessage] = useState('');

  useEvent('mouseup', event => {
    if (document.querySelector('#' + id).contains(event.target)) {
      return;
    }
    const selection = window.getSelection();
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
    setPosition({ left: 0, top: 0, text: '' });
  }, []);

  const ref = useRef<HTMLDivElement>(null);

  useEvent('mousedown', event => {
    if (!document.querySelector('#' + id).contains(event.target)) {
      clear();
    }
  });

  useEffect(() => {
    port.onMessage.addListener(setMessage);
  }, []);

  return (
    <>
      {visible && (
        <div ref={ref} style={position} className="absolute border rounded p-1 bg-white">
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
