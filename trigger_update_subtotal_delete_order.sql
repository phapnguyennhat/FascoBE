CREATE OR REPLACE FUNCTION update_total_order_after_delete()
RETURNS TRIGGER AS $$
DECLARE
    new_subtotal NUMERIC;
BEGIN
    -- Tính tổng giá trị của các OrderItem còn lại sau khi xóa
    SELECT COALESCE(SUM(price * quantity), 0)
    INTO new_subtotal
    FROM "order_item"
    WHERE "orderId" = OLD."orderId";

   
    IF new_subtotal = 0 THEN
        DELETE FROM "order" WHERE id = OLD."orderId";
    ELSE
        -- Cập nhật lại totalOrder.subTotal
        UPDATE "order"
        SET "totalOrder" = jsonb_set("totalOrder", '{subTotal}', to_jsonb(new_subtotal))
        WHERE id = OLD."orderId";
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trigger_update_total_order
AFTER DELETE ON order_item
FOR EACH ROW
EXECUTE FUNCTION update_total_order_after_delete();
