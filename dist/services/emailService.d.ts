import { IOrder } from '../types';
declare class EmailService {
    private transporter;
    constructor();
    sendOrderCreatedEmail(order: IOrder): Promise<void>;
    sendStatusUpdateEmail(order: IOrder): Promise<void>;
}
export declare const emailService: EmailService;
export {};
//# sourceMappingURL=emailService.d.ts.map