const Order = require("../models/order");

// orders, orderStatus

exports.orders = async (req, res) => {
  try {
    let allOrders = await Order.find({})
      .sort("-createdAt")
      .populate("products.product")
      .exec();

    res.json(allOrders);
  } catch (error) {
    console.error("Error finding orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.orderStatus = async (req, res) => {
  try {
    const { orderId, orderStatus } = req.body;

    let order = await Order.findById(orderId).exec();
    if (!order) {
      return res.status(400).json({ error: "Order not found" });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
