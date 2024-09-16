import { message } from 'antd';
import { TSearch } from './../../store/reducers/search.reducers';
export type TSearchKeyframePayload = {
  model: TModel;
  value: string | string[] | any;
};

export type TSearchParams = {
  vector_search: "faiss" | "usearch";
  k_query: number;
  display: number
  filter_indexes: number[];
};

export type TSearchNearestIndexFromKeyframePayload = {
  group_id: number;
  video_id: number;
  keyframe_id: number;
};

export type TSearchKeyframesByRangePayload = {
  group_id: number;
  video_id: number;
  start: number;
  end: number;
};

export type TModelSearch = "Text" | "Object" | "OCR" | "Temporal" | "Audio";
