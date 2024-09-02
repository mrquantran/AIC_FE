export type TSearchKeyframePayload = {
  model: TModel;
  value: string | string[] | any;
};

export type TSearchParams = {
  vector_search: "faiss" | "usearch";
  k_query: number;
  display: number
};

export type TModelSearch = "Text" | "Object" | "OCR" | "Temporal"