import { LikeService } from './like.service';
export declare class LikeController {
    private readonly likeService;
    constructor(likeService: LikeService);
    addLike(playlistId: number, req: any): Promise<string>;
    removeLike(playlistId: number, req: any): Promise<string>;
}
export declare class UserLikesController {
    private readonly likeService;
    constructor(likeService: LikeService);
    getLikedPlaylists(req: any): Promise<any[]>;
}
