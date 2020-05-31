const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.productById = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if (err || !product) {
      return res.status(400).json({
        error: "Product is not found",
      });
    }
    req.product = product;
    next();
  });
};

exports.read = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

const Product = require("../models/product");

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }

    //check for all fields
    const {
      name,
      description,
      price,
      category,
      quantity,
      producer,
      shipping,
    } = fields;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !producer ||
      !shipping
    ) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    let product = new Product(fields);

    // 1kb = 1000 bytes
    // 1mb  = 1000000 bytes
    if (files.photo) {
      // console.log("FILE PHOTO:", files.photo);
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be smaller than 1mb in size",
        });
      }

      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }
    product.save((err, result) => {
      if (err) {
        return res.status(400).json({ error: errorHandler(error) });
      }
      res.json(result);
    });
  });
};

exports.remove = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProducts) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      deletedProducts,
      message: "Product deleted successfully",
    });
  });
};

//UPDATE PRODUCT
exports.update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }

    //check for all fields
    const {
      name,
      description,
      price,
      category,
      quantity,
      producer,
      shipping,
    } = fields;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !producer ||
      !shipping
    ) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    let product = req.product;
    product = _.extend(product, fields);
    console.log("Product updated successfully");

    // 1kb = 1000 bytes
    // 1mb  = 1000000 bytes
    if (files.photo) {
      // console.log("FILE PHOTO:", files.photo);
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be smaller than 1mb in size",
        });
      }

      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }
    product.save((err, result) => {
      if (err) {
        return res.status(400).json({ error: errorHandler(error) });
      }
      res.json(result);
    });
  });
};

// **
// * sell / arrival
// * by sell = /products?sortBy=sold&order=desc&limit=4
// * by arrival = /products?sortBy=createAt&order=desc&limit=4
// * if no params are sent, then all products are returned
// *

exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "Product not found",
        });
      }
      res.json(products);
    });
};

// it will find the products base on the req product category
// other products that have same category will return
// the product id will not return

exports.listRelatedProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find({_id: {$ne:req.product}, category: req.product.category})
  .limit(limit)
  .populate("category","_id name")
  .exec((err,products)=>{
    if(err) {
      return res.status(400).json({
        error: "Product not found"
      })
    }
    res.json(products);
  })
}; 

exports.listCategories = (req, res) => {
  Product.distinct("category",{},(err,categories)=>{
    if(err) {
      return res.status(400).json({
        error: "Categories not found"
      })
    }
    res.json(categories);
  })
};