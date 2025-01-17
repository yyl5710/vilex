import { Properties } from "csstype";
import { DataProxy } from "./DataProxy";

export type IDataType = { $dataType?: string }
export type IStyle = Properties & IDataType
export type IAttr =  IDataType
export type IClass =  IDataType
export type IEvents =   IDataType
//todo: style.merge(style)
export function Styles(s: IStyle): IStyle {
  return DataProxy(makeType("style", s))  as IStyle;
}

export function Hover(s: IStyle): IStyle {
  return DataProxy(makeType('hover', s))  as IStyle
}

export function Props(a: IAttr): IAttr {
  return DataProxy(makeType("props", a)) as IAttr;
}

export function Class(...cs: string[]): IClass {
  const classs = cs.reduce((target, key) => {
    (target as any)[key] = true;
    return target;
  }, {});
  return DataProxy(makeType("class", classs)) as unknown as IClass;
}

export function Events(e: IEvents): IEvents {
  return makeType("event", e);
}


function makeType<T>(k: string, value: T): T {
  (value as any)["$dataType"] = k;
  return value;
}
