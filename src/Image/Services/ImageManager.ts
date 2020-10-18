import { Inject } from "typescript-ioc";
import getResponse from "../../app/helper/getResponse";
import { Exception } from "../../common/Exception/Exception";
import { FailureMessageEnums } from "../../common/Model/FailureMessageEnums";
import { IResultResponse } from "../../common/Model/IResultResponse";
import { OperationResult } from "../../common/Model/OperationResult";
import { OperationResultEnums } from "../../common/Model/OperationResultEnums";
import { IImageFile } from "../../Image/Models/ImageFile";
import ImageRepository from "./ImageRepository";
import ImagePropertyProvider from "./ImagePropertyProvider";

export class ImageManager {
  private readonly imageTypeWrapperService: ImagePropertyProvider;
  private readonly imageRepository: ImageRepository;

  constructor(
    @Inject imageRepository: ImageRepository,
    @Inject imageTypeWrapperService: ImagePropertyProvider
  ) {
    this.imageRepository = imageRepository;
    this.imageTypeWrapperService = imageTypeWrapperService;
  }


  public async addImage(imageFile: IImageFile): Promise<OperationResult> {
    const mimeType = this.imageTypeWrapperService.getImageType(imageFile.fileBlob.data);
    if (mimeType == null) {
      return new OperationResult(
        imageFile.fileName,
        OperationResultEnums.Failed,
        FailureMessageEnums.NonImageType
      );
    }

    imageFile.fileBlob.mimeType = mimeType;

    return this.imageRepository.addImage(imageFile);
  }

  public async getImage(fileId: string): Promise<IResultResponse> {
      const image = await this.imageRepository.getImageById(fileId);

      if (!image) {
          throw new Exception(404, "Image not found");
      }

      return getResponse(image.fileBlob.data, image.fileBlob.mimeType);
  }
}
