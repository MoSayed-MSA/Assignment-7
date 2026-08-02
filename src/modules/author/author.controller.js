import { Router } from "express";
import * as authorService from "./author.service.js";

const authorRouter = Router();

authorRouter.post("/collection", authorService.createImplicitAuthorCollection);

export default authorRouter;