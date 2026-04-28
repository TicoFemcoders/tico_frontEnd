import { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
export const useProgressiveFetch = (fetchFn, pageSize = 20) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const fetchAllData = useCallback(async () => {
        let currentPage = 0;
        let hasMore = true;
        let accumulatedData = [];
        setLoading(true);
        setIsSyncing(true);
        setData([]); 
        try {
            while (hasMore) {
                const newBatch = await fetchFn(currentPage, pageSize);
    
                if (!newBatch || !Array.isArray(newBatch) || newBatch.length === 0) {
                    hasMore = false;
                    break;
                }
                accumulatedData = [...accumulatedData, ...newBatch];
                setData(accumulatedData); 
                if (currentPage === 0) {
                    setLoading(false);
                }
                if (newBatch.length < pageSize) {
                    hasMore = false;
                } else {
                    currentPage++;
                }
            }
        } catch (err) {
            enqueueSnackbar(err.friendlyMessage || "Error al sincronizar datos en segundo plano", { variant: "error" });
            hasMore = false;
        } finally {
            setLoading(false);
            setIsSyncing(false); 
        }
    }, [fetchFn, enqueueSnackbar, pageSize]);
    
    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);
    return { data, loading, isSyncing, refetch: fetchAllData };
};