require("dotenv").config();
const apicache = require("apicache");
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const fetchCurrency = require("./utils");
const stakeRouter = require("./routers/stake");
const chartRouter = require("./routers/chart");
const userRouter = require("./routers/user");
const logRouter = require("./routers/log");

const app = express();
const port = process.env.PORT || 4000;
const cache = apicache.middleware;

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(stakeRouter);
app.use(chartRouter);
app.use(userRouter);
app.use(logRouter);

app.get("", (req, res) => {
  res.send({
    data: "It's working!",
  });
});

app.get("/currency/USDAUD", cache("5 minutes"), async (req, res) => {
  const rate = await fetchCurrency("USDAUD");
  res.send({ rate });
});

app.get("/currency/AUDUSD", cache("5 minutes"), async (req, res) => {
  const rate = await fetchCurrency("AUDUSD");
  res.send({ rate });
});

app.get("*", (req, res) => {
  res.status(404).send({
    error: "404 Not Found",
  });
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
