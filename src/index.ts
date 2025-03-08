import express, { Application } from "express";
import { config } from "dotenv";
import cors from "cors";
import schoolRoutes from "./routes/schoolRoutes.js";
import { connectDb } from "./utils/db.js";
import { errorMiddleware } from "./utils/errorHandle.js";

config();
const app: Application = express();
const port: number = Number(process.env.PORT) || 5001;

app.use(express.json());
app.use(cors());

const startServer = async () => {
    try {
        const db = await connectDb();
        app.locals.db = db; // Attach DB to `app.locals`
        app.use("/api", schoolRoutes(db)); // Pass DB to routes
        app.use(errorMiddleware);

        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port} 🚀`);
        });
    } catch (error) {
        console.error("Server startup error:", error);
        process.exit(1);
    }
};

startServer();
