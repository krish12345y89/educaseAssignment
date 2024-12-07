export class ErrorSend extends Error {
    constructor(message, statusCode, isMandatory, isFunctional) {
        super(message);
        this.statusCode = statusCode;
        this.isFunctional = isFunctional;
        this.isMandatory = isMandatory;
    }
}
export const errorMiddleware = (err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).json({
        status: 'error',
        message: err.isFunctional ? err.message : 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { error: err.message }),
    });
};
