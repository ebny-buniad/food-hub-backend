import express, { Router } from "express"
import { adminController } from "./admin.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../../enum";

const router = express.Router();

router.get("/admin/users", auth(UserRole.ADMIN), adminController.getUsers);
router.patch("/admin/users/:id", auth(UserRole.ADMIN), adminController.updateUserStatus);


export const adminRoter: Router = router;