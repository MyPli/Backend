import { PrismaService } from '../prisma/prisma.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { AddVideoDto } from './dto/add-video.dto';
export declare class PlaylistService {
    private readonly prisma;
    private readonly youtube;
    constructor(prisma: PrismaService);
    createPlaylist(dto: CreatePlaylistDto, userId: number): Promise<any>;
    updatePlaylist(id: number, userId: number, dto: UpdatePlaylistDto): Promise<any>;
    deletePlaylist(id: number, userId: number): Promise<string>;
    addVideo(playlistId: number, dto: AddVideoDto): Promise<any>;
    getPlaylistDetails(id: number): Promise<any>;
    removeVideo(playlistId: number, videoId: number): Promise<any>;
}
