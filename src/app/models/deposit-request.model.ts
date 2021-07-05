import { STATUSES } from "./statuses";

export class DepositRequest{
    id: string = "";
    learnerId: string = "";
    amount: number = 0;
    imageUrl: string = "";
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
    depositRequestStatus:STATUSES = STATUSES.PENDING;
}