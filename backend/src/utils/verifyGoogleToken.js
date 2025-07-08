import { OAuth2Client } from "google-auth-library";
import { ApiError } from "./ApiError.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (token) => {
      if (!token) {
            throw new ApiError(400, "Google token not found");
      }

      let payload;
      try {
            const ticket = await client.verifyIdToken({
                  idToken: token,
                  audience: process.env.GOOGLE_CLIENT_ID,
            });

            payload = ticket.getPayload();
      } catch (error) {
            throw new ApiError(400, "Invalid Google token");
      };

      if (!payload) {
            throw new ApiError(401, "Google token verification failed, playload not found");
      };

      return payload;
};