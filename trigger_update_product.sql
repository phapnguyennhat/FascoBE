CREATE OR REPLACE FUNCTION update_product_from_varient()
RETURNS TRIGGER AS $$
BEGIN
  -- Cập nhật bảng Product dựa trên các giá trị từ bảng Varient
  UPDATE "product"
  SET 
    "sold" = COALESCE((SELECT SUM("sold") FROM "varient" WHERE "productId" = NEW."productId"), 0),
    "pieceAvail" = COALESCE((SELECT SUM("pieceAvail") FROM "varient" WHERE "productId" = NEW."productId"), 0),
    "price" = COALESCE((SELECT MIN("price") FROM "varient" WHERE "productId" = NEW."productId"), 0),
	 "discountPrice" = (
            SELECT MIN("discountPrice") 
            FROM "varient" 
            WHERE "productId" = NEW."productId" AND "discountPrice" IS NOT NULL
        )
  WHERE "id" = NEW."productId";

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_product
AFTER INSERT OR UPDATE ON "varient"
FOR EACH ROW
EXECUTE FUNCTION update_product_from_varient();



