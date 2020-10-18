import { createSpyFromClass, Spy } from 'jasmine-auto-spies';
import ImageRepository from "../../Image/Services/ImageRepository"
import ImagePropertyProvider from "../../Image/Services/ImagePropertyProvider"
import { ImageManager } from "../../Image/Services/ImageManager"
import { OperationResult } from '../../common/Model/OperationResult';
import { OperationResultEnums } from '../../common/Model/OperationResultEnums';
import { IImageFile } from '../../Image/Models/ImageFile';

describe("ImageManager", () => {
  let mockImageRepo: ImageRepository;
  let mockImageWrapperSvc: ImagePropertyProvider;
  let target: ImageManager;

  beforeEach(() => {
    mockImageRepo = createSpyFromClass(ImageRepository);
    mockImageWrapperSvc = createSpyFromClass(ImagePropertyProvider);
    target = new ImageManager(mockImageRepo, mockImageWrapperSvc);
  })

  it("when addImage is called with image-type file, it should save the image", async () => {
    (<Spy<ImagePropertyProvider>>mockImageWrapperSvc).getImageType.and.returnValue("image/type");
    (<Spy<ImageRepository>>mockImageRepo).addImage.and.resolveWith(new OperationResult("John Doe", OperationResultEnums.Success, "Foobar"));
    const result = await target.addImage({ fileBlob: {data: Buffer.alloc(0)}  } as IImageFile);
    expect(result.status === OperationResultEnums.Success).toBeTrue();
  })

  it("when addImage is called with non image-type, it should return failed result", async () => {
    (<Spy<ImagePropertyProvider>>mockImageWrapperSvc).getImageType.and.returnValue(null);
    (<Spy<ImageRepository>>mockImageRepo).addImage.and.resolveWith(new OperationResult("John Doe", OperationResultEnums.Success, "Foobar"));
    const result = await target.addImage({ fileBlob: {data: Buffer.alloc(0)}  } as IImageFile);
    expect(result.status === OperationResultEnums.Failed).toBeTrue();
  })
})
