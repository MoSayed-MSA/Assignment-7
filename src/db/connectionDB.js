import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017/");
let dbInstance;

const connectDB = async () => {
    try {
        await client.connect();
        console.log("DB connected successfully....");
        dbInstance = client.db("books_store");
    } catch (error) {
        console.log("Cannot connect to DB", error);
    }
};

export const getDB = () => dbInstance;

export default connectDB;