import { Router } from "express";

import { healthCheck } from "../controllers/healthcheck.controller";

const router=Router();

router.route("/health")
.get(healthCheck)


export default router;