import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { SearchVideoDto } from './dto/search-video.dto';
export declare class VideoController {
    private readonly videoService;
    constructor(videoService: VideoService);
    addVideo(playlistId: number, dto: CreateVideoDto, req: any): Promise<{
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
    updateOrder(playlistId: number, dto: UpdateOrderDto[], req: any): Promise<{
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
