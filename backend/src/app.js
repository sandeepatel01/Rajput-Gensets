import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import express from "express";
import { ApiError } from "./utils/ApiError.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.set("trust proxy", "loopback");

const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:3000"];

const corsOptions = {
      origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                  callback(null, true);
            } else {
                  callback(new ApiError(400, "Not allowed by CORS"));
            }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Import routes
import healthCheck from "./routes/healthCheck.route.js";

app.use("/api/v1/healthcheck", healthCheck);


export default app;