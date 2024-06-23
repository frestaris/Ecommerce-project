const Product = require("../models/product");
const slugify = require("slugify");
const User = require("../models/user");

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

exports.listAll = async (req, res) => {
  try {
    const products = await Product.find({})
      .limit(parseInt(req.params.count))
      .populate("category")
      .populate("subs")
      .sort([["createdAt", "desc"]])
      .exec();
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(400).send("Fetching products failed!");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({
      slug: req.params.slug,
    }).exec();
    res.json(deleted);
  } catch (err) {
    console.log(err);
    return res.staus(400).send("Product delete failed");
  }
};

exports.read = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("category")
      .populate("subs")
      .exec();
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(400).send("Fetching product failed!");
  }
};

exports.update = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }

    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).send("Update product failed");
  }
};

exports.list = async (req, res) => {
  try {
    const { sort, order, page } = req.body;
    const currentPage = page || 1;
    const perPage = 4;

    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate("category")
      .populate("subs")
      .sort([[sort, order]])
      .limit(perPage)
      .exec();
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(400).send("Fetching products failed!");
  }
};

exports.productsCount = async (req, res) => {
  try {
    const total = await Product.find({}).estimatedDocumentCount().exec();
    res.json(total);
  } catch (error) {
    console.log(error);
    res.status(400).send("Fetching product count failed!");
  }
};

exports.productStar = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();
  const user = await User.findOne({ email: req.user.email }).exec();
  const { star } = req.body;

  // check if currently logged in user have already added rating to this product?
  let existingRatingObject = product.ratings.find(
    (ele) => ele.postedBy.toString() === user._id.toString()
  );

  // if user haven't left rating yet, push it
  if (existingRatingObject === undefined) {
    let ratingAdded = await Product.findByIdAndUpdate(
      product._id,
      {
        $push: { ratings: { star, postedBy: user._id } },
      },
      { new: true }
    ).exec();
    console.log("ratingAdded", ratingAdded);
    res.json(ratingAdded);
  } else {
    // if user have already left rating, update it
    const ratingUpdated = await Product.updateOne(
      {
        ratings: { $elemMatch: existingRatingObject },
      },
      { $set: { "ratings.$.star": star } },
      { new: true }
    ).exec();
    console.log("ratingUpdated", ratingUpdated);
    res.json(ratingUpdated);
  }
};

exports.listRelated = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();

  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(3)
    .populate("category")
    .populate("subs")
    .exec();

  res.json(related);
};

const handleQuery = async (req, res, query) => {
  const products = await Product.find({
    slug: {
      $regex: `.*${query}.*`,
    },
  })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .exec();

  res.json(products);
};

const handlePrice = async (req, res, price) => {
  try {
    const products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .exec();

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const handleCategory = async (req, res, category) => {
  try {
    const products = await Product.find({ category })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .exec();
    res.json(products);
  } catch (err) {
    console.error(err);
  }
};

const handleStar = async (req, res, stars) => {
  try {
    const aggregates = await Product.aggregate([
      {
        $project: {
          document: "$$ROOT",
          floorAverage: {
            $floor: { $avg: "$ratings.star" },
          },
        },
      },
      { $match: { floorAverage: stars } },
    ]).limit(12);

    const productIds = aggregates.map((agg) => agg._id);
    const products = await Product.find({ _id: { $in: productIds } })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .exec();

    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const handleShipping = async (req, res, shipping) => {
  try {
    const products = await Product.find({ shipping })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .exec();
    res.json(products);
  } catch (err) {
    console.error(err);
  }
};
const handleColor = async (req, res, color) => {
  try {
    const products = await Product.find({ color })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .exec();
    res.json(products);
  } catch (err) {
    console.error(err);
  }
};
const handleBrand = async (req, res, brand) => {
  try {
    const products = await Product.find({ brand })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .exec();
    res.json(products);
  } catch (err) {
    console.error(err);
  }
};

exports.searchFilters = async (req, res) => {
  const { query, price, category, stars, shipping, color, brand } = req.body;

  try {
    if (query) {
      console.log("query", query);
      await handleQuery(req, res, query);
    }

    if (price !== undefined) {
      console.log("price", price);
      await handlePrice(req, res, price);
    }

    if (category) {
      console.log("category --->", category);
      await handleCategory(req, res, category);
    }

    if (stars !== undefined) {
      console.log("stars --->", stars);
      await handleStar(req, res, stars);
    }

    if (shipping) {
      console.log("shipping --->", shipping);
      await handleShipping(req, res, shipping);
    }
    if (color) {
      console.log("color --->", color);
      await handleColor(req, res, color);
    }
    if (brand) {
      console.log("brand --->", brand);
      await handleBrand(req, res, brand);
    }
  } catch (err) {
    console.error("Error handling filters:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
