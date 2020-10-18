import AdmZip from "adm-zip";
import { FileArchiveDto } from "../Models/FileArchiveDto";
import { FileDto } from "../Models/FileDto";

export default class ArchiveHelperService {
    private readonly zipMimeType = "application/zip";

    public async getFilesFromArchive(archiveDto: FileArchiveDto): Promise<FileDto[] | null> {
        if (archiveDto.mimeType !== this.zipMimeType) {
            return null;
        }

        const images: FileDto[] = [];
        const zipFile = new AdmZip(archiveDto.data);
        zipFile.getEntries().forEach((entry) => {
            const image: FileDto = { fileName: entry.entryName, fileBlob: { data: entry.getData(), mimeType: "" } };
            images.push(image);
        })

        return images;
    }
}