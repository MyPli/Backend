import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../s3/s3.service';
export declare class UserService {
    private readonly prisma;
    private readonly s3Service;
    constructor(prisma: PrismaService, s3Service: S3Service);
    getUserProfile(userId: number): Promise<{
        email: string;
        nickname: string;
        profileImage: string;
    }>;
    deleteUser(userId: number): Promise<{
        message: string;
    }>;
    updateNickname(userId: number, nickname: string): Promise<{
        id: number;
        nickname: string;
        profileImage: string;
    }>;
    updateProfileImage(userId: number, fileBuffer: Buffer, fileType: string): Promise<{
        id: number;
        nickname: string;
        profileImage: string;
    }>;
    getLikedPlaylists(userId: number): Promise<any[]>;
}
