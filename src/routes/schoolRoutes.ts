import express from "express";
import SchoolController from "../controllers/schoolController.js";
import { handleValidationErrors, validateAddSchool, validateListSchools } from "../validation/schoolValidation.js";

export default (db: any) => {
    const schoolController = new SchoolController(db);
    const router = express.Router();

    router.post("/addSchool",validateAddSchool,handleValidationErrors, schoolController.addSchool);
    router.get("/listSchools",validateListSchools,handleValidationErrors, schoolController.listSchools);
    router.get("/schools/all", schoolController.getAllSchools);

    return router;
};
