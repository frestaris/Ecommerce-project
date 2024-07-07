import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const Invoice = ({ order }) => (
  <Document>
    <Page style={styles.body}>
      <Text style={styles.header} fixed>
        ~ {new Date().toLocaleString()} ~
      </Text>
      <Text style={styles.title}>Order Invoice</Text>
      <Text style={styles.author}>React Redux Ecommerce</Text>
      <Text style={styles.subtitle}>Order Summary</Text>

      {/* Table */}
      <View style={styles.table}>
        <View style={styles.tableRowHeader}>
          <Text style={styles.columnHeader}>Title</Text>
          <Text style={styles.columnHeader}>Price</Text>
          <Text style={styles.columnHeader}>Quantity</Text>
          <Text style={styles.columnHeader}>Brand</Text>
          <Text style={styles.columnHeader}>Color</Text>
        </View>
        {order.products.map((product, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.column}>{product.product.title}</Text>
            <Text style={styles.column}>
              ${product.product.price.toLocaleString()}
            </Text>
            <Text style={styles.column}>{product.count}</Text>
            <Text style={styles.column}>{product.product.brand}</Text>
            <Text style={styles.column}>{product.color}</Text>
          </View>
        ))}
      </View>

      {/* Additional Details */}
      <Text style={styles.text}>
        Date: {"               "}
        {new Date(order.paymentIntent.created * 1000).toLocaleString()}
      </Text>
      <Text style={styles.text}>
        Order Id: {"         "}
        {order.paymentIntent.id}
      </Text>
      <Text style={styles.text}>
        Order Status: {"  "}
        {order.orderStatus}
      </Text>
      <Text style={styles.text}>
        Total Paid: {"       "}${order.paymentIntent.amount.toLocaleString()}
      </Text>

      <Text style={styles.footer}> ~ Thank you for shopping with us ~ </Text>
    </Page>
  </Document>
);

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 10,
  },
  author: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  table: {
    marginTop: 10,
    marginBottom: 10,
  },
  tableRowHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    alignItems: "center",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
    fontSize: 10,
    marginBottom: 5,
  },
  columnHeader: {
    flex: 1,
    textAlign: "center",
  },
  column: {
    flex: 1,
    textAlign: "center",
  },
  text: {
    fontSize: 12,
    marginVertical: 5,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  footer: {
    padding: "100px",
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
});

export default Invoice;
