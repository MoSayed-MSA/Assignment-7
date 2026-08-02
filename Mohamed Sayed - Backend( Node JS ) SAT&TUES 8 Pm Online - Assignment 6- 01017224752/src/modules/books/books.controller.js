import { Router } from "express";
import * as booksService from "./books.service.js";

const booksRouter = Router();

booksRouter.post("/collection", booksService.createBooksCollection);
booksRouter.post("/collection/logs/capped", booksService.createCappedLogsCollection);
booksRouter.post("/collection/indexes", booksService.createTitleIndex);
booksRouter.post("/", booksService.insertOneBook);
booksRouter.post("/batch", booksService.insertManyBooks);
booksRouter.post("/logs", booksService.insertLog);
booksRouter.patch("/:title", booksService.updateBookYear);
booksRouter.get("/title", booksService.getBookByTitle);
booksRouter.get("/year", booksService.getBooksByYearRange);
booksRouter.get("/genre", booksService.getBooksByGenre);
booksRouter.get("/skip-limit", booksService.getBooksWithSkipLimit);
booksRouter.get("/year-integer", booksService.getBooksWithYearInteger);
booksRouter.get("/exclude-genres", booksService.getBooksExcludeGenres);
booksRouter.delete("/before-year", booksService.deleteBooksBeforeYear);
booksRouter.get("/aggregate", booksService.getBooksAggregated);
booksRouter.get("/aggregate2", booksService.getBooksAggregateProjection);
booksRouter.get("/aggregate3", booksService.getBooksUnwindGenres);
booksRouter.get("/aggregate4", booksService.getLogsWithBookDetails);

export default booksRouter;