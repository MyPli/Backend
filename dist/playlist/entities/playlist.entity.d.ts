export declare class PlaylistEntity {
    id: number;
    userId: number;
    title: string;
    description?: string;
    coverImage?: string;
    likesCount: number;
    createdAt: Date;
    updatedAt: Date;
    tags?: string[];
    videos?: any[];
}
