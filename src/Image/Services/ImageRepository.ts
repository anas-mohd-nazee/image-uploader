import { Types } from "mongoose";
import { Exception } from "../../common/Exception/Exception";
import { OperationResult } from "../../common/Model/OperationResult";
import { OperationResultEnums } from "../../common/Model/OperationResultEnums";
import { ServerPath } from "../../common/Provider/ServerPathProvider";
import ImageFileUpload from "../../Image/Models/ImageFile";
import { FileDto } from "../Models/FileDto";

export default class ImageRepository {
  public async addImage(imageFile: FileDto): Promise<OperationResult> {
    const imageUpload = new ImageFileUpload({
      _id: new Types.ObjectId(),
      fileName: imageFile.fileName,
      fileBlob: {
          data: imageFile.fileBlob.data,
          mimeType: imageFile.fileBlob.mimeType
      }
    });

    return imageUpload
      .save()
      .then((imageData) => {
        return new OperationResult(
          imageData.fileName,
          OperationResultEnums.Success,
          `${ServerPath}/image?fileId=${imageData._id}`
        );
      })
      .catch((err) => {
        throw new Exception(500, err.message);
      });
  }

  public async getImageById(fileId: string): Promise<any> {
      return await ImageFileUpload.findById(fileId).select("fileBlob");
  }
}
