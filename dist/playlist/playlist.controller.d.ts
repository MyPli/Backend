import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { PlaylistSortDto } from './dto/sort-playlist.dto';
import { AddVideoDto } from './dto/add-video.dto';
import { Request } from 'express';
export declare class PlaylistController {
    private readonly playlistService;
    constructor(playlistService: PlaylistService);
    getPopularPlaylists(limit?: number): Promise<{
        id: number;
        title: string;
        description: string;
        coverImage: string;
        likesCount: number;
        createdAt: Date;
    }[]>;
    getLatestPlaylists(limit?: number): Promise<{
        id: number;
        title: string;
        description: string;
        coverImage: string;
        likesCount: number;
        createdAt: Date;
    }[]>;
    getMyPlaylists(req: any, query: PlaylistSortDto): Promise<{
        id: number;
        title: string;
        description: string;
        coverImage: string;
        likesCount: number;
        createdAt: Date;
    }[]>;
    getPlaylistDetails(id: string): Promise<any>;
    createPlaylist(dto: CreatePlaylistDto, req: any): Promise<any>;
    updatePlaylist(id: string, dto: UpdatePlaylistDto, req: Request): Promise<any>;
    deletePlaylist(id: string, req: Request): Promise<string>;
    addVideo(id: string, dto: AddVideoDto): Promise<any>;
    removeVideo(id: string, videoId: string): Promise<any>;
}
