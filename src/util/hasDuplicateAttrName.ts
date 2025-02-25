import { ValueAttr } from "src/database/entity/valueAttr.entity";

export const hasDuplicateAttrName = (valueAttrs: ValueAttr[]): boolean => {
  const attrNameSet = new Set<string>();
  for (const valueAttr of valueAttrs) {
    if (attrNameSet.has(valueAttr.attrProduct.name)) {
      return true; // Phát hiện trùng lặp
    }
    attrNameSet.add(valueAttr.attrProduct.name);
  }
  return false; // Không có trùng lặp
};