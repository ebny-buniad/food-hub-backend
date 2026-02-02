import express, { Router } from "express";
import { providerController } from "./provider.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../../enum";

const router = express.Router();

router.post("/provider/profile", auth(UserRole.PROVIDER), providerController.createProviderProfile);
router.get("/providers", providerController.getProviders)
router.get("/providers/:id", providerController.getProvider)

// Provider orders
router.get("/provider/orders", auth(UserRole.PROVIDER), providerController.getProviderOrders)


// Update provider profile
router.patch("/provider/profile/:id", auth(UserRole.PROVIDER), providerController.updateProfile)


export const providerRouter: Router = router;