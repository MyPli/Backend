import { PrismaService } from '../prisma/prisma.service';
export declare class LikeService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    addLike(userId: number, playlistId: number): Promise<{
        message: string;
        playlistId?: number;
    }>;
    removeLike(userId: number, playlistId: number): Promise<{
        message: string;
        playlistId?: number;
    }>;
}
