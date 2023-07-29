//分类对象的ts类型
export interface Category {
  id: number;
  name: string;
  category2Id?: number;
  category1Id?: number;
}
export type CategoryArr = Category[];

//平台属性与属性值的ts
//属性值ts
export interface AttrValue {
  id?: number;
  valueName: string;
  attrId?: number;
}
//属性值的数组
export type AttrValueList = AttrValue[];

//属性的ts
export interface Attr {
  id?: number;
  attrName: string;
  categoryId: number;
  categoryLevel: number;
  attrValueList: AttrValueList;
}

//全部平台属性数组类型
export type Attrs = Attr[];
