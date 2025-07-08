import { Router } from "express";
import { isAdmin, isLoggedIn } from "../middlewares/auth.js";
import { deleteUserById, getAllUsers, getUserById, logoutUserSession, updateUserRole } from "../controllers/admin.controller.js";

const router = Router();

router.route("/users").get(isLoggedIn, isAdmin, getAllUsers);
router.route("/user/:userId").get(isLoggedIn, isAdmin, getUserById);
router.route("/users/session/:sessionId").post(isLoggedIn, isAdmin, logoutUserSession);
router.route("/user/:userId").patch(isLoggedIn, isAdmin, updateUserRole);
router.route("/user/:userId").delete(isLoggedIn, isAdmin, deleteUserById);

export default router;