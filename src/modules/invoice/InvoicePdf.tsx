import { Document, Page, StyleSheet, Text, View, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Open Sans',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf' },
    { src: 'https://fonts.gstatic.com/s/opensans/v17/mem5YaGs126MiZpBA-UNirkZzws.ttf', fontWeight: 600 }, // Semibold
  ],
});
// Styles
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  section: { marginBottom: 10 },
  bold: { fontWeight: 'bold' },
  header: { fontSize: 18, marginBottom: 20, textAlign: 'center' },
  tableHeader: { flexDirection: 'row', borderBottom: '1 solid #000', marginTop: 10 },
  row: { flexDirection: 'row', borderBottom: '0.5 solid #ccc' },
  // **CHANGED:** Reduced width for 'col'
  col: { width: '15%', padding: 4 },
  colDesc: { width: '40%', padding: 4 },
  footer: { marginTop: 30, textAlign: 'center' },
});

export const InvoicePDF = ({ invoiceData }: { invoiceData: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Invoice</Text>

      <View style={styles.section}>
        <Text>Invoice #: {invoiceData.id}</Text>
        <Text>Date: {invoiceData.date}</Text>
        <Text>Due in: {invoiceData.terms}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.bold}>Bill To:</Text>
        <Text>{invoiceData.billTo.name}</Text>
        <Text>{invoiceData.billTo.address}</Text>
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.col}>Qty</Text>
        <Text style={styles.colDesc}>Description</Text>
        <Text style={styles.col}>Unit Price</Text>
        <Text style={styles.col}>Tax</Text>
        <Text style={styles.col}>Total</Text>
      </View>

      {invoiceData.items.map((item: any, i: number) => (
        <View key={i} style={styles.row}>
          <Text style={styles.col}>{item.qty}</Text>
          <Text style={styles.colDesc}>{item.description}</Text>
          <Text style={styles.col}>{item.unitPrice}</Text>
          <Text style={styles.col}>{item.tax}%</Text>
          <Text style={styles.col}>{item.total.toFixed(2)}</Text>
        </View>
      ))}

      <View style={styles.section}>
        <Text>Total Tax: ₹{invoiceData.taxTotal}</Text>
        <Text style={styles.bold}>Grand Total: ₹{invoiceData.grandTotal}</Text>
      </View>

      <Text style={styles.footer}>Thank you for your business!</Text>
    </Page>
  </Document>
);
