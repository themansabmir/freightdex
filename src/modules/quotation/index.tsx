import PageHeader from '@blocks/page-header';
import { useState, useMemo } from 'react';
import { breadcrumbArray } from './contants';
import { mockQuotations } from './mockData';
import { IQuotation, IQuotationLineItem, IQuotationFilters } from './index.types';
import QuotationFilters from './components/QuotationFilters';
import QuotationForm from './components/QuotationForm';
import { Plus, Pencil } from 'lucide-react';
import { containerSize, containerType, tradeType } from '@modules/rate_master/contants';

const Quotation = () => {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [filters, setFilters] = useState<IQuotationFilters>({
    customerId: '',
    shippingLineId: '',
    containerType: '',
    containerSize: '',
    startPortId: '',
    endPortId: '',
    tradeType: '',
    validFrom: undefined,
    validTo: undefined,
  });
  const [editingQuotation, setEditingQuotation] = useState<IQuotation | null>(null);
  const [quotations, setQuotations] = useState<IQuotation[]>(mockQuotations);

  const customerOptions = useMemo(() => {
    const uniqueCustomers = new Map();
    mockQuotations.forEach((q) => {
      if (!uniqueCustomers.has(q.customerId)) {
        uniqueCustomers.set(q.customerId, {
          label: q.customerName,
          value: q.customerId,
        });
      }
    });
    return Array.from(uniqueCustomers.values());
  }, []);

  const shippingLineOptions = useMemo(() => {
    // In a real app, fetch from API. Here, derive from mock data or use static list
    // For now, let's derive from mockQuotations to show something
    const uniqueLines = new Map();
    mockQuotations.forEach(q => {
      if (!uniqueLines.has(q.shippingLineId)) {
        uniqueLines.set(q.shippingLineId, { label: `Line ${q.shippingLineId.substr(-4)}`, value: q.shippingLineId });
      }
    });
    return Array.from(uniqueLines.values());
  }, []);

  const portOptions = useMemo(() => {
    // Similarly derive ports
    const uniquePorts = new Map();
    mockQuotations.forEach(q => {
      if (!uniquePorts.has(q.startPortId)) uniquePorts.set(q.startPortId, { label: `Port ${q.startPortId.substr(-4)}`, value: q.startPortId });
      if (!uniquePorts.has(q.endPortId)) uniquePorts.set(q.endPortId, { label: `Port ${q.endPortId.substr(-4)}`, value: q.endPortId });
    });
    return Array.from(uniquePorts.values());
  }, []);


  const filteredQuotations = useMemo(() => {
    return quotations.filter((q) => {
      if (filters.customerId && q.customerId !== filters.customerId) return false;
      if (filters.shippingLineId && q.shippingLineId !== filters.shippingLineId) return false;
      if (filters.containerType && q.containerType !== filters.containerType) return false;
      if (filters.containerSize && q.containerSize !== filters.containerSize) return false;
      if (filters.startPortId && q.startPortId !== filters.startPortId) return false;
      if (filters.endPortId && q.endPortId !== filters.endPortId) return false;
      if (filters.tradeType && q.tradeType !== filters.tradeType) return false;

      if (filters.validFrom && new Date(q.validFrom) < filters.validFrom) return false;
      if (filters.validTo && new Date(q.validTo) > filters.validTo) return false;

      return true;
    });
  }, [quotations, filters]);

  const handleCreate = () => {
    setEditingQuotation(null);
    setView('form');
  };

  const handleEdit = (quotation: IQuotation) => {
    setEditingQuotation(quotation);
    setView('form');
  };

  const handleSave = (quotation: IQuotation, lineItems: IQuotationLineItem[]) => {
    console.log('Saving quotation:', quotation);
    console.log('Saving line items:', lineItems);

    if (quotation._id) {
      // Update existing
      setQuotations((prev) =>
        prev.map((q) => (q._id === quotation._id ? quotation : q))
      );
    } else {
      // Create new
      const newQuotation = { ...quotation, _id: `new-${Date.now()}` };
      setQuotations((prev) => [newQuotation, ...prev]);
    }
    setView('list');
  };

  const handleCancel = () => {
    setView('list');
    setEditingQuotation(null);
  };

  const handleClearFilters = () => {
    setFilters({
      customerId: '',
      shippingLineId: '',
      containerType: '',
      containerSize: '',
      startPortId: '',
      endPortId: '',
      tradeType: '',
      validFrom: undefined,
      validTo: undefined,
    });
  };

  if (view === 'form') {
    return (
      <div>
        <PageHeader
          pageName={editingQuotation ? 'Edit Quotation' : 'Create Quotation'}
          pageDescription={editingQuotation ? `Editing ${editingQuotation.quotationNumber}` : 'Create a new quotation'}
          isForm={true}
          isEdit={!!editingQuotation}
          isViewMode={false}
          breadcrumnArray={[...breadcrumbArray, { label: editingQuotation ? 'Edit' : 'Create', href: '' }]}
        />
        <QuotationForm
          quotation={editingQuotation}
          onSave={handleSave}
          onCancel={handleCancel}
          customerOptions={customerOptions}
          shippingLineOptions={shippingLineOptions}
          containerType={containerType}
          containerSize={containerSize}
          portOptions={portOptions}
          tradeType={tradeType}
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        pageName="Quotation"
        pageDescription="Here you can manage your Quotations of all your clients"
        isForm={false}
        isEdit={false}
        isViewMode={false}
        breadcrumnArray={breadcrumbArray}
      />

      <div className="p-6">
        <div className="flex justify-end items-center mb-6">
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <Plus size={18} /> Create Quotation
          </button>
        </div>

        <QuotationFilters
          filters={filters}
          setFilters={setFilters}
          customerOptions={customerOptions}
          shippingLineOptions={shippingLineOptions}
          containerType={containerType}
          containerSize={containerSize}
          portOptions={portOptions}
          tradeType={tradeType}
          clearFilters={handleClearFilters}
        />

        <div className="bg-white rounded-lg shadow overflow-hidden mt-4">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-6 py-3">Quotation No</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Trade</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Valid Until</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredQuotations.map((q) => (
                <tr key={q._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{q.quotationNumber}</td>
                  <td className="px-6 py-4">{q.customerName}</td>
                  <td className="px-6 py-4">{q.containerSize} {q.containerType}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${q.tradeType === 'EXPORT' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                      {q.tradeType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      {q.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(q.validTo).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEdit(q)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Pencil size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredQuotations.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No quotations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Quotation;
