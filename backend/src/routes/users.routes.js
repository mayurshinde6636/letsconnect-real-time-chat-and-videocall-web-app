import { Router } from "express";
import {
  register,
  login,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/login").post(login);

router.route("/register").post(register);

router.route("/add_to_activity").post((req, res) => {
  res.json({ message: "Add Activity API" });
});

router.route("/get_all_activity").get((req, res) => {
  res.json({ message: "Get All Activity API" });
});

export default router;