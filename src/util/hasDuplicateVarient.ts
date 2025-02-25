import { CreateVarientDto } from "src/module/product/dto/createVarient.dto";

 export function hasDuplicateVariants(createVarientDtos: CreateVarientDto[]): boolean {
  const seen = new Set<string>();

  for (const variant of createVarientDtos) {
      // Sắp xếp và chuyển mảng thành chuỗi để đảm bảo thứ tự không ảnh hưởng
      const key = variant.attrValueNames.sort().join('|'); 

      if (seen.has(key)) {
          return true; // Nếu đã tồn tại trong tập hợp, có nghĩa là trùng
      }
      seen.add(key);
  }

  return false; // Không có bản ghi nào trùng nhau
}