import mysql, { Connection } from "mysql2/promise";
import { config } from "dotenv";

config();

const host = process.env.DB_HOST as string
const user = process.env.DB_USER as string
const pass = process.env.DB_PASSWORD as string 
const database = process.env.DB_NAME as string

export const connectDb = async (): Promise<Connection> => {
    try {
        const connection = await mysql.createConnection({
            host,
            user,
            password: pass,
            database,
        });
        console.log("Database connected successfully");
        return connection;
    } catch (error) {
        console.error("Database connection failed:", error);
        throw new Error("Database connection failed");
    }
};
