-- Seed data for recharge_history table
-- This provides initial "standard data" for the project

INSERT INTO recharge_history (tiktok_id, coin_amount, price, payment_method, status, created_at)
VALUES 
('memorymusic', 30, 9800, 'VISA', 'completed', NOW() - INTERVAL '1 day'),
('memorymusic', 700, 227700, 'VISA', 'completed', NOW() - INTERVAL '2 hours'),
('mem0ry_fan', 350, 113900, 'Mastercard', 'completed', NOW() - INTERVAL '15 hours'),
('star_user', 7000, 2276200, 'JCB', 'completed', NOW() - INTERVAL '3 days'),
('star_user', 3500, 1138100, 'VISA', 'completed', NOW() - INTERVAL '5 minutes');
