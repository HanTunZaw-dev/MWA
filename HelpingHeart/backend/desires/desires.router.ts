import { Router } from "express";
import {verifyRequireToken} from '../auth/auth.middleware';
import { add_desire, delete_desire_by_id, get_desires, get_desire_by_id, update_desire_by_id } from "./desires.controller";
import volunteersRoute from '../volunteers/volunteers.router'
const router = Router();

router.get('/', get_desires);
router.get('/:desire_id', get_desire_by_id)

router.post('/', verifyRequireToken, add_desire);
router.put('/:desire_id', verifyRequireToken, update_desire_by_id);
router.delete('/:desire_id', verifyRequireToken, delete_desire_by_id);


router.use('/:desire_id/volunteers',verifyRequireToken, volunteersRoute)

export default router;