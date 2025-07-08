import { v2 as cloudinary } from "cloudinary";
import { ApiError } from "../utils/ApiError.js";
import path from "path";
import fs from "fs";

cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const cloudinaryUpload = async (localFilePath) => {
      if (!localFilePath) {
            throw new ApiError(400, "File not found");
      };

      try {
            const response = await cloudinary.uploader.upload(localFilePath, {
                  resource_type: "auto"
            });

            return response
      } catch (error) {
            throw new ApiError(400, error.message || "File upload failed");
      } finally {
            try {
                  const filePath = path.resolve(localFilePath);
                  await fs.unlink(filePath);
            } catch (error) {
                  console.error(`Error deleting local file: ${localFilePath}`, error);
            }
      }
}

export { cloudinaryUpload };