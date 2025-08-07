"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
class AuthController {
    static async login(req, res, next) {
        try {
            const { user, token, refreshToken } = await authService_1.AuthService.login(req.body);
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    user,
                    token,
                    refreshToken,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const tokens = await authService_1.AuthService.refreshToken(refreshToken);
            res.status(200).json({
                success: true,
                message: 'Token refreshed successfully',
                data: tokens,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getProfile(req, res, next) {
        try {
            res.status(200).json({
                success: true,
                message: 'Profile retrieved successfully',
                data: { user: req.user },
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map