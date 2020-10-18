import {ResultResponse} from "../../common/Model/ResultResponse";
import {IResultResponse} from "../../common/Model/IResultResponse";

/**
 * Returns response.
 */
export default (data: any = null, contentType?: string): IResultResponse => {
    const response = new ResultResponse();
    if (contentType) {
        response.setContentType(contentType);
    }

    return response.setData(data);
}