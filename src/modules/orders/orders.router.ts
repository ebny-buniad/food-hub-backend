import express, { Router } from 'express';
import { ordersController } from "./orders.controller";
import auth from '../../middleware/auth';
import { UserRole } from '../../enum';

const router = express.Router();

router.post("/orders", auth(UserRole.ADMIN, UserRole.PROVIDER, UserRole.USER), ordersController.createOrder);
router.get("/orders", auth(UserRole.ADMIN, UserRole.PROVIDER, UserRole.USER), ordersController.getOrders)

export const ordersRouter: Router = router;

