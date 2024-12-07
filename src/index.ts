import express, { Application } from "express";
import { config } from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import schoolRoutes from "./routes/schoolRoutes.js";
import { connectDb } from "./utils/db.js";
import { errorMiddleware } from "./utils/errorHandle.js";

config();

const app: Application = express();
const port: number = parseInt(process.env.PORT as string, 10) || 5001;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const startServer = async () => {
    try {
        const db = await connectDb();
        app.locals.db = db; // Attach DB instance to app
        app.use("/api", schoolRoutes(db)); // Pass DB to routes
        app.use(errorMiddleware);

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
};

await startServer();
