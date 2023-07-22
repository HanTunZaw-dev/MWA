import { Router } from "express";
import { get_created_desires_by_logged_user, get_registered_desires_by_logged_user } from "./users.controller";
const router = Router();

router.get('/created_desires', get_created_desires_by_logged_user);
router.get('/registered_desires', get_registered_desires_by_logged_user);

export default router;