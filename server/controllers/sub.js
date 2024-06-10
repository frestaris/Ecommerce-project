const Sub = require("../models/sub");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const subCategory = new Sub({ name, parent, slug: slugify(name) });
    await subCategory.save();
    res.json(subCategory);
  } catch (err) {
    res.status(400).send("Create sub-category failed");
  }
};

exports.list = async (req, res) => {
  try {
    const subCategories = await Sub.find({}).sort({ createdAt: -1 });
    res.json(subCategories);
  } catch (err) {
    res.status(400).send("List sub-categories failed");
  }
};

exports.read = async (req, res) => {
  try {
    const subCategory = await Sub.findOne({ slug: req.params.slug });
    if (!subCategory) {
      return res.status(404).send("Sub-category not found");
    }
    res.json(subCategory);
  } catch (err) {
    res.status(400).send("Read sub-category failed");
  }
};

exports.update = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const subCategory = await Sub.findOneAndUpdate(
      { slug: req.params.slug },
      { name, parent, slug: slugify(name) },
      { new: true }
    );
    if (!subCategory) {
      return res.status(404).send("Sub-category not found");
    }
    res.json(subCategory);
  } catch (err) {
    res.status(400).send("Update sub-category failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const subCategory = await Sub.findOneAndDelete({ slug: req.params.slug });
    if (!subCategory) {
      return res.status(404).send("Sub-category not found");
    }
    res.json({ message: "Sub-category deleted successfully" });
  } catch (err) {
    res.status(400).send("Remove sub-category failed");
  }
};
