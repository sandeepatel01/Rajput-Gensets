import multer from "multer";
import path from "path";
import { ApiError } from "../utils/ApiError.js";

const storage = multer.diskStorage({
      destination: (req, file, cb) => {
            cb(null, "./public/temp");
      },
      filename: (req, file, cb) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const extension = path.extname(file.originalname);
            cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
      },
});

const fileFilter = (req, file, cb) => {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
      } else {
            cb(new ApiError(400, "Invalid file type. Only JPEG, JPG, and PNG formats are allowed."));
      }
};

export const upload = multer({
      storage,
      fileFilter,
      limits: {
            fileSize: 5 * 1024 * 1024, // 5 MB
      },
});
