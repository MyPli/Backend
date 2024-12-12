import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as crypto from 'crypto';

@Injectable()
export class S3Service {
  private s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  private bucketName = process.env.AWS_S3_BUCKET_NAME;

  async uploadImage(userId: number, base64Image: string): Promise<string> {
    try {
      // Base64 이미지 데이터를 Buffer로 변환
      const buffer = Buffer.from(
        base64Image.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      );

      // 파일 이름 생성 (UUID 또는 고유 이름)
      const fileName = `users/${userId}/profile_${crypto.randomUUID()}.jpeg`;

      // S3에 업로드
      const uploadResult = await this.s3
        .upload({
          Bucket: this.bucketName,
          Key: fileName,
          Body: buffer,
          ContentType: 'image/jpeg',
          ACL: 'public-read', // 이미지가 공개 URL로 접근 가능하도록 설정
        })
        .promise();

      // 업로드된 파일의 URL 반환
      return uploadResult.Location;
    } catch (error) {
      throw new InternalServerErrorException('S3 업로드 중 오류 발생');
    }
  }
}
