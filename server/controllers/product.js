const Product = require("../models/product");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    console.log(req.body);
    req.body.slug = slugify(req.body.title);
    console.log("Generated slug:", req.body.slug);
    const newProduct = await new Product(req.body).save();
    res.json(newProduct);
  } catch (error) {
    console.log(error);
    res.status(400).send("Create product failed!");
  }
};

exports.read = async (req, res) => {
  let products = await Product.find({});
  res.json(products);
};
