import mysql from "mysql2/promise";
import { config } from "dotenv";
config();
const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const pass = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;
export const connectDb = async () => {
    try {
        const connection = await mysql.createConnection({
            host,
            user,
            password: pass,
            database,
        });
        console.log("Database connected successfully");
        return connection;
    }
    catch (error) {
        console.error("Database connection failed:", error);
        throw new Error("Database connection failed");
    }
};
