const axios = require("axios");

const getNasdaqRatings = async (symbol) => {
  const config = {
    method: "get",
    url: `https://api.nasdaq.com/api/analyst/${symbol}/ratings`,
    headers: {
      authority: "api.nasdaq.com",
      pragma: "no-cache",
      "cache-control": "no-cache",
      "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
      accept: "application/json, text/plain, */*",
      "sec-ch-ua-mobile": "?0",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36",
      "sec-ch-ua-platform": '"macOS"',
      origin: "https://www.nasdaq.com",
      "sec-fetch-site": "same-site",
      "sec-fetch-mode": "cors",
      "sec-fetch-dest": "empty",
      referer: "https://www.nasdaq.com/",
      "accept-language": "en-AU,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
    },
  };
  try {
    const { data } = await axios(config);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getNasdaqConsensus = async (symbol) => {
  const config = {
    method: "get",
    url: `https://api.nasdaq.com/api/analyst/${symbol}/targetprice`,
    headers: {
      authority: "api.nasdaq.com",
      pragma: "no-cache",
      "cache-control": "no-cache",
      "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
      accept: "application/json, text/plain, */*",
      "sec-ch-ua-mobile": "?0",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36",
      "sec-ch-ua-platform": '"macOS"',
      origin: "https://www.nasdaq.com",
      "sec-fetch-site": "same-site",
      "sec-fetch-mode": "cors",
      "sec-fetch-dest": "empty",
      referer: "https://www.nasdaq.com/",
      "accept-language": "en-AU,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
    },
  };
  try {
    const { data } = await axios(config);
    return data;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getNasdaqRatings,
  getNasdaqConsensus,
};
