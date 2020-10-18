import { Inject } from "typescript-ioc";
import getResponse from "../../app/helper/getResponse";
import { Exception } from "../../common/Exception/Exception";
import { FailureMessageEnums } from "../../common/Model/FailureMessageEnums";
import { IResultResponse } from "../../common/Model/IResultResponse";
import { OperationResult } from "../../common/Model/OperationResult";
import { OperationResultEnums } from "../../common/Model/OperationResultEnums";
import ImageRepository from "./ImageRepository";
import ImagePropertyProvider from "./ImagePropertyProvider";
import { FileArchiveDto } from "../Models/FileArchiveDto";
import ArchiveHelperService from "./ArchiveHelperService";
import { FileDto } from "../Models/FileDto";
import { ResultResponse } from "../../common/Model/ResultResponse";
import { StatusCodes } from "http-status-codes";
import { ImageDimension } from "../Models/ImageDimension";

export class ImageManager {
  private readonly imagePropertyProvider: ImagePropertyProvider;
  private readonly imageRepository: ImageRepository;
  private readonly archiveHelperService: ArchiveHelperService;
  private readonly minWidthForThumbnail = 128;
  private readonly minHeightForThumbnail = 128;


  constructor(
    @Inject imageRepository: ImageRepository,
    @Inject imagePropertyProvider: ImagePropertyProvider,
    @Inject archiveHelperService: ArchiveHelperService
  ) {
    this.imageRepository = imageRepository;
    this.imagePropertyProvider = imagePropertyProvider;
    this.archiveHelperService = archiveHelperService;
  }

  public async addImage(imageFile: FileDto): Promise<OperationResult> {
    const mimeType = this.imagePropertyProvider.getImageType(imageFile.fileBlob.data);
    if (mimeType == null) {
      return new OperationResult(
        imageFile.fileName,
        OperationResultEnums.Failed,
        FailureMessageEnums.NonImageType
      );
    }

    imageFile.fileBlob.mimeType = mimeType;

    const imageDimension = await this.imagePropertyProvider.getImageDimension(imageFile.fileBlob.data);

    if (!(this.canGenerateThumbnails(imageDimension))) {
      return this.imageRepository.addImage(imageFile);
    }

    const thumbnails = await this.imagePropertyProvider.getAllImageThumbnails(imageFile, imageDimension);

    const addImagePromises = thumbnails.map(thumbImage => this.imageRepository.addImage(thumbImage));
    addImagePromises.push(this.imageRepository.addImage(imageFile));

    const multipleResults: any[] = [];
    await Promise.all(addImagePromises).then((results) => {
      multipleResults.push(...results);
    });

    console.log(multipleResults);

    return new OperationResult(imageFile.fileName, OperationResultEnums.Success, multipleResults);
  }

  public async addImagesFromArchive(archiveFile: FileArchiveDto): Promise<IResultResponse> {
    const imagesFromArchive = await this.archiveHelperService.getFilesFromArchive(archiveFile);
    if (imagesFromArchive == null) {
      return new ResultResponse().setStatus(StatusCodes.BAD_REQUEST).setMessage(`${archiveFile.archiveName} is not a supported archive format.`);
    }

    if (!imagesFromArchive.length) {
      return new ResultResponse().setStatus(StatusCodes.BAD_REQUEST).setMessage(`${archiveFile.archiveName} is an empty archive`);
    }

    const multipleResults: any[] = [];
    const addImagePromises = imagesFromArchive.map((image) => this.addImage(image));
    await Promise.all(addImagePromises).then((values) => {
      multipleResults.push(...this.parseMultipleOperationResults(values));
    }).catch((error) => {
      throw new Exception(500, error.message);
    });

    return new ResultResponse().setStatus(StatusCodes.MULTI_STATUS).setData(multipleResults);
  }

  public async getImage(fileId: string): Promise<IResultResponse> {
      const image = await this.imageRepository.getImageById(fileId);

      if (!image) {
          throw new Exception(404, "Image not found");
      }

      return getResponse(image.fileBlob.data, image.fileBlob.mimeType);
  }

  private parseMultipleOperationResults(results: OperationResult[]): any[] {
    const responsePayloads: any[] = [];
    results.forEach(result => {
      if (result.status === OperationResultEnums.Success) {
        responsePayloads.push({ fileName: result.fileName, imagePath: result.payload });
      } else {
        responsePayloads.push({ fileName: result.fileName, error: "not a valid image type"});
      }
    });

    return responsePayloads;
  }

  private canGenerateThumbnails(imageDimension: ImageDimension): boolean {
    return imageDimension.width >= this.minWidthForThumbnail && imageDimension.height >= this.minHeightForThumbnail;
  }
}
