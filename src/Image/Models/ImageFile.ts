import mongoose, {Schema} from 'mongoose';

export interface IImageFile {
    fileName: string;
    fileBlob: {
        data: Buffer,
        mimeType: string
    }
}

export interface IImageFileDoc extends IImageFile, mongoose.Document { }

export const ImageSchema = new Schema({
    _id: Schema.Types.ObjectId,
    fileName: {
        type: String,
        required: false
    },
    fileBlob: {
        data: {
            type: Buffer,
            required: true
        },
        mimeType: {
            type: String,
            required: true
        }
    }
});

export default mongoose.model<IImageFileDoc>('ImageFileUpload', ImageSchema);