const express = require("express");
const router = express.Router();
const apicache = require("apicache");

const cache = apicache.middleware;

const { getNasdaqRatings } = require("../nasdaq");

router.get("/nasdaq/ratings/:symbol", async (req, res) => {
  const symbol = req.params.symbol;
  if (!symbol || symbol.length < 1) {
    throw new Error("!symbol");
  }
  try {
    const data = await getNasdaqRatings(symbol);
    res.send({ data: data });
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

module.exports = router;
