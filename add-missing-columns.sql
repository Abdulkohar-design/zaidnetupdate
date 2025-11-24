-- Add missing columns to customer_bills table
-- Run this in your Supabase SQL editor

ALTER TABLE customer_bills 
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS package_name TEXT,
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Update existing rows to have default values for new columns
UPDATE customer_bills 
SET 
  phone_number = COALESCE(phone_number, ''),
  address = COALESCE(address, ''),
  package_name = COALESCE(package_name, ''),
  photo_url = COALESCE(photo_url, '')
WHERE phone_number IS NULL OR address IS NULL OR package_name IS NULL OR photo_url IS NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customer_bills_phone_number ON customer_bills(phone_number);
CREATE INDEX IF NOT EXISTS idx_customer_bills_package_name ON customer_bills(package_name);
CREATE INDEX IF NOT EXISTS idx_customer_bills_location ON customer_bills(latitude, longitude);
