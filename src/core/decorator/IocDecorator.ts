import Router from "../Router";

const injectables: WeakMap<any, any> = new WeakMap();

export const INJECTABLE_METADATA = "injectable_metadata";
export const INJECT_METADATA = "inject_metadata";

// eslint-disable-next-line no-unused-vars
export type Constructor<T = any> = new (...args: any[]) => T;

export const IocFactory = (target: Constructor<any>): any => {
  // 获取所有注入的服务
  const providers = Reflect.getMetadata("design:paramtypes", target); // [OtherService]
  const args = providers
    ? providers.map(
      (provider: Constructor) =>
        injectables.get(provider) || IocFactory(provider)
    )
    : [];
  // eslint-disable-next-line new-cap
  return new target(...args);
};

export const Injectable = (): ClassDecorator => (target) => {
  const Obj: Constructor<any> = target as unknown as Constructor<any>;
  if (!injectables.get(target)) {
    injectables.set(target, IocFactory(Obj));
  }
};

// 通过成员变量的方式注入对象，如果存在循环依赖必需传方法，如果不存在循环依赖建议通过构造方法注入
export function Inject(
  type: Constructor | (() => Constructor)
): PropertyDecorator {
  return (target: any, key: any) => {
    const preMetadata = Reflect.getMetadata(INJECT_METADATA, Router) || [];
    const newMetadata = [{ key, target, type }, ...preMetadata];
    Reflect.defineMetadata(INJECT_METADATA, newMetadata, Router);
  };
}

// 从缓存中取出实例
export function getInject(target: Constructor) {
  let obj = injectables.get(target);
  if (!obj) {
    obj = IocFactory(target);
    injectables.set(target, obj);
  }
  return obj;
}
