"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTrackingId = void 0;
const generateTrackingId = () => {
    const prefix = 'BR';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}${timestamp}${random}`;
};
exports.generateTrackingId = generateTrackingId;
//# sourceMappingURL=generateTrackingId.js.map