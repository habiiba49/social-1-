"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandeler = globalErrorHandeler;
function globalErrorHandeler(err, req, res, _next) {
    if (err.isOperatioinal) {
        return res.status(err.statusCode).json({
            message: err.message,
            success: false,
        });
    }
    return res.status(500).json({
        err: 'something went wrong',
        success: false
    });
}
;
