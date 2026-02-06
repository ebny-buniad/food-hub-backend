import express, { Router } from "express"
import { categoriesController } from "./categories.controller";

const router = express.Router();
// auth(UserRole.ADMIN),
router.post("/categories", categoriesController.createCategories);
router.get("/categories", categoriesController.getCategories)
router.patch("/categories/:id", categoriesController.updateCategories)

export const categoriesRouter: Router = router; 