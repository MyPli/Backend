import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { AddVideoDto } from './dto/add-video.dto';
import { Request } from 'express';
export declare class PlaylistController {
    private readonly playlistService;
    constructor(playlistService: PlaylistService);
    createPlaylist(dto: CreatePlaylistDto, req: any): Promise<any>;
    updatePlaylist(id: number, dto: UpdatePlaylistDto, req: Request): Promise<any>;
    deletePlaylist(id: number, req: Request): Promise<string>;
    addVideo(id: number, dto: AddVideoDto): Promise<any>;
    getPlaylistDetails(id: number): Promise<any>;
    removeVideo(playlistId: number, videoId: number): Promise<any>;
}
