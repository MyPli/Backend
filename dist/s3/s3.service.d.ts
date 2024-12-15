export declare class S3Service {
    private s3;
    private bucketName;
    uploadImage(userId: number, fileBuffer: Buffer, fileType: string): Promise<string>;
}
