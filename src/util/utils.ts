import { SearchParams } from "src/common/searchParams";
import { Varient } from "src/database/entity/varient.entity";
import { CreateVarientDto } from "src/module/product/dto/createVarient.dto";

export function hasDuplicate (arr: string[]){
  return new Set(arr).size !== arr.length;
}

export function calcVarient(varients: CreateVarientDto[]) {
  const res= varients.reduce(
      (acc, cur) => {
          acc.totalPieceAvail += cur.pieceAvail;
          acc.minPrice = Math.min(acc.minPrice, cur.price);
          acc.minDiscountPrice = Math.min(acc.minDiscountPrice, cur.discountPrice ?? Infinity);
          return acc;
      },
      { totalPieceAvail: 0, minPrice: Infinity, minDiscountPrice: Infinity }
  );

  return {
    totalPieceAvail: res.totalPieceAvail,
    minPrice: res.minPrice,
    minDiscountPrice:
      res.minDiscountPrice === Infinity ? undefined : res.minDiscountPrice,
  };
}

export function getPriceVarient(varient: Varient){
  if(varient.discountPrice>0){
    return varient.discountPrice
  }
  return varient.price
}


export function genKeyQuery(query: SearchParams) {
  const sortedQuery = Object.keys(query)
  .sort() // Sắp xếp key theo thứ tự alphabet
  .map((key) => `${key}=${query[key]}`)
    .join('&'); // Tạo lại chuỗi query string
  return sortedQuery
}
