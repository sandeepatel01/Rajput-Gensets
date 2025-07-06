import ms from "ms";


export function generateCookieOptions({ rememberMe = false } = {}) {
      const expiry = rememberMe ? process.env.REFRESH_TOKEN_EXPIRY_REMEMBER_ME : process.env.REFRESH_TOKEN_EXPIRY;

      return {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: ms(expiry),
      };
}
