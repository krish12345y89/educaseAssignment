import { Request, Response, NextFunction } from 'express';

export class ErrorSend extends Error {
    statusCode: number;
    isFunctional: boolean;
    isMandatory: boolean;

    constructor(message: string, statusCode: number, isMandatory: boolean, isFunctional: boolean) {
        super(message);
        this.statusCode = statusCode;
        this.isFunctional = isFunctional;
        this.isMandatory = isMandatory;
    }
}

export const errorMiddleware = (err: ErrorSend, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(err.statusCode || 500).json({
        status: 'error',
        message: err.isFunctional ? err.message : 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { error: err.message }),
    });
};
