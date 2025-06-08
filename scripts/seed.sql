-- Insert sample products (these would normally be synced from Shopify)
INSERT INTO products (shopify_id, title, description, handle, product_type, vendor, tags) VALUES
('gid://shopify/Product/1', 'Classic Cotton T-Shirt', 'Comfortable everyday cotton t-shirt perfect for casual wear', 'classic-cotton-tshirt', 'T-Shirts', 'Your Brand', ARRAY['cotton', 'casual', 'basic']),
('gid://shopify/Product/2', 'Denim Jacket', 'Vintage-style denim jacket with modern fit', 'denim-jacket', 'Jackets', 'Your Brand', ARRAY['denim', 'jacket', 'vintage']),
('gid://shopify/Product/3', 'Slim Fit Jeans', 'Premium denim jeans with slim fit cut', 'slim-fit-jeans', 'Jeans', 'Your Brand', ARRAY['denim', 'jeans', 'slim-fit']);

-- Insert sample product variants
INSERT INTO product_variants (product_id, shopify_variant_id, title, price, sku, size, color, inventory_quantity) VALUES
((SELECT id FROM products WHERE handle = 'classic-cotton-tshirt'), 'gid://shopify/ProductVariant/1', 'Small / Black', 29.99, 'TSHIRT-S-BLK', 'S', 'Black', 50),
((SELECT id FROM products WHERE handle = 'classic-cotton-tshirt'), 'gid://shopify/ProductVariant/2', 'Medium / Black', 29.99, 'TSHIRT-M-BLK', 'M', 'Black', 75),
((SELECT id FROM products WHERE handle = 'classic-cotton-tshirt'), 'gid://shopify/ProductVariant/3', 'Large / Black', 29.99, 'TSHIRT-L-BLK', 'L', 'Black', 60),
((SELECT id FROM products WHERE handle = 'classic-cotton-tshirt'), 'gid://shopify/ProductVariant/4', 'Small / White', 29.99, 'TSHIRT-S-WHT', 'S', 'White', 45),
((SELECT id FROM products WHERE handle = 'classic-cotton-tshirt'), 'gid://shopify/ProductVariant/5', 'Medium / White', 29.99, 'TSHIRT-M-WHT', 'M', 'White', 80),
((SELECT id FROM products WHERE handle = 'denim-jacket'), 'gid://shopify/ProductVariant/6', 'Small / Blue', 89.99, 'JACKET-S-BLU', 'S', 'Blue', 25),
((SELECT id FROM products WHERE handle = 'denim-jacket'), 'gid://shopify/ProductVariant/7', 'Medium / Blue', 89.99, 'JACKET-M-BLU', 'M', 'Blue', 30),
((SELECT id FROM products WHERE handle = 'denim-jacket'), 'gid://shopify/ProductVariant/8', 'Large / Blue', 89.99, 'JACKET-L-BLU', 'L', 'Blue', 20),
((SELECT id FROM products WHERE handle = 'slim-fit-jeans'), 'gid://shopify/ProductVariant/9', '30x32 / Dark Blue', 79.99, 'JEANS-30-32-DBLUE', '30x32', 'Dark Blue', 40),
((SELECT id FROM products WHERE handle = 'slim-fit-jeans'), 'gid://shopify/ProductVariant/10', '32x32 / Dark Blue', 79.99, 'JEANS-32-32-DBLUE', '32x32', 'Dark Blue', 35);

-- Insert sample product images
INSERT INTO product_images (product_id, src, alt_text, position) VALUES
((SELECT id FROM products WHERE handle = 'classic-cotton-tshirt'), '/placeholder.svg?height=400&width=400', 'Classic Cotton T-Shirt', 1),
((SELECT id FROM products WHERE handle = 'denim-jacket'), '/placeholder.svg?height=400&width=400', 'Denim Jacket', 1),
((SELECT id FROM products WHERE handle = 'slim-fit-jeans'), '/placeholder.svg?height=400&width=400', 'Slim Fit Jeans', 1);
