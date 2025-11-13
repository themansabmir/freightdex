import { useMemo } from 'react';
import { useGetDistinctShippingLines, useGetDistinctPorts } from './useRateMasterApi';
import { columnsArr } from '../contants';
import { RateMasterHttpService } from "@api/endpoints/ratemaster.endpoint";
import { toast } from "react-toastify";

export const  handleDownloadTemplate = async () => {
    try {
      await RateMasterHttpService.downloadTemplate('rate-master');
      toast.success('Template Downloaded');
    } catch (error) {
      console.log(error);
      toast.error('Failed to download template');
    }
  };

interface UseRateMasterOptionsProps {
  shippingLineId?: string;
}

interface DropdownOption {
  label: string;
  value: string;
}

interface UseRateMasterOptionsReturn {
  shippingLineOptions: DropdownOption[];
  portOptions: DropdownOption[];
  columns: typeof columnsArr;
  isLoadingShippingLines: boolean;
  isLoadingPorts: boolean;
}

export const useRateMasterOptions = ({ 
  shippingLineId 
}: UseRateMasterOptionsProps = {}): UseRateMasterOptionsReturn => {
  
  const { data: shippingLines, isLoading: isLoadingShippingLines } = useGetDistinctShippingLines();
  const { data: ports, isLoading: isLoadingPorts } = useGetDistinctPorts(shippingLineId);

  const shippingLineOptions = useMemo(() => {
    return (
      shippingLines?.map((line) => ({
        label: line.vendor_name,
        value: line._id,
      })) || []
    );
  }, [shippingLines]);

  const portOptions = useMemo(() => {
    return (
      ports?.map((port) => ({
        label: port.port_name,
        value: port._id,
      })) || []
    );
  }, [ports]);

  const columns = useMemo(() => columnsArr, []);

  return {
    shippingLineOptions,
    portOptions,
    columns,
    isLoadingShippingLines,
    isLoadingPorts,
  };
};
