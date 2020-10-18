import { Types } from "mongoose";
import { FailureMessageEnums } from "./FailureMessageEnums";
import { OperationResultEnums } from "./OperationResultEnums";

export class OperationResult {
    fileName: string;
    status: OperationResultEnums;
    payload: string;

    constructor (fileName: string, status: OperationResultEnums, payload: string) {
        this.fileName = fileName;
        this.status = status;
        this.payload = payload;
    }
}