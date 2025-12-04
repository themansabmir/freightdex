# DocumentLayout Component

A **reusable, generic document layout component** for rendering professional invoices, quotations, proforma invoices, credit notes, and other financial documents.

## Features

- ✅ **Single Reusable Component** - Works for all document types (invoices, quotations, etc.)
- ✅ **Flexible Data Structure** - Normalized interface that adapts to different data sources
- ✅ **Professional Styling** - Clean, invoice-style layout with print support
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Print-Ready** - Optimized for A4 printing
- ✅ **Customizable Actions** - Edit, Download, Print buttons
- ✅ **Status Badges** - Visual status indicators
- ✅ **Conditional Columns** - Shows/hides table columns based on data

## Usage

### 1. Basic Usage

```tsx
import DocumentLayout from '@shared/components/DocumentLayout';
import { IDocumentData } from '@shared/components/DocumentLayout';

const MyComponent = () => {
  const documentData: IDocumentData = {
    documentType: 'INVOICE',
    documentNumber: 'INV-001',
    status: 'PAID',
    billToName: 'Acme Corp',
    issueDate: '2025-12-03',
    lineItems: [
      {
        description: 'Service Item',
        quantity: 1,
        pricePerUnit: 100,
        totalAmount: 100,
        currency: 'USD',
      },
    ],
    grandTotal: 100,
    currency: 'USD',
  };

  return (
    <DocumentLayout
      document={documentData}
      onEdit={() => console.log('Edit')}
      onDownload={() => console.log('Download')}
      onPrint={() => window.print()}
      showActions={true}
    />
  );
};
```

### 2. Using with Adapters

For existing data structures (Quotations, Finance Documents), use the provided adapters:

```tsx
import DocumentLayout from '@shared/components/DocumentLayout';
import { quotationToDocumentData, financeDocumentToDocumentData } from '@shared/components/DocumentLayout/adapters';

// For Quotations
const QuotationView = ({ quotation }) => {
  const documentData = quotationToDocumentData(quotation);
  return <DocumentLayout document={documentData} />;
};

// For Finance Documents (Invoices, Proforma, Credit Notes)
const InvoiceView = ({ invoice }) => {
  const documentData = financeDocumentToDocumentData(invoice);
  return <DocumentLayout document={documentData} />;
};
```

## Props

### DocumentLayout Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `document` | `IDocumentData` | required | Document data to render |
| `onEdit` | `() => void` | optional | Edit button handler |
| `onDownload` | `() => void` | optional | Download button handler |
| `onPrint` | `() => void` | optional | Print button handler |
| `showActions` | `boolean` | `true` | Show/hide action buttons |

### IDocumentData Interface

```typescript
interface IDocumentData {
  // Document metadata
  documentType: 'QUOTATION' | 'INVOICE' | 'PROFORMA' | 'CREDIT_NOTE';
  documentNumber: string;
  status: string;
  
  // Company info
  companyName?: string;
  companyAddress?: string[];
  companyLogo?: string;
  
  // Customer/Billing info
  billToName: string;
  billToEmail?: string;
  billToAddress?: string[];
  billToId?: string;
  
  // Dates
  issueDate: string;
  dueDate?: string;
  validFrom?: string;
  validTo?: string;
  
  // Additional metadata
  metadata?: Array<{ label: string; value: string }>;
  
  // Shipment/Route info
  shipmentInfo?: {
    label: string;
    items: Array<{ label: string; value: string }>;
  };
  
  // Line items
  lineItems: IDocumentLineItem[];
  
  // Totals
  subtotal?: number;
  discount?: number;
  taxable?: number;
  gst?: number;
  grandTotal: number;
  currency: string;
  
  // Footer
  termsAndConditions?: string[];
  notes?: string;
}
```

## Adapters

### quotationToDocumentData

Transforms `IQuotation` → `IDocumentData`

```tsx
import { quotationToDocumentData } from '@shared/components/DocumentLayout/adapters';

const documentData = quotationToDocumentData(quotation);
```

### financeDocumentToDocumentData

Transforms `IFinanceDocument` → `IDocumentData`

```tsx
import { financeDocumentToDocumentData } from '@shared/components/DocumentLayout/adapters';

const documentData = financeDocumentToDocumentData(invoice);
```

## Styling

The component uses SCSS for styling. The main stylesheet is located at:
```
/shared/components/DocumentLayout/document-layout.scss
```

### Customization

You can customize the appearance by:
1. Modifying the SCSS variables
2. Overriding specific classes
3. Passing custom company info and logo

## Examples

### Example 1: Quotation in a Drawer

```tsx
<Drawer open={open} onClose={onClose}>
  <DocumentLayout
    document={quotationToDocumentData(quotation)}
    showActions={false}
  />
</Drawer>
```

### Example 2: Invoice with Actions

```tsx
<DocumentLayout
  document={financeDocumentToDocumentData(invoice)}
  onEdit={() => navigate('/edit')}
  onDownload={() => downloadPDF(invoice.id)}
  onPrint={() => window.print()}
  showActions={true}
/>
```

### Example 3: Custom Document

```tsx
const customDocument: IDocumentData = {
  documentType: 'PROFORMA',
  documentNumber: 'PRO-2025-001',
  status: 'DRAFT',
  companyName: 'My Company',
  companyAddress: ['123 Main St', 'City, State 12345'],
  billToName: 'Client Name',
  billToEmail: 'client@example.com',
  issueDate: new Date().toISOString(),
  validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  lineItems: [
    {
      description: 'Consulting Services',
      quantity: 10,
      pricePerUnit: 150,
      totalAmount: 1500,
      currency: 'USD',
    },
  ],
  grandTotal: 1500,
  currency: 'USD',
  termsAndConditions: [
    'Payment due within 30 days',
    'Late fees may apply',
  ],
};

<DocumentLayout document={customDocument} />
```

## Print Support

The component is optimized for printing:
- A4 paper size (210mm width)
- Proper margins and spacing
- Action buttons hidden when printing
- Print-friendly fonts and colors

To print:
```tsx
<DocumentLayout
  document={documentData}
  onPrint={() => window.print()}
/>
```

## Status Badges

Supported status values with automatic styling:
- `DRAFT` - Gray
- `SENT` - Blue
- `ACCEPTED` / `PAID` - Green
- `REJECTED` / `CANCELLED` - Red
- `EXPIRED` - Amber
- `ACKNOWLEDGED` / `ISSUED` - Indigo

## Responsive Behavior

- **Desktop**: Full layout with all columns
- **Tablet**: Adjusted spacing and font sizes
- **Mobile**: Stacked layout, smaller fonts, simplified table

## File Structure

```
shared/components/DocumentLayout/
├── DocumentLayout.tsx      # Main component
├── document-layout.scss    # Styles
├── adapters.ts            # Data transformation utilities
├── index.ts               # Exports
└── README.md              # This file
```

## Migration Guide

### From Custom Invoice Layout

**Before:**
```tsx
<InvoiceLayout invoice={invoice} />
```

**After:**
```tsx
import DocumentLayout from '@shared/components/DocumentLayout';
import { financeDocumentToDocumentData } from '@shared/components/DocumentLayout/adapters';

<DocumentLayout document={financeDocumentToDocumentData(invoice)} />
```

### From Custom Quotation Drawer

**Before:**
```tsx
<QuotationDetailsDrawer quotation={quotation} />
```

**After:**
```tsx
import DocumentLayout from '@shared/components/DocumentLayout';
import { quotationToDocumentData } from '@shared/components/DocumentLayout/adapters';

<DocumentLayout document={quotationToDocumentData(quotation)} />
```

## Benefits

1. **DRY Principle** - Write once, use everywhere
2. **Consistency** - All documents look the same
3. **Maintainability** - Update one component, fix everywhere
4. **Extensibility** - Easy to add new document types
5. **Type Safety** - Full TypeScript support
