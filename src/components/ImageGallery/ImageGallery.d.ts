export interface IImageGalleryProps {
  images: IImage[];
  showConfidence?: boolean;
  top?: number;
  group: "all" | "video";
}

export interface IImage {
  value: string;
  confidence: number;
  video_id: number;
  group_id: number;
}
