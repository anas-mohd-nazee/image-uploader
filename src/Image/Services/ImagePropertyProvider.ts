import ImageType from "image-type";
import Sharp from "sharp";
import { FileArchiveDto } from "../Models/FileArchiveDto";
import { FileDto } from "../Models/FileDto";
import { ImageDimension } from "../Models/ImageDimension";

export const ThumbnailSizes = [
    32,
    64
]

export default class ImagePropertyProvider {
    public getImageType(fileBuffer: Buffer): string {
        const mimeType = ImageType.default(fileBuffer);
        return mimeType == null ? null : mimeType.mime;
    }

    public getImageDimension(fileBuffer: Buffer): Promise<ImageDimension> {
        const image = Sharp(fileBuffer);
        return image.metadata().then((metadata) => { return { width: metadata.width, height: metadata.height } as ImageDimension })
    }

    public getAllImageThumbnails(fileDto: FileDto, imageDimension: ImageDimension): Promise<FileDto[]> {
        const getAllThumbnailPromises = ThumbnailSizes.map(size => this.getImageThumbnail(fileDto, imageDimension, size));
        return Promise.all(getAllThumbnailPromises);
    }

    public getImageThumbnail(fileDto: FileDto, imageDimension: ImageDimension, thumbnailSize: number): Promise<FileDto> {
        const aspectRatio = imageDimension.width/imageDimension.height;
        const image = Sharp(fileDto.fileBlob.data);
        return image.resize({width: thumbnailSize, height: thumbnailSize * aspectRatio}).toBuffer().then((buffer) => {
            return { 
                fileName: `TB${thumbnailSize}_${fileDto.fileName}`,
                fileBlob: {
                    data: buffer,
                    mimeType: fileDto.fileBlob.mimeType
                }
            } as FileDto;
        });
    }
}