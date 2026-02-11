-- Add timestamp columns to admins, teachers, students tables

-- Admins table
ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS created_by UUID,
ADD COLUMN IF NOT EXISTS updated_by UUID,
ADD COLUMN IF NOT EXISTS created_on TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_on TIMESTAMP DEFAULT NOW();

-- Teachers table
ALTER TABLE teachers 
ADD COLUMN IF NOT EXISTS created_by UUID,
ADD COLUMN IF NOT EXISTS updated_by UUID,
ADD COLUMN IF NOT EXISTS created_on TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_on TIMESTAMP DEFAULT NOW();

-- Students table
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS created_by UUID,
ADD COLUMN IF NOT EXISTS updated_by UUID,
ADD COLUMN IF NOT EXISTS created_on TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_on TIMESTAMP DEFAULT NOW();

-- Add foreign key constraints
ALTER TABLE admins 
ADD CONSTRAINT fk_admins_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_admins_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE teachers 
ADD CONSTRAINT fk_teachers_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_teachers_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE students 
ADD CONSTRAINT fk_students_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_students_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;
