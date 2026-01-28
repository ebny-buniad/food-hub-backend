import express, { Router } from 'express'
import { mealsController } from './meals.controller';
import auth from '../../middleware/auth';
import { UserRole } from '../../enum';

const router = express.Router();

router.post("/", auth(UserRole.PROVIDER), mealsController.createMeal)

export const mealsRouter: Router = router;