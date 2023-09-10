export const INJECTABLE_METADATA = Symbol.for("injectable_metadata");
export const INJECT_METADATA = Symbol.for("inject_metadata");

export const CONTROLLER_METADATA = Symbol.for("controller_metadata");
export const ROUTE_METADATA = Symbol.for("method_metadata");
export const PARAM_METADATA = Symbol.for("param_metadata");

export const ORM_MODEL_METADATA = Symbol.for("orm_model_metadata");
export const MG_MODEL_METADATA = Symbol.for("mg_model_metadata");
export const CACHE_MODEL_METADATA = Symbol.for("cache_manager_metadata");
export const WSS_METADATA = Symbol.for("wss_metadata");

export const RouterMetaObj = {};
export const ORMMetaObj = {};
export const MongoMetaObj = {};
export const CacheMetaObj = {};
export const WebsocketMetaObj = {};