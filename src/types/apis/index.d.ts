import { Method } from "axios";

export type TApiConfig<K = any> = {
  uri: string;
  method: K extends Method ? K : Method;
};

export type TApiConfigs = Record<string, TApiConfig>;
