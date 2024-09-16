import React from "react";

export interface IError {
  name: string;
  message: string;
  messageForm: TMessageErrors;
  stack?: string;
}

export type TObject =
  | {
      [key: string]: string | boolean | null | undefined;
    }
  | null
  | undefined;

export type TPaginationBasicPayload = {
  page: number;
  limit: number;
};

export type TPaginationResponse<T> = {
  data: T;
  total: number;
};

export type TMessageError = {
  [key: string]: string[];
};

export type TApiErrors = {
  statusCode: number;
  message: TMessageError[];
};

export type TMessageErrors = {
  statusCode: number;
  message: TMessageError[];
};

export type TResponseCreateUpdate = {
  id: string;
};

export type TModal = {
  title?: string;
  text?: string;
  okText?: string;
  visible?: boolean;
  onAction?:
    | ((e: React.MouseEvent<HTMLElement, MouseEvent>) => void)
    | undefined;
};
export type TOptionSelect = {
  name: string;
  value: string;
  [key: string]: string;
};
export interface THistory {
  range: [number, number];
  answer?: string;
  videoId: number;
  groupId: number;
}

export type TQuestion = {
  fileName: string;
  type: "qa" | "kis";
  number: number;
  content: string;
  history: THistory[];
};

export interface IImage {
  key: number;
  value: string;
  confidence: number;
  video_id: number;
  group_id: number;
}