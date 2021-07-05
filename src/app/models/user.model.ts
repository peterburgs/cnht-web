import { ROLES } from "./user-roles"

export class User {
    id: string = "";
    fullName:string = "";
    avatarUrl: string = "";
    email: string = "";
    userRole: ROLES = ROLES.LEARNER;
    balance: number = 0;
    createdAt?: Date = new Date();
    updatedAt?: Date = new Date();

    constructor(){

    }
  }
  