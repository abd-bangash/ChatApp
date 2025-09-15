import express from "express"; // or global fetch in Node 18+
import { analyze } from "../controllers/analyze.controller.js";
const router = express.Router();

router.post("/sentiment",analyze);

export default router;
