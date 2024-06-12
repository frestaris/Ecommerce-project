const Category = require("../models/category");
const Sub = require("../models/sub");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name, slug: slugify(name) });
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(400).send("Create category failed");
  }
};

exports.list = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(400).send("List categories failed");
  }
};

exports.read = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).send("Category not found");
    }
    res.json(category);
  } catch (err) {
    res.status(400).send("Read category failed");
  }
};

exports.update = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      { new: true }
    );
    if (!category) {
      return res.status(404).send("Category not found");
    }
    res.json(category);
  } catch (err) {
    res.status(400).send("Update category failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ slug: req.params.slug });
    if (!category) {
      return res.status(404).send("Category not found");
    }
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(400).send("Remove category failed");
  }
};

exports.getSubs = async (req, res) => {
  try {
    const subs = await Sub.find({ parent: req.params._id }).exec();
    res.json(subs);
  } catch (err) {
    console.log(err);
    res.status(400).send("Get subs failed");
  }
};
