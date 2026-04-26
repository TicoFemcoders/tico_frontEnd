import { useState, useCallback, useRef, useEffect } from "react";
export const useInfiniteScroll = (loading, hasMore, items = [], offset = 10) => {
    const [page, setPage] = useState(0);
    const [canScroll, setCanScroll] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(false);
    const scrollRef = useRef(null);

    const checkScroll = useCallback(() => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            setCanScroll(scrollHeight > clientHeight);
            setIsAtBottom(scrollTop + clientHeight >= scrollHeight - offset);
        }
    }, [offset]);
    useEffect(() => {
        const timer = setTimeout(checkScroll, 100); 
        return () => clearTimeout(timer);
    }, [checkScroll, items]);
    const handleScroll = useCallback((event) => {
        checkScroll(); 
        const node = event.currentTarget;
        if (node.scrollTop + node.clientHeight >= node.scrollHeight - offset) {
            if (!loading && hasMore) {
                setPage(prev => prev + 1);
            }
        }
    }, [loading, hasMore, offset, checkScroll]);
    return { page, setPage, handleScroll, scrollRef, canScroll, isAtBottom };
};