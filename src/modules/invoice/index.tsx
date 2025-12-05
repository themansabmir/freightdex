import Table from '@generator/table';
import { useGetAllFinanceDocuments, financeMap } from './index.hook';
import usePageState from '@shared/hooks/usePageState';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import Drawer from '@shared/components/Drawer';
import PageHeader from '@blocks/page-header';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@shared/components';
import { useNavigate } from 'react-router-dom';
import InvoiceLayout from './InvoiceLayout';

const FinanceListPage = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');

  const navigate = useNavigate();

  const { pagination, setPagination, rows } = usePageState();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const { data: financeDocs, isLoading } = useGetAllFinanceDocuments(type ?? '');
  const financeDocsMap = financeMap(financeDocs?.response ?? []);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'shipment_name',
      header: 'Shipment',
    },
    {
      accessorKey: 'vendor_name',
      header: 'Billing Party',
    },
    {
      accessorKey: 'documentNumber',
      header: 'Document Number',
    },
    {
      accessorKey: 'net_taxable',
      header: 'Net Taxable',
    },
    {
      accessorKey: 'net_gst',
      header: 'Net GST',
    },
    {
      accessorKey: 'grand_total',
      header: 'Grand Total',
    },
    {
      accessorKey: 'issueDate',
      header: 'Issue Date',
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
    },

    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div>
          <button
            onClick={() => {
              setIsExpanded(!isExpanded);
              setSelectedRow(row.original);
            }}
          >
            View
          </button>
        </div>
      ),
    },
  ];

  const pageMap = {
    proforma: 'Proforma',
    invoice: 'Invoice',
    'credit-note': 'Credit Note',
  };
  const BreadCrumbs = [
    {
      label: 'Invoice',
      href: '/invoice',
    },
    {
      label: 'List',
      href: '/invoice',
    },
  ];

  return (
    <div>
      <div className="flex justify-between">
        <PageHeader
          pageName={pageMap[type as keyof typeof pageMap]}
          breadcrumnArray={BreadCrumbs}
          pageDescription=""
          isForm={false}
          isEdit={false}
          isViewMode={false}
        />
        <Button onClick={() => navigate(`/finance_form?type=${type}`)}>Add {pageMap[type as keyof typeof pageMap]}</Button>
      </div>
      <Table
        data={financeDocsMap}
        isLoading={isLoading}
        columns={columns}
        pagination={pagination}
        sortColumnArr={[]}
        sortingHandler={() => {}}
        selectedRowsArr={rows}
        selectRowsHandler={() => {}}
        rowCount={financeDocs?.total ?? 0}
        setPagination={setPagination}
      />

      <Drawer open={isExpanded} onClose={() => setIsExpanded(false)}>
        {selectedRow ? <InvoiceLayout invoice={selectedRow} /> : <div>No invoice selected</div>}
      </Drawer>
    </div>
  );
};

export default FinanceListPage;
