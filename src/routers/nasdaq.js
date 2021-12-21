const express = require("express");
const router = express.Router();
const apicache = require("apicache");

const cache = apicache.middleware;

const { getNasdaqRatings, getNasdaqConsensus } = require("../nasdaq");

router.get("/nasdaq/ratings/:symbol", cache("10 minutes"), async (req, res) => {
  const symbol = req.params.symbol;
  if (!symbol || symbol.length < 1) {
    throw new Error("!symbol");
  }
  try {
    const data = await getNasdaqRatings(symbol);
    if (data?.status?.rCode !== 200) {
      throw new Error("status != 200");
    }
    res.send({ data: data?.data?.meanRatingType });
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

router.get("/nasdaq/consensus/:symbol", cache("10 minutes"), async (req, res) => {
  const symbol = req.params.symbol;
  if (!symbol || symbol.length < 1) {
    throw new Error("!symbol");
  }
  try {
    const data = await getNasdaqConsensus(symbol);
    if (data?.status?.rCode !== 200) {
      throw new Error("status != 200");
    }
    res.send({ data: data?.data?.consensusOverview });
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

module.exports = router;
