import { getDB } from "../../db/connectionDB.js";

export const createImplicitAuthorCollection = async (req, res) => {
    try {
        const authorData = req.body;

        if (!authorData || Object.keys(authorData).length === 0) {
            return res.status(400).json({
                message: "Request body is empty or invalid JSON."
            });
        }

        const result = await getDB().collection("authors").insertOne(authorData);

        return res.status(201).json({
            message: "Implicit collection 'authors' created and document inserted successfully.",
            insertedId: result.insertedId
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to insert document into authors collection",
            error: error.message
        });
    }
};