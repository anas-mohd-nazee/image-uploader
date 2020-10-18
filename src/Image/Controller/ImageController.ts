import * as express from 'express';
import imageType from 'image-type';
import { Inject } from "typescript-ioc";
import { Controller } from '../../common/Controller/Controller';
import { ResultResponseFactory } from '../../common/Provider/ResultResponseFactory';
import { ImageManager } from '../Services/ImageManager';

export class ImageController extends Controller {
    private readonly imageManager: ImageManager;
    private readonly resultResponseFactory: ResultResponseFactory;
    private readonly photoKey = "photo";

    constructor(
        @Inject resultResponseFactory: ResultResponseFactory,
        @Inject imageManager: ImageManager
    ) {
        super();
        this.imageManager = imageManager;
        this.resultResponseFactory = resultResponseFactory;
        this.router.post('/image', this.getMulterOption(this.photoKey),this.uploadImage),
        this.router.get('/image', this.getImage);
    }

    private uploadImage = async (
        request: express.Request,
        response: express.Response
    ): Promise<void> => {
        const imageToUpload = {
            fileName: request.file.originalname,
            fileBlob: {
                data: request.file.buffer,
                mimeType: ''
            }
        }
        
        const addOperationResult = await this.imageManager.addImage(imageToUpload);
        const responseResult = this.resultResponseFactory.getResponseFromOperation(addOperationResult);
        this.respond(response, responseResult);
    }

    private getImage = (
        request: express.Request,
        response: express.Response
    ): void => {
        console.log(request.query);
        const fileId = request.query.fileId as string;

        const result = this.imageManager.getImage(fileId);

        this.respond(response, result);
    }
}