import styles from './QuotationDocument.module.scss'; // SCSS Module Import

const QuotationDocument = ({ data }: { data: any }) => {
  const quotation = data;
  const subtotal = quotation?.items?.reduce((acc: number, item: any) => acc + item.qty * item.rate, 0);

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <div className={styles.companyName}>{quotation.company.name}</div>
          <div className={styles.muted}>{quotation.company.address}</div>
          <div className={styles.muted}>
            {quotation.company.email} &middot; {quotation.company.phone}
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.quotationNumber}>
            #{quotation.quotationMeta.number}
            <span className={`${styles.badge} ${styles.tradeBadge}`}>{quotation.quotationMeta.tradeType}</span>
          </div>
        </div>
      </header>

      {/* Document Meta Section (Combined from DocumentMetaSection) */}
      <section className={styles.metaSection}>
        {/* Customer Info – Left Row 1 */}
        <div className={`${styles.metaCard} ${styles.metaCardBillTo}`}>
          <div className={styles.metaLabelUpper}>Bill To</div>
          <div className={styles.metaValueBold}>{quotation.customer.name}</div>
          <div className={styles.metaText}>{quotation.customer.address}</div>
          <div className={styles.metaText}>{quotation.customer.email}</div>
        </div>

        {/* Dates – Left Row 2 */}
        <div className={`${styles.metaCard} ${styles.metaCardDates}`}>
          <div className={styles.dateRow}>
            <div>
              <div className={styles.metaLabelUpper}>Issue Date</div>
              <div className={styles.metaValueBold}>{quotation.dates.issueDate}</div>
            </div>

            <div>
              <div className={styles.metaLabelUpper}>Valid Till</div>
              <div className={styles.metaValueBold}>{quotation.dates.validTill}</div>
            </div>
          </div>
        </div>

        {/* Shipment Details – Right (Spans Both Rows) */}
        <div className={`${styles.metaCard} ${styles.metaCardShipment}`}>
          <div className={styles.metaLabelUpperBold}>Shipment Details</div>

          <div className={styles.shipmentGrid}>
            <div>
              <div className={styles.metaLabel}>Shipping Line</div>
              <div className={styles.metaValueBold}>{quotation.shipment.shippingLine}</div>
            </div>

            <div>
              <div className={styles.metaLabel}>Container Type</div>
              <div className={styles.metaValueBold}>{quotation.shipment.containerType}</div>
            </div>

            <div>
              <div className={styles.metaLabel}>Container Count</div>
              <div className={styles.metaValueBold}>{quotation.shipment.containerCount}</div>
            </div>

            {/* <div>
              <div className={styles.metaLabel}>Shipment Mode</div>
              <div className={styles.metaValueBold}>{quotation.shipment.shipmentMode}</div>
            </div> */}
            <div>
              <div className={styles.metaLabel}>Route</div>
              <div className={styles.metaValueBold}>{quotation.shipment.route}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Charges Table */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Description</th>
            <th className={styles.th}>Qty</th>
            <th className={styles.th}>Rate</th>
            <th className={styles.th}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {quotation.items.map((item: any, idx: number) => (
            <tr key={idx} className={styles.tr}>
              <td className={styles.td}>{item.description}</td>
              <td className={styles.td}>{item.qty}</td>
              <td className={styles.td}>${item.rate}</td>
              <td className={styles.td}>${item.qty * item.rate}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <div className={styles.summaryBox}>
        <div className={styles.summaryRow}>
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className={`${styles.summaryRow} ${styles.grandTotal}`}>
          <span>Grand Total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Terms */}
      <footer className={styles.footer}>
        <strong>Terms & Conditions</strong>
        <p>{quotation.terms}</p>
      </footer>
    </div>
  );
};

export default QuotationDocument;
