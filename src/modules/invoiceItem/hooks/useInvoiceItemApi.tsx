import { InvoiceItemHttpService } from "@api/endpoints/invoiceitem.endpoint";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { queryClient, useQuery } from "@lib/react-query";
import { FormValues } from "../index.types";

const INVOICEITEM_KEY = 'invoiceitem';


export const useSaveInvoiceItem = () => {
    const saveInvoiceItemMutation = useMutation({
        mutationFn: (payload: unknown) => InvoiceItemHttpService.saveInvoiceItem(payload),
        onError: ({ message }) => toast.error(message),
        onSettled: (data) => {
            if (data) {
                queryClient.invalidateQueries({ queryKey: [INVOICEITEM_KEY] });
                toast.success(`Invoice item saved successfully`);
            }
        },
    });

    return {
        saveInvoiceItem: saveInvoiceItemMutation.mutateAsync,
        isSaving: saveInvoiceItemMutation.isPending,
    };
};

export const useGetAllInvoiceItems = () => {
    return useQuery({
        queryKey: [INVOICEITEM_KEY],
        queryFn: (): Promise<FormValues[]> => InvoiceItemHttpService.getAllInvoiceItems(),
    });
};