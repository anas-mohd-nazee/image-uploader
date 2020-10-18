import { createSpyFromClass, Spy } from 'jasmine-auto-spies';
import ImageRepository from "../../Image/Services/ImageRepository"
import ImagePropertyProvider from "../../Image/Services/ImagePropertyProvider"
import { ImageManager } from "../../Image/Services/ImageManager"
import { OperationResult } from '../../common/Model/OperationResult';
import { OperationResultEnums } from '../../common/Model/OperationResultEnums';
import { FileDto } from '../../Image/Models/FileDto';
import ArchiveHelperService from '../../Image/Services/ArchiveHelperService';
import { FileArchiveDto } from '../../Image/Models/FileArchiveDto';
import { StatusCodes } from 'http-status-codes';

describe("ImageManager", () => {
  let mockImageRepo: ImageRepository;
  let mockImageWrapperSvc: ImagePropertyProvider;
  let mockArchiveHelperSvc: ArchiveHelperService;
  let target: ImageManager;

  beforeEach(() => {
    mockImageRepo = createSpyFromClass(ImageRepository);
    mockImageWrapperSvc = createSpyFromClass(ImagePropertyProvider);
    mockArchiveHelperSvc = createSpyFromClass(ArchiveHelperService);
    target = new ImageManager(mockImageRepo, mockImageWrapperSvc, mockArchiveHelperSvc);
  });

  it("when addImage is called with image-type file, it should save the image", async () => {
    (<Spy<ImagePropertyProvider>>mockImageWrapperSvc).getImageType.and.returnValue("image/type");
    (<Spy<ImageRepository>>mockImageRepo).addImage.and.resolveWith(new OperationResult("John Doe", OperationResultEnums.Success, "Foobar"));
    
    const result = await target.addImage({ fileBlob: {data: Buffer.alloc(0)}  } as FileDto);
    
    expect(result.status === OperationResultEnums.Success).toBeTrue();
  });

  it("when addImage is called with non image-type, it should return failed result", async () => {
    (<Spy<ImagePropertyProvider>>mockImageWrapperSvc).getImageType.and.returnValue(null);
    
    const result = await target.addImage({ fileBlob: {data: Buffer.alloc(0)}  } as FileDto);
    
    expect(result.status === OperationResultEnums.Failed).toBeTrue();
  });

  it("when getImageById is called with valid id, it should return the image data", async () => {
    const expectedBlob = { fileBlob: { data: Buffer.alloc(0), mimeType: "image/type" }};
    (<Spy<ImageRepository>>mockImageRepo).getImageById.and.resolveWith(expectedBlob);
    
    const result = await target.getImage("johnDoe");
    
    expect(result.getdata() === expectedBlob.fileBlob.data).toBeTrue();
    expect(result.getContentType() === expectedBlob.fileBlob.mimeType).toBeTrue();
  });

  it("when addImagesFromArchive is called with valid archive, it should return the upload results", async () => {
    const expectedArchiveFiles = [{ fileBlob: { data: Buffer.alloc(0) }} as FileDto];
    (<Spy<ArchiveHelperService>>mockArchiveHelperSvc).getFilesFromArchive.and.resolveWith(expectedArchiveFiles);
    (<Spy<ImageRepository>>mockImageRepo).addImage.and.resolveWith(new OperationResult("John Doe", OperationResultEnums.Success, "Foobar"));
    
    const result = await target.addImagesFromArchive({} as FileArchiveDto);

    expect(result.getStatus() === StatusCodes.MULTI_STATUS).toBeTrue();
    expect(result.getdata()).toBeDefined();
  });
});
