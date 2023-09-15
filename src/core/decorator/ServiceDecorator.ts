import { WebsocketMetaObj, WSS_METADATA } from "./metaKeys";

export function WebSocketServer(): PropertyDecorator {
	return (target: any, key: any) => {
		const preMetadata =
      Reflect.getMetadata(WSS_METADATA, WebsocketMetaObj) || [];
		const newMetadata = [{ key, target }, ...preMetadata];
		Reflect.defineMetadata(WSS_METADATA, newMetadata, WebsocketMetaObj);
	};
}
