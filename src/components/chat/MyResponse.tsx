import type { MessagePair } from '@/types';

/* #f3efda milk */ 
/* #e972be pink */
/* #3b142a red */

export const MyResponse = ({ messagePair }: { messagePair: MessagePair }) => {
  return (
    <div className="flex gap-3 justify-end">
      <div className="max-w-[70%] rounded-tl-3xl rounded-bl-3xl rounded-tr-md rounded-br-3xl px-4 py-3 bg-[#471833] text-[#f3efda]">
        <div className="whitespace-pre-wrap wrap-break-word text-[18px] max-md:text-[15px]">{messagePair.query}</div>
      </div>
    </div>
  );
};
