import { useCallback, useEffect, useRef } from "react";

export function useChatScroll(messages: any, loadingOlder: any) {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const isAutoScrollRef = useRef(true);

  const handleScroll = useCallback(() => {
    const el: any = containerRef.current;
    if (!el) return;

    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;

    isAutoScrollRef.current = nearBottom;
  }, []);

  useEffect(() => {
    if (!containerRef.current || !isAutoScrollRef.current) return;

    const container = containerRef.current;
    (container as any).scrollTop = (container as any).scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!loadingOlder) return;

    const el: any = containerRef.current;
    if (!el) return;

    const prevScrollHeight = el.scrollHeight;

    return () => {
      const newScrollHeight = el.scrollHeight;
      el.scrollTop = newScrollHeight - prevScrollHeight + el.scrollTop;
    };
  }, [loadingOlder]);

  const scrollToBottom = useCallback(() => {
    if (!containerRef.current || !isAutoScrollRef.current) return;

    const container = containerRef.current;
    (container as any).scrollTop = (container as any).scrollHeight;
  }, []);

  return {
    containerRef,
    bottomRef,
    handleScroll,
    scrollToBottom,
  };
}