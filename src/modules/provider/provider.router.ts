import express, { Router } from "express";
import { providerController } from "./provider.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../../enum";

const router = express.Router();

router.post("/", auth(UserRole.PROVIDER), providerController.createProviderProfile)
router.patch("/:id", auth(UserRole.PROVIDER), providerController.updateProfile)


export const providerRouter: Router = router;