export const sanitizeUser = (userDoc) => {
      if (!userDoc || typeof userDoc.toObject !== "function") return {};

      const {
            password,
            verificationToken,
            verificationTokenExpiry,
            resetPasswordToken,
            resetPasswordTokenExpiry,
            createdAt,
            updatedAt,
            __v,
            ...safeUser
      } = userDoc.toObject();

      return safeUser;
};
