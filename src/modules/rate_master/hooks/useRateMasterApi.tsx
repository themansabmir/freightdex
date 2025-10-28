import { RateMasterHttpService } from "@api/endpoints/ratemaster.endpoint";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { queryClient, useQuery } from "@lib/react-query";
import { GetRateSheetsFilters, IExcelRow } from "../index.types";

const RATE_MASTER_KEY = 'rate-master';
const ACTIVE_RATE_SHEETS_KEY = 'active-rate-sheets';
const DYNAMIC_FILTERS_KEY = 'dynamic-filters';

export const useGetActiveRateSheets = (filters: GetRateSheetsFilters, enabled: boolean = true) => {
    return useQuery({
        queryKey: [RATE_MASTER_KEY, ACTIVE_RATE_SHEETS_KEY, filters],
        queryFn: (): Promise<IExcelRow[]> => 
            RateMasterHttpService.getActiveRateSheets(filters),
        enabled: enabled && !!filters.shippingLineId, // Only run if shippingLineId is provided
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
};

export const useGetDynamicFilters = (shippingLineId: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: [RATE_MASTER_KEY, DYNAMIC_FILTERS_KEY, shippingLineId],
        queryFn: () => RateMasterHttpService.getDynamicFilters(shippingLineId),
        enabled: enabled && !!shippingLineId,
        staleTime: 10 * 60 * 1000, // 10 minutes - filters don't change frequently
        gcTime: 15 * 60 * 1000, // 15 minutes
    });
};

export const useGetActiveRateSheetsLazy = () => {
    const getActiveRateSheetsMutation = useMutation({
        mutationFn: (filters: GetRateSheetsFilters) => 
            RateMasterHttpService.getActiveRateSheets(filters),
        onError: ({ message }) => toast.error(message || 'Failed to fetch active rate sheets'),
        onSuccess: (data) => {
            console.log('Active rate sheets fetched:', data.length);
        },
    });

    return {
        getActiveRateSheets: getActiveRateSheetsMutation.mutateAsync,
        isLoading: getActiveRateSheetsMutation.isPending,
        data: getActiveRateSheetsMutation.data,
        error: getActiveRateSheetsMutation.error,
    };
};

export const useBulkInsertRateSheet = () => {
    const bulkInsertMutation = useMutation({
        mutationFn: (file: FormData) => RateMasterHttpService.bulkInsertRateSheet(file),
        onError: ({ message }) => toast.error(message || 'Failed to upload rate sheet'),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [RATE_MASTER_KEY] });
            toast.success(`Successfully uploaded ${data.length} rate sheet entries`);
        },
    });

    return {
        bulkInsert: bulkInsertMutation.mutateAsync,
        isUploading: bulkInsertMutation.isPending,
        data: bulkInsertMutation.data,
        error: bulkInsertMutation.error,
    };
};

export const useDownloadTemplate = () => {
    const downloadTemplateMutation = useMutation({
        mutationFn: (moduleName: string) => RateMasterHttpService.downloadTemplate(moduleName),
        onError: ({ message }) => toast.error(message || 'Failed to download template'),
        onSuccess: () => {
            toast.success('Template downloaded successfully');
        },
    });

    return {
        downloadTemplate: downloadTemplateMutation.mutateAsync,
        isDownloading: downloadTemplateMutation.isPending,
    };
};
