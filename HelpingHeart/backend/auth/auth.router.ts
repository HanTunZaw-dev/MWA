import { Router } from "express";
import { signup, signin, change_password } from "./auth.controller";

const router = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.put('/password', change_password)

export default router;