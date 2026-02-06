import express from "express"
import { categoriesController } from "./categories.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../../enum";

const router = express.Router();
// auth(UserRole.ADMIN),
router.post("/categories", categoriesController.createCategories);
router.get("/categories", categoriesController.getCategories)
router.patch("/categories/:id", categoriesController.updateCategories)

export const categoriesRouter = router; 