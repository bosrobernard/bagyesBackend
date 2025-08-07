export declare const config: {
    readonly port: number;
    readonly nodeEnv: string;
    readonly database: {
        readonly uri: string;
        readonly testUri: string;
    };
    readonly jwt: {
        readonly secret: string;
        readonly refreshSecret: string;
        readonly expire: string;
        readonly refreshExpire: string;
    };
    readonly email: {
        readonly host: string;
        readonly port: number;
        readonly user: string;
        readonly pass: string;
    };
    readonly rateLimit: {
        readonly windowMs: number;
        readonly maxRequests: number;
    };
    readonly cors: {
        readonly allowedOrigins: string[];
    };
};
export declare const isProduction: boolean;
export declare const isDevelopment: boolean;
//# sourceMappingURL=environment.d.ts.map