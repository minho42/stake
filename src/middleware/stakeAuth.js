require("dotenv").config();
const checkUser = require("../checkUser.js");

const stakeAuth = async (req, res, next) => {
  try {
    const stakeToken = req.cookies.stakeToken;
    if (!stakeToken) {
      // This error may be triggered if ASX is activated on hellostake.com
      // Switching back to WALL ST should resolve this
      throw new Error("stakeAuth: !stakeToken");
    }
    const isTokenValid = await checkUser(stakeToken);
    if (!isTokenValid) {
      throw new Error("Token not valid");
    }
    // console.log(`auth.stakeToken: ${stakeToken}`);
    req.stakeToken = stakeToken;

    next();
  } catch (error) {
    console.log(error);
    res.clearCookie("stakeToken");
    res.status(401).send({ error: "Please authenticate" });
  }
};

module.exports = stakeAuth;
