import express, { Router } from "express"
import { authController } from "./auth.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../../enum";

const router = express.Router();

router.get("/my-info", auth(UserRole.ADMIN, UserRole.PROVIDER, UserRole.USER), authController.getMe);

export const authRouter: Router = router 