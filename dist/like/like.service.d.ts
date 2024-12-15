import { PrismaService } from '../prisma/prisma.service';
export declare class LikeService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    addLike(userId: number, playlistId: number): Promise<string>;
    removeLike(userId: number, playlistId: number): Promise<string>;
    getLikedPlaylists(userId: number): Promise<any[]>;
}
