import ENV from "../ENV.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const socketAuthMiddleWare = async (socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;
    const token = cookieHeader
      ?.split(";")
      .map((row) => row.trim())
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

      
    if (!token) {
      // console.log("No token is provided to socket");
      return next(new Error("User is not authorised -- no token provided"));
    }

    let decoded;
    try {
      decoded = jwt.verify(decodeURIComponent(token), ENV.jwtSecretKey, {
        maxAge: ENV.EXPIRY,
      });
    } catch (error) {
      // console.log("Invalid socket token", error.message);
      return next(
        new Error("User is not authorised -- token is expired or invalid"),
      );
    }

    const user = await User.findById(decoded.id).select("-password -dob");

    if (!user) {
      return next(new Error("User is not authorised -- user not found"));
    }

    socket.user = user;
    socket.user_id = user._id.toString();
    return next();
  } catch (error) {
    // console.log("Error in socket authentication", error.message);
    return next(error);
  }
};

export default socketAuthMiddleWare;
