import express, { Router } from "express";
import { providerController } from "./provider.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../../enum";

const router = express.Router();

router.post("/provider/profile", auth(UserRole.PROVIDER), providerController.createProviderProfile);
router.get("/provider/profile", auth(UserRole.PROVIDER), providerController.getProviderProfile);
router.get("/providers", providerController.getProviders);
router.get("/provider/meals", auth(UserRole.PROVIDER), providerController.getProvider);

// Provider orders
router.get("/provider/orders", auth(UserRole.PROVIDER), providerController.getProviderOrders);
// Get provider order by id
router.get("/provider/orders/:id", auth(UserRole.PROVIDER), providerController.getProviderOrderById);

// Update order status
router.patch("/provider/orders/status/:id", auth(UserRole.PROVIDER), providerController.updateOrderStatus);

// Update provider profile
router.patch("/provider/profile/:id", auth(UserRole.PROVIDER), providerController.updateProfile);

router.get("/provider/stats", auth(UserRole.PROVIDER), providerController.getProviderStats);



export const providerRouter: Router = router;