import jwt from "jsonwebtoken";
import ENV from "../ENV.js";
import User from "../models/user.model.js";

const authentication = async function (req, res, next) {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorised - Token is not provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, ENV.jwtSecretKey, { maxAge: ENV.EXPIRY });
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Validation error: access Token is unvalid",error:error.message });
    }

    const findedUser = await User.findById(decoded.id).select("-password -dob");
    
    if (!findedUser) {
      return res
        .status(401)
        .json({ message: "Validation error: user is not found" });
    }

    // console.log("finded user in auth middleware",findedUser  )
    req.user = findedUser;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export default authentication;
