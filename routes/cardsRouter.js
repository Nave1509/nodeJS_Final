const cardsRouter = require("express").Router();
const authMW = require("../middleware/authMW");
const {
  Card,
  validateCard,
  generateBizNumber,
} = require("../models/cardsModel");

// Get all Cards
cardsRouter.get("/", async (req, res) => {
  try {
    const cards = await Card.find();
    res.send(cards);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

// Get My Cards
cardsRouter.get("/my-cards", authMW(), async (req, res) => {
  try {
    const cards = await Card.find({ user_id: req.user._id });
    res.send(cards);
  } catch (err) {
    res.status(401).send(err.message);
  }
});
// Get Card By ID
cardsRouter.get("/:id", async (req, res) => {
  try {
    const card = await Card.findOne({ _id: req.params.id });
    res.send(card);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

//Create new Card
cardsRouter.post("/", authMW("isBusiness"), async (req, res) => {
  const { error } = validateCard(req.body);
  if (error) {
    res.status(401).send(error.details[0].message);
    return;
  }
  let card = new Card({
    ...req.body,
    bizNumber: await generateBizNumber(),
    user_id: req.user._id,
  });
  try {
    await card.save();
    res.send(card);
  } catch (err) {
    res.status(401).send(err.message);
  }
});
//Edit Card
cardsRouter.put("/:id", authMW("cardOwner"), async (req, res) => {
  const { error } = validateCard(req.body);
  if (error) {
    res.status(401).send(error.details[0].message);
    return;
  }

  try {
    const card = await Card.findOneAndUpdate(
      { _id: req.params.id },
      { ...req.body },
      { new: true }
    );
    res.send(card);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

//Likes Card
cardsRouter.patch("/:id", authMW(), async (req, res) => {
  try {
    const foundCard = await Card.findOne({
      _id: req.params.id,
      "likes.user_id": req.user._id,
    });
    if (foundCard) {
      res.statusMessage = "You already liked this card.";
      res.status(400).send("You already liked this card.");
      return;
    }
    const card = await Card.findOneAndUpdate(
      { _id: req.params.id },
      { "$push": { likes: { user_id: req.user._id } } },
      { new: true }
    );
    res.json(card);
  } catch (err) {
    res.status(401).send(err.message);
  }
});
//Delete Card
cardsRouter.delete("/:id", authMW("isAdmin", "cardOwner"), async (req, res) => {
  try {
    const card = await Card.findOneAndDelete({ _id: req.params.id });
    res.send(card);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

//Change BizNumber
cardsRouter.patch("/changeBiz/:id", authMW("isAdmin"), async (req, res) => {
  if (req.body.bizNumber) {
    try {
      const card = await Card.findOne({
        bizNumber: req.body.bizNumber,
        _id: { $ne: req.params.id },
      });
      if (card) {
        res.status(401).send("A card with this bizNumber already exists.");
        return;
      }
    } catch (err) {
      res.status(401).send(err.message);
    }
  }
  try {
    const card = await Card.findOneAndUpdate(
      { _id: req.params.id },
      { bizNumber: req.body.bizNumber || (await generateBizNumber()) },
      { new: true }
    );
    res.send(card);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = cardsRouter;
