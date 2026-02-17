import express, { Router } from "express"
import { categoriesController } from "./categories.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../../enum";

const router = express.Router();

router.post("/categories", auth(UserRole.ADMIN), categoriesController.createCategories);
router.get("/categories", categoriesController.getCategories)
router.delete("/categories/:id", auth(UserRole.ADMIN), categoriesController.deleteCategories);

export const categoriesRouter: Router = router; 