import {IController} from "./IController";
import {Request, Response, Router} from "express";
import {IResultResponse} from "../Model/IResultResponse";
import application from "../../app/config/application";
import {logger} from "../../app/helper/logger";
import Multer from "multer";
import { StatusCodes } from "http-status-codes";

/**
 * @class Controller
 */
export class Controller implements IController {

    /**
     * @type express.Router
     */
    public router = Router();

    /**
     * Creates normalized json response.
     *
     * @param response
     * @param promise
     */
    public respond(response: Response, promise: Promise<IResultResponse>): void {
        promise
            .then((result) => {
                this.setResponseForType(response, result);
            })
            .catch((error) => {
                if (application.debugMode) {
                    logger.error('Error: ', error);
                }

                response.status(error.status || 500).json({
                    status: error.status || 500,
                    message: error.message || "Something went wrong",
                    errors: error.errors || []
                });
            });
    }

    public getMulterOption(fileKey: string): any {
        const storage = Multer.memoryStorage();
        const upload = Multer({ storage });
        return upload.single(fileKey);
    }

    private setResponseForType(response: Response, result: IResultResponse): void {
        const statusCode = this.getDefaultOrAssignedStatusCode(result);
        if (result.getContentType() == null) {
            response.status(statusCode).json({
              status: statusCode,
              message: StatusCodes[statusCode],
              data: result.getdata(),
            });
            return;
        }

        response.status(statusCode);
        response.contentType(result.getContentType());
        response.send(result.getdata());
    }

    private getDefaultOrAssignedStatusCode(result: IResultResponse): StatusCodes {
        if (result.getStatus() == null) {
            return StatusCodes.OK;
        }

        return result.getStatus();
    }
}