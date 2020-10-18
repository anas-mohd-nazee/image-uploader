
import { StatusCodes } from "http-status-codes";
import { Exception } from "../Exception/Exception";
import { IResultResponse } from "../Model/IResultResponse";
import { OperationResult } from "../Model/OperationResult";
import { OperationResultEnums } from "../Model/OperationResultEnums";
import { ResultResponse } from "../Model/ResultResponse";
import { IServiceProvider } from "./IServiceProvider";

export class ResultResponseFactory {
    public async getResponseFromOperation(operationResult: OperationResult): Promise<IResultResponse> {
        switch (operationResult.status) {
            case (OperationResultEnums.Failed):
                return new ResultResponse().setStatus(StatusCodes.BAD_REQUEST).setMessage(operationResult.payload);
            case (OperationResultEnums.Success):
                return new ResultResponse().setStatus(StatusCodes.OK).setData({ imagePath: operationResult.payload });
            default:
                throw new Exception(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to convert operation result");
        }
    }
}