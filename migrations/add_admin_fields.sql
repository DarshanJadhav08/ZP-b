-- Add new columns to admins table

ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS qualification VARCHAR(255),
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS experience INTEGER,
ADD COLUMN IF NOT EXISTS gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other'));
