export type TSearchKeyframePayload = {
  model: TModel;
  value: string | string[];
};

export type TSearchParams = {
  vector_search: "faiss" | "usearch";
  k_query: number;
};

export type TModelSearch = "Text" | "Object" | "OCR";