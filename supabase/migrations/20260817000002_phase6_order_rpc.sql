-- Phase 6 Atomic Order Creation RPC Function

CREATE OR REPLACE FUNCTION public.create_customer_order(
  p_table_id UUID,
  p_customer_name TEXT,
  p_customer_phone TEXT,
  p_order_note TEXT,
  p_items JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_item JSONB;
  v_menu_item RECORD;
  v_total_amount NUMERIC(10,2) := 0;
  v_order_id UUID;
BEGIN
  -- 1. Validate Table existence & active status
  IF NOT EXISTS (SELECT 1 FROM public.tables WHERE id = p_table_id AND is_active = true) THEN
    RAISE EXCEPTION 'Invalid or inactive table configuration';
  END IF;

  -- 2. Validate items array
  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Order must contain at least one item';
  END IF;

  -- 3. Calculate subtotal & verify availability on the server
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    SELECT * INTO v_menu_item 
    FROM public.menu_items 
    WHERE id = (v_item->>'menu_item_id')::UUID;

    IF v_menu_item IS NULL THEN
      RAISE EXCEPTION 'One or more items in your cart no longer exist';
    END IF;

    IF NOT v_menu_item.is_available THEN
      RAISE EXCEPTION 'Item "%" is currently sold out or unavailable', v_menu_item.name;
    END IF;

    IF (v_item->>'quantity')::INT <= 0 THEN
      RAISE EXCEPTION 'Item quantity must be greater than zero';
    END IF;

    v_total_amount := v_total_amount + (v_menu_item.price * (v_item->>'quantity')::INT);
  END LOOP;

  -- 4. Create Order record
  INSERT INTO public.orders (
    table_id,
    status,
    total_amount,
    customer_name,
    customer_phone,
    order_note
  )
  VALUES (
    p_table_id,
    'PENDING',
    v_total_amount,
    NULLIF(TRIM(p_customer_name), ''),
    NULLIF(TRIM(p_customer_phone), ''),
    NULLIF(TRIM(p_order_note), '')
  )
  RETURNING id INTO v_order_id;

  -- 5. Create Order Items (snapshotting current item_name and price)
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    SELECT * INTO v_menu_item 
    FROM public.menu_items 
    WHERE id = (v_item->>'menu_item_id')::UUID;

    INSERT INTO public.order_items (
      order_id,
      menu_item_id,
      item_name,
      quantity,
      price,
      item_note
    )
    VALUES (
      v_order_id,
      v_menu_item.id,
      v_menu_item.name,
      (v_item->>'quantity')::INT,
      v_menu_item.price,
      NULLIF(TRIM(v_item->>'item_note'), '')
    );
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'total_amount', v_total_amount
  );
END;
$$;

-- Grant EXECUTE permission to public / anon users for order placement
GRANT EXECUTE ON FUNCTION public.create_customer_order(UUID, TEXT, TEXT, TEXT, JSONB) TO anon, authenticated;
