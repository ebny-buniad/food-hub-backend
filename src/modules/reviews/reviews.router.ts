import express, { Router } from "express"
import auth from "../../middleware/auth";
import { UserRole } from "../../enum";
import { reviewsContoller } from "./reviews.controller";

const router = express.Router();

router.post("/reviews", auth(UserRole.USER), reviewsContoller.createReviews);
router.get("/my-reviews", auth(UserRole.USER), reviewsContoller.getCustomerReviews);
router.put("/my-reviews/:id", auth(UserRole.USER), reviewsContoller.updateReviews);


export const reviewsRouter: Router = router 