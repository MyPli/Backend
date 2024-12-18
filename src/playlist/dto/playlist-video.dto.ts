import { Expose, Transform } from 'class-transformer';

export class PlaylistVideoDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  @Transform(({ obj }) => obj.youtubeId ? `https://youtube.com/watch?v=${obj.youtubeId}` : null)
  url: string;
}
