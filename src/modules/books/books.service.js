import { getDB } from "../../db/connectionDB.js";


export const createBooksCollection = async (req, res) => {
    try {
        await getDB().createCollection("books", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["title"],
                    properties: {
                        title: {
                            bsonType: "string",
                            minLength: 1,
                            description: "'title' must be a non-empty string and is required"
                        }
                    }
                }
            }
        });

        return res.status(201).json({
            message: "Collection 'books' created successfully with validation rules."
        });
    } catch (error) {
        if (error.codeName === "NamespaceExists") {
            return res.status(400).json({ message: "Collection 'books' already exists." });
        }
        return res.status(500).json({ message: "Error creating collection", error: error.message });
    }
};

export const createCappedLogsCollection = async (req, res) => {
    try {
        const oneMB = 1024 * 1024;

        await db.createCollection("logs", {
            capped: true,
            size: oneMB
        });

        return res.status(201).json({
            message: "collection logs created successfully "
        });
    } catch (error) {
        if (error.codeName === "NamespaceExists") {
            return res.status(400).json({
                message: "Collection 'logs' already exists."
            });
        }

        return res.status(500).json({
            message: "Failed to create capped collection",
            error: error.message
        });
    }
};

export const createTitleIndex = async (req, res) => {
    try {
        const indexName = await db.collection("books").createIndex({ title: 1 });

        return res.status(201).json({
            message: "Index on 'title' created successfully.",
            indexName: indexName
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create index on 'title'",
            error: error.message
        });
    }
};

export const insertOneBook = async (req, res) => {
    try {
        const bookData = req.body;

        if (!bookData || Object.keys(bookData).length === 0) {
            return res.status(400).json({
                message: "Request body is empty or invalid JSON."
            });
        }

        const result = await getDB().collection("books").insertOne(bookData);

        return res.status(201).json({
            acknowledged: result.acknowledged,
            insertedId: result.insertedId
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to insert book",
            error: error.message
        });
    }
};

export const insertManyBooks = async (req, res) => {
    try {
        const booksData = req.body;

        if (!Array.isArray(booksData) || booksData.length < 3) {
            return res.status(400).json({ message: "Please provide an array with at least 3 books." });
        }

        const result = await getDB().collection("books").insertMany(booksData);

        return res.status(201).json({
            acknowledged: result.acknowledged,
            insertedIds: result.insertedIds
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to insert books", error: error.message });
    }
};

export const insertLog = async (req, res) => {
    try {
        const logData = req.body

        if (!logData || Object.keys(logData).length === 0) {
            return res.status(400).json({
                message: "Request body cannot be empty. Send JSON data."
            });
        }

        const result = await getDB().collection("logs").insertOne(logData);

        return res.status(201).json({
            acknowledged: result.acknowledged,
            insertedId: result.insertedId
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to insert log",
            error: error.message
        });
    }
};

export const updateBookYear = async (req, res) => {
    try {
        const { title } = req.params;
        const { year } = req.body;

        const result = await getDB().collection("books").updateOne(
            { title: title },
            { $set: { year: year } }
        );

        return res.status(200).json({
            acknowledged: result.acknowledged,
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to update book", error: error.message });
    }
};


export const getBookByTitle = async (req, res) => {
    try {
        const { title } = req.query;

        const book = await getDB().collection("books").findOne({ title: title });

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        return res.status(200).json(book);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch book", error: error.message });
    }
};


export const getBooksByYearRange = async (req, res) => {
    try {
        const { from, to } = req.query;

        const fromYear = Number(from);
        const toYear = Number(to);

        const books = await getDB().collection("books").find({
            year: {
                $gte: fromYear,
                $lte: toYear
            }
        }).toArray();

        return res.status(200).json(books);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch books", error: error.message });
    }
};


export const getBooksByGenre = async (req, res) => {
    try {
        const { genre } = req.query;

        const books = await getDB().collection("books").find({
            genres: genre
        }).toArray();

        return res.status(200).json(books);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch books", error: error.message });
    }
};


export const getBooksWithSkipLimit = async (req, res) => {
    try {
        const books = await getDB().collection("books")
            .find()
            .sort({ year: -1 })
            .skip(2)
            .limit(3)
            .toArray();

        return res.status(200).json(books);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch books", error: error.message });
    }
};

export const getBooksWithYearInteger = async (req, res) => {
    try {
        const books = await getDB().collection("books").find({
            year: { $type: "int" }
        }).toArray();

        return res.status(200).json(books);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch books", error: error.message });
    }
};


export const getBooksExcludeGenres = async (req, res) => {
    try {
        const excludedGenres = req.query.genres
            ? req.query.genres.split(",")
            : ["Horror", "Science Fiction"];

        const books = await getDB().collection("books").find({
            genres: { $nin: excludedGenres }
        }).toArray();

        return res.status(200).json(books);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch books", error: error.message });
    }
};


export const deleteBooksBeforeYear = async (req, res) => {
    try {
        const yearParam = Number(req.query.year);

        if (isNaN(yearParam)) {
            return res.status(400).json({ message: "Please provide a valid year query parameter." });
        }

        const result = await getDB().collection("books").deleteMany({
            year: { $lt: yearParam }
        });

        return res.status(200).json({
            acknowledged: result.acknowledged,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete books", error: error.message });
    }
};


export const getBooksAggregated = async (req, res) => {
    try {
        const targetYear = req.query.year ? Number(req.query.year) : 2000;

        const books = await getDB().collection("books").aggregate([
            {
                $match: {
                    year: { $gt: targetYear }
                }
            },
            {
                $sort: {
                    year: -1
                }
            }
        ]).toArray();

        return res.status(200).json(books);
    } catch (error) {
        return res.status(500).json({ message: "Failed to aggregate books", error: error.message });
    }
};


export const getBooksAggregateProjection = async (req, res) => {
    try {
        const targetYear = req.query.year ? Number(req.query.year) : 2000;

        const books = await getDB().collection("books").aggregate([
            {
                $match: {
                    year: { $gt: targetYear }
                }
            },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    author: 1,
                    year: 1
                }
            }
        ]).toArray();

        return res.status(200).json(books);
    } catch (error) {
        return res.status(500).json({ message: "Failed to process aggregate query", error: error.message });
    }
};


export const getBooksUnwindGenres = async (req, res) => {
    try {
        const books = await getDB().collection("books").aggregate([
            {
                $unwind: "$genres"
            },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    genres: 1
                }
            }
        ]).toArray();

        return res.status(200).json(books);
    } catch (error) {
        return res.status(500).json({ message: "Failed to unwind genres", error: error.message });
    }
};


export const getLogsWithBookDetails = async (req, res) => {
    try {
        const logsWithBooks = await getDB().collection("logs").aggregate([
            {
                $lookup: {
                    from: "books",
                    localField: "book_id",
                    foreignField: "_id",
                    as: "book_details"
                }
            },
            {
                $project: {
                    _id: 0,
                    action: 1,
                    "book_details.title": 1,
                    "book_details.author": 1,
                    "book_details.year": 1
                }
            }
        ]).toArray();

        return res.status(200).json(logsWithBooks);
    } catch (error) {
        return res.status(500).json({ message: "Failed to join logs and books", error: error.message });
    }
};