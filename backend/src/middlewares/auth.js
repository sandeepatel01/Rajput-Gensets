import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { UserRolesEnum } from "../utils/constants.js";

const isLoggedIn = async (req, res, next) => {
      const { accessToken } = req.cookies;
      if (!accessToken) {
            throw new ApiError(401, "Access token not found");
      };

      try {
            const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            req.user = decodedToken;
            next();
      } catch (error) {
            throw new ApiError(401, "Invalid or expired access token");
      }
};

const isAdmin = async (req, res, next) => {
      const { role } = req.user;

      if (role !== UserRolesEnum.ADMIN) {
            throw new ApiError(403, "Access denied. You must be an admin to perform this action.");
      };
      next();
};

export {
      isLoggedIn,
      isAdmin
}