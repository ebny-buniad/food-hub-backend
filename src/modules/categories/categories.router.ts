import express, { Router } from "express"
import { categoriesController } from "./categories.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../../enum";

const router = express.Router();

router.post("/categories", auth(UserRole.ADMIN), categoriesController.createCategories);
router.get("/categories", categoriesController.getCategories)
router.delete("/categories/:id", auth(UserRole.ADMIN), categoriesController.deleteCategories);

// Admin stats
router.get('/admin-stats', auth(UserRole.ADMIN), categoriesController.getAdminStats);

export const categoriesRouter: Router = router; 