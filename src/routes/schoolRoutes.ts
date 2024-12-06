import express from "express";
import SchoolController from "../controllers/schoolController.js";
import { handleValidationErrors, validateAddSchool, validateListSchools } from "../validation/schoolValidation.js";

const router = express.Router();

export default (db: any) => {
    const schoolController = new SchoolController(db);

    router.post(
        '/schools',
        validateAddSchool,
        handleValidationErrors,
        schoolController.addSchool
    );

    router.get(
        '/schools',
        validateListSchools,
        handleValidationErrors,
        schoolController.listSchools
    );

    router.get('/schools/all', schoolController.getAllSchools);

    return router;
};
