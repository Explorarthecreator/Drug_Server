const router = require("express").Router();
const auth = require("../middleware/auth");
const { validateRequest } = require("../middleware/validate");
const { param } = require("express-validator");
const Drug = require("../models/drugModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

//This is to create a drug
router.post("/", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json(false);

    jwt.verify(token, process.env.JWT_SECRET);
    const decodedUser = await jwt.decode(token);
    const user = await User.findById(decodedUser.user);

    const { name, type, prDate, exDate, authnumber, status } = req.body;

    const newDrug = new Drug({
      userId: user._id,
      name,
      type,
      prDate,
      exDate,
      authnumber,
      status,
    });

    const savedDrug = await newDrug.save();

    res.json(savedDrug);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

//This is to update a drug using the drugID
router.put("/:id", async (req, res) => {
  try {
    const tr = await Drug.findById(req.params.id);
    await tr.updateOne({ $set: req.body });
    res.status(200).json("updated");
  } catch (err) {
    res.status(500).json("error");
  }
});

//This is to get all the drugs registered. (Only admin can access this module)
router.get("/", async (req, res) => {
  try {
    const drugs = await Drug.find();
    res.json(drugs);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

//This is to get drugs registered by a particular logged in user
router.get("/user", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json(false);

    jwt.verify(token, process.env.JWT_SECRET);
    const decodedUser = await jwt.decode(token);
    const user = await User.findById(decodedUser.user);
    const drugs = await Drug.find({ userId: user._id });
    res.json(drugs);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

//This is to check if the Nafdac authnumber exists in the database
router.post("/nafdac", async (req, res) => {
  const { authnumber } = req.body;
  const existingDrug = await Drug.findOne({ authnumber });
  if (!existingDrug)
    return res.status(401).json({ errorMessage: "This drug does not exist." });
  res.status(200).json(existingDrug);
});

//Get a drug using the search field
router.get(
  "/:id",
  param("id").isMongoId().withMessage("Please enter a valid Drug ID"),
  validateRequest,
  async (req, res) => {
    try {
      const post = await Drug.findById(req.params.id);

      if (!post) return res.status(404).json("Drug not found");

      res.status(200).json(post);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

module.exports = router;
