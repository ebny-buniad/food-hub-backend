import express, { Router } from 'express'
import { mealsController } from './meals.controller';

const router = express.Router();

router.post("/", mealsController.createMeal)

export const mealsRouter: Router = router;