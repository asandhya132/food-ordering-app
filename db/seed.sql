-- Seed foods (sample data)
INSERT INTO foods (name, category, description, price, available_quantity, image_url)
VALUES
('Tomato Pickle', 'Pickles', 'Spicy, tangy tomato pickle made with traditional spices.', 80.00, 50,
 'https://images.unsplash.com/photo-1604908177225-6f2d5d490f9f?auto=format&fit=crop&w=800&q=60'),
('Paneer Butter Masala', 'Curries', 'Creamy paneer curry with butter and mild spices.', 180.00, 30,
 'https://images.unsplash.com/photo-1604908554182-686f4f1a3a1b?auto=format&fit=crop&w=800&q=60'),
('Veg Biryani', 'Rice', 'Aromatic basmati rice cooked with vegetables and spices.', 150.00, 40,
 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?auto=format&fit=crop&w=800&q=60')
ON CONFLICT DO NOTHING;

