import express, { Router } from "express"
import { cartController } from "./cart.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../../enum";

const router = express.Router();

router.post("/cart", auth(UserRole.USER), cartController.createCart);
router.get("/cart", auth(UserRole.USER), cartController.getCartItems);

export const cartRouter: Router = router;