import { PrismaService } from '../prisma/prisma.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { SearchVideoDto } from './dto/search-video.dto';
export declare class VideoService {
    private readonly prisma;
    private readonly youtube;
    constructor(prisma: PrismaService);
    addVideo(playlistId: number, dto: CreateVideoDto, userId: number): Promise<{
        id: number;
        title: string;
        createdAt: Date;
        playlistId: number;
        youtubeId: string;
        channelName: string;
        thumbnailUrl: string;
        duration: number;
        order: number;
    }>;
    updateOrder(playlistId: number, dto: UpdateOrderDto[], userId: number): Promise<{
        id: number;
        title: string;
        createdAt: Date;
        playlistId: number;
        youtubeId: string;
        channelName: string;
        thumbnailUrl: string;
        duration: number;
        order: number;
    }[]>;
    searchVideos(query: SearchVideoDto): Promise<any>;
}
