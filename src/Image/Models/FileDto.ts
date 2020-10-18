export interface FileDto {
    fileName: string;
    fileBlob: {
        data: Buffer,
        mimeType: string
    }
}