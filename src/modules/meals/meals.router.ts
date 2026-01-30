import express, { Router } from 'express'
import { mealsController } from './meals.controller';
import auth from '../../middleware/auth';
import { UserRole } from '../../enum';

const router = express.Router();

router.post("/provider/meals", auth(UserRole.PROVIDER), mealsController.createMeal);
router.get("/meals", mealsController.getAllMeals);
router.get("/meals/:id", mealsController.getMeal);
router.put("/provider/meals/:id", auth(UserRole.PROVIDER), mealsController.updateMeal);
router.delete("/provider/meals/:id", auth(UserRole.PROVIDER), mealsController.deleteMeal);


export const mealsRouter: Router = router;