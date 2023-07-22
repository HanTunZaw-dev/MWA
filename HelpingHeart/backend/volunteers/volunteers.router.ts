import { Router } from "express";
import {verifyRequireToken} from '../auth/auth.middleware';
import { add_volunteer, update_volunteer_by_id } from "./volunteers.controller";

const router = Router({mergeParams: true});

router.post('/', add_volunteer)
router.put('/:volunteer_id', update_volunteer_by_id)

export default router;