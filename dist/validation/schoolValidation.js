import { body, query, validationResult } from "express-validator";
const validateLatitude = (field = "latitude") => body(field).isFloat().withMessage(`${field} must be a valid number.`);
const validateLongitude = (field = "longitude") => body(field).isFloat().withMessage(`${field} must be a valid number.`);
export const validateAddSchool = [
    body("name").notEmpty().withMessage("Name is required."),
    body("address").notEmpty().withMessage("Address is required."),
    validateLatitude(),
    validateLongitude(),
];
export const validateListSchools = [
    query("latitude").isFloat().withMessage("Latitude must be a valid number."),
    query("longitude").isFloat().withMessage("Longitude must be a valid number."),
];
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            status: "error",
            message: "Validation failed",
            errors: errors.array(),
        });
    }
    next();
};
