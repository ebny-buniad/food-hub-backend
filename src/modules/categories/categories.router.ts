import express from "express"
import { categoriesController } from "./categories.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../../enum";

const router = express.Router();
// auth(UserRole.ADMIN),
router.post("/", categoriesController.createCategories);
router.patch("/:id", categoriesController.updateCategories)

export const categoriesRouter = router; 