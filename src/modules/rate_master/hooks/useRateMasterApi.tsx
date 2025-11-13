import { RateMasterHttpService } from "@api/endpoints/ratemaster.endpoint";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { queryClient, useQuery } from "@lib/react-query";
import { GetRateSheetsFilters, ISheetRow, IDistinctShippingLine, IDistinctPort } from "../index.types";

const RATE_MASTER_KEY = 'rate-master';
const ACTIVE_RATE_SHEETS_KEY = 'active-rate-sheets';
const DYNAMIC_FILTERS_KEY = 'dynamic-filters';
const DISTINCT_SHIPPING_LINES_KEY = 'distinct-shipping-lines';
const DISTINCT_PORTS_KEY = 'distinct-ports';

export const useGetActiveRateSheets = (filters: GetRateSheetsFilters, enabled: boolean = true) => {
    return useQuery({
        queryKey: [RATE_MASTER_KEY, ACTIVE_RATE_SHEETS_KEY, filters],
        queryFn: (): Promise<ISheetRow[]> => 
            RateMasterHttpService.getActiveRateSheets(filters),
        enabled: enabled, // Can run with or without shippingLineId
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

export const useGetDistinctShippingLines = (enabled: boolean = true) => {
    return useQuery({
        queryKey: [RATE_MASTER_KEY, DISTINCT_SHIPPING_LINES_KEY],
        queryFn: (): Promise<IDistinctShippingLine[]> => 
            RateMasterHttpService.getDistinctShippingLines(),
        enabled,
        staleTime: 15 * 60 * 1000, // 15 minutes - shipping lines don't change frequently
        gcTime: 30 * 60 * 1000, // 30 minutes
    });
};

export const useGetDistinctPorts = (shippingLineId?: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: [RATE_MASTER_KEY, DISTINCT_PORTS_KEY, shippingLineId],
        queryFn: (): Promise<IDistinctPort[]> => 
            RateMasterHttpService.getDistinctPorts(shippingLineId!),
        enabled: enabled , // Only run if shippingLineId is provided
        staleTime: 10 * 60 * 1000, // 10 minutes - ports for a shipping line don't change frequently
        gcTime: 20 * 60 * 1000, // 20 minutes
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [RATE_MASTER_KEY] });
            toast.success(`Successfully uploaded rate sheet entries`);
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



 export const filterRateSheetMaster =async (filters:GetRateSheetsFilters) =>{
     const res = await RateMasterHttpService.getActiveRateSheets(filters)
     const rateSheets = res.map((rateSheet) => ({
        SHIPPING_LINE: rateSheet?.SHIPPING_LINE?.vendor_name || '',
        START_PORT: rateSheet?.START_PORT?.port_name || '',
        END_PORT: rateSheet?.END_PORT?.port_name || '',
        CONTAINER_TYPE: rateSheet.CONTAINER_TYPE,
        CONTAINER_SIZE: rateSheet.CONTAINER_SIZE,
        TRADE_TYPE: rateSheet.TRADE_TYPE,
        EFFECTIVE_FROM: new Date(rateSheet.EFFECTIVE_FROM).toLocaleDateString(),
        EFFECTIVE_TO: rateSheet?.EFFECTIVE_TO ? new Date(rateSheet.EFFECTIVE_TO).toLocaleDateString() : null,
        CHARGE_NAME: rateSheet.CHARGE_NAME,
        HSN_CODE: rateSheet.HSN_CODE,
        PRICE: rateSheet.PRICE,
      }))
    return rateSheets
 }
   