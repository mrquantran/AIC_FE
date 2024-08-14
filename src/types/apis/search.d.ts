export type TSearchKeyframePayload = {
  model: TModel;
  value: string;
};

export type TSearchParams = {
  vector_search: "faiss" | "usearch";
};

export type TModelSearch = "Text" | "Image" | "Audio" | "Object"