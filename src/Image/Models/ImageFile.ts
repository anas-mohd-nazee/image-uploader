import mongoose, {Schema} from 'mongoose';
import { FileDto } from './FileDto';

export interface IImageFileDoc extends FileDto, mongoose.Document { }

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