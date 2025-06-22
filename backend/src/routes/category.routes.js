import express from "express";
import { getAllCategories, getCategoryById } from "../controllers/category.controller.js";

const router = express.Router();

router.get("/get-all-categories", getAllCategories);
router.get("/get-category-by-id/:id", getCategoryById);

export default router;
