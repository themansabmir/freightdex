import { usePortApi } from '@modules/port/hooks/usePortApi';
import { formatShippingLines, formatVendors } from '@modules/vendor/helper';
import { useVendorApi } from '@modules/vendor/hooks/useVendorApi';
import { useEffect, useState } from 'react';

interface options {
  label: string;
  value: string;
}
type DropdownOptions = options[] | undefined | [];
const searchQuery = {
  search: '',
  limit: '0',
  skip: '0',
  sortBy: '',
  sortOrder: '',
};
export const useDropDownData = () => {
  const [shipper, setShipper] = useState<DropdownOptions>([]);
  const [consignee, setConsignee] = useState<DropdownOptions>([]);
  const [notify, setNotify] = useState<DropdownOptions>([]);
  const [agent, setAgent] = useState<DropdownOptions>([]);
  const [shippingLine, setShippingLine] = useState<DropdownOptions>([]);
  const [portData, setPortData] = useState<DropdownOptions>([]);

  //DYNAMIC DATA FOR DROPDOWNS
  const { useGetVendors } = useVendorApi();
  const { useGetPort } = usePortApi();
  const { data: ports } = useGetPort(searchQuery);
  const { data: vendors, isLoading } = useGetVendors(searchQuery);

  useEffect(() => {
    if (vendors?.response) {
      const shippers = formatVendors(vendors?.response, 'shipper');
      const consignees = formatVendors(vendors?.response, 'consignee');
      const agents = formatVendors(vendors?.response, 'agent');
      const notify = formatVendors(vendors?.response, 'notify');
      const shippingLines = formatShippingLines(vendors?.response);
      const portOptions = ports?.response?.map((item) => {
        return {
          label: `${item.port_name}-(${item.port_code?.toUpperCase()})`,
          value: item._id,
        };
      });

      setShipper(shippers);
      setConsignee(consignees);
      setAgent(agents);
      setNotify(notify);
      setShippingLine(shippingLines);
      setPortData(portOptions);
    }
  }, [isLoading]);

  return {
    shipper,
    consignee,
    notify,
    agent,
    portData,
    shippingLine,
  };
};
