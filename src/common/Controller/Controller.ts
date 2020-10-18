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
                // response.status(StatusCodes.OK).json({
                //   status: 200,
                //   message: "ok",
                //   data: result.getdata(),
                // });
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
        if (result.getContentType() == null) {
            response.status(StatusCodes.OK).json({
              status: 200,
              message: "ok",
              data: result.getdata(),
            });
            return;
        }

        response.status(StatusCodes.OK);
        response.contentType(result.getContentType());
        response.send(result.getdata());
    }

}