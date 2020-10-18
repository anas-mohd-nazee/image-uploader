import ImageType from "image-type";

export default class ImagePropertyProvider {
    public getImageType(fileBuffer: Buffer): string {
        const mimeType = ImageType.default(fileBuffer);
        return mimeType == null ? null : mimeType.mime;
    }
}