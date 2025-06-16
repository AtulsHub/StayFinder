import express from "express";
import { 
    getAllItems,
    getById,
    searchListings
} from "../controllers/listing.controller.js";


const router = express.Router();

router.get("/get-all-items", getAllItems);
router.get("/search", searchListings);  // Place this before `/:id`
router.get("/:id", getById);




export default router;