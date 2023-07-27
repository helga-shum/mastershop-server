export const getAll = async (req, res) => {
  try {
    var sortObject = {};
    var field = {};

    const sortWith = req.query.sortBy;
    const categoryId = req.query.category;
    const { size, fabric, brand, highPrice, lowPrice, search, page, limit } =
      req.query;
    const brandArr = brand.split(",");
    const fabricArr = fabric.split(",");
    const sizeArr = size.split(",");

    sortObject[sortWith] = 1;
    if (search) {
      field.title = { $regex: `${search}`, $options: "i" };
    }
    if (categoryId) {
      field.category = categoryId;
    }
    field.price = { $gt: lowPrice, $lte: highPrice };
    field.fabric = { $in: fabricArr };
    field.brand = { $in: brandArr };
    field.sizes = { $all: sizeArr };

    const products = await Product.find(field)
      .sort(sortObject)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Product.countDocuments();
    res.json({
      products,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Can not get products",
    });
  }
};
