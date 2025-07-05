import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/db.js";
import colors from "colors";

dotenv.config({
      path: "./.env"
});

const PORT = process.env.PORT || 5000;
connectDB()
      .then(() => {
            app.listen(PORT, () => {
                  console.log(`The app is listen at http://localhost:${PORT}`.bgBlue.white);
            })
      })
      .catch((error) => {
            console.error("Mongodb Connection error", error);
            process.exit(1)
      });