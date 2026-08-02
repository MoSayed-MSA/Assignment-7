import express from 'express';
import connectDB from "./db/connectionDB.js"
import booksRouter from "./modules/books/books.controller.js";
import authorRouter from "./modules/author/author.controller.js";
const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/books", booksRouter);
app.use("/authors", authorRouter);


connectDB()

app.get('/', (req, res) => {
    res.send('Welcome to the User API');
});

app.use((req, res) => {
    res.status(404).send('Route not found');
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});