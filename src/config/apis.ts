export const REST_API = {
    // GET /api/v1/health
    HEALTH: "/api/v1/health",
};

export const buildRestUrl = (url: string, data: any) => {
  const keys = Object.keys(data);

  keys.forEach((key: string) => {
    const paramName = `:${key}`;
    if (url.indexOf(paramName) >= 0) {
      url = url.replace(paramName, data[key]);
    }
  });

  return url;
};

export const apis = [] as const;

export type TApis = (typeof apis)[number];
