const Coupon = require("../models/coupon");

exports.create = async (req, res) => {
  try {
    const { name, expiry, discount } = req.body.coupon;
    res.json(await new Coupon({ name, expiry, discount }).save());
  } catch (err) {
    console.error("Create coupon failed:", err);
    res.status(400).send("Create coupon failed");
  }
};

exports.list = async (req, res) => {
  try {
    res.json(await Coupon.find({}).sort({ createdAt: -1 }).exec());
  } catch (err) {
    res.status(400).send("List coupon failed");
  }
};

exports.remove = async (req, res) => {
  try {
    res.json(await Coupon.findByIdAndDelete(req.params.couponId).exec());
  } catch (err) {
    res.status(400).send("Remove coupon failed");
  }
};
