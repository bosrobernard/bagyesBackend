"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuery = exports.validate = void 0;
const errorHandler_1 = require("./errorHandler");
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            const message = error.details.map(detail => detail.message).join(', ');
            return next(new errorHandler_1.AppError(message, 400));
        }
        next();
    };
};
exports.validate = validate;
const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.query);
        if (error) {
            const message = error.details.map(detail => detail.message).join(', ');
            return next(new errorHandler_1.AppError(message, 400));
        }
        next();
    };
};
exports.validateQuery = validateQuery;
//# sourceMappingURL=validation.js.map