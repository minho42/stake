const axios = require("axios");

const fetchCurrency = async (fromTo) => {
  try {
    const { data } = await axios(
      `https://query1.finance.yahoo.com/v8/finance/chart/${fromTo}=X?&includePrePost=false&interval=3mo&useYfid=false&range=1mo&.tsrc=finance`
    );
    return data.chart.result[0].meta.regularMarketPrice;
  } catch (error) {
    console.log(error);
  }
};

module.exports = fetchCurrency;
