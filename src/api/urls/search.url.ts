export const REST_API_QUERY = {
  GET_BY_INDEX: {
    uri: "/api/v1/query",
    method: "GET",
  },
  SEARCH_KEYFRAMES: {
    uri: "/api/v1/query/search",
    method: "POST",
  },
  GET_OBJECTS_NAME: {
    uri: "/api/v1/query/object/names",
    method: "GET",
  },
  GET_VIDEO: {
    uri: "/api/v1/video/{{group_id}}/{{video_id}}",
    method: "GET",
  },
  SEARCH_NEAREST_INDEX_FROM_KEYFRAME: {
    uri: "/api/v1/query/index/nearest",
    method: "GET",
  },
  SEARCH_KEYFRAMES_BY_RANGE: {
    uri: "/api/v1/query/index/range",
    method: "POST",
  },
};
