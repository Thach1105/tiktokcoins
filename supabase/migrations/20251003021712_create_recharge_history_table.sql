/*
  # Create recharge history table

  1. New Tables
    - `recharge_history`
      - `id` (uuid, primary key) - Unique identifier for each transaction
      - `tiktok_id` (text) - TikTok ID of the user receiving coins
      - `coin_amount` (integer) - Number of coins purchased
      - `price` (integer) - Price paid in VND
      - `payment_method` (text) - Payment method used
      - `status` (text) - Transaction status (pending, completed, failed)
      - `created_at` (timestamptz) - Transaction timestamp
      
  2. Security
    - Enable RLS on `recharge_history` table
    - Add policy for anyone to insert recharge records
    - Add policy for anyone to view recharge records
    
  3. Notes
    - This is a public demo table without user authentication
    - All users can view all transactions for demonstration purposes
*/

CREATE TABLE IF NOT EXISTS recharge_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tiktok_id text NOT NULL,
  coin_amount integer NOT NULL,
  price integer NOT NULL,
  payment_method text NOT NULL DEFAULT 'VISA',
  status text NOT NULL DEFAULT 'completed',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE recharge_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert recharge records"
  ON recharge_history
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view recharge records"
  ON recharge_history
  FOR SELECT
  TO anon
  USING (true);
