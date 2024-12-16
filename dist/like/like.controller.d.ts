import { LikeService } from './like.service';
export declare class LikeController {
    private readonly likeService;
    constructor(likeService: LikeService);
    addLike(playlistId: number, req: any): Promise<{
        message: string;
        playlistId?: number;
    }>;
    removeLike(playlistId: number, req: any): Promise<{
        message: string;
        playlistId?: number;
    }>;
}
