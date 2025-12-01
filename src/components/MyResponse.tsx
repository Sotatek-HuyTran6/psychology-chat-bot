import type { MessagePair } from '../types';

export const MyResponse = ({ messagePair }: { messagePair: MessagePair }) => {
  return (
    <div className="flex gap-3 justify-end">
      <div className="max-w-[70%] rounded-tl-3xl rounded-bl-3xl rounded-tr-md rounded-br-3xl px-4 py-3 bg-[#e9eef6] text-[#1f1f1f]">
        <div className="whitespace-pre-wrap wrap-break-word">{messagePair.query}</div>
      </div>
    </div>
  );
};
