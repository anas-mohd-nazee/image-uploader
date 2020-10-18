import { Types } from "mongoose";
import { FailureMessageEnums } from "./FailureMessageEnums";
import { OperationResultEnums } from "./OperationResultEnums";

export class OperationResult {
    fileName: string;
    status: OperationResultEnums;
    payload: any;

    constructor (fileName: string, status: OperationResultEnums, payload: any) {
        this.fileName = fileName;
        this.status = status;
        this.payload = payload;
    }
}