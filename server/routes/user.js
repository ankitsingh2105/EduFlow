import { Router } from "express";
import { userDetailController } from "../controllers/userDetailController.js";

const router = Router();

router.post("/getInfo", userDetailController);

export default router;
