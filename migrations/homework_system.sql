-- Homework System Tables Migration

-- 1. Classes Table
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  standard VARCHAR(10) NOT NULL,
  division VARCHAR(10) NOT NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_on TIMESTAMP DEFAULT NOW(),
  updated_on TIMESTAMP DEFAULT NOW(),
  UNIQUE(client_id, standard, division)
);

-- 2. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_on TIMESTAMP DEFAULT NOW(),
  updated_on TIMESTAMP DEFAULT NOW(),
  UNIQUE(client_id, name)
);

-- 3. Teacher Assignments Table
CREATE TABLE IF NOT EXISTS teacher_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_on TIMESTAMP DEFAULT NOW(),
  updated_on TIMESTAMP DEFAULT NOW(),
  UNIQUE(teacher_id, class_id, subject_id)
);

-- 4. Homework Table
CREATE TABLE IF NOT EXISTS homework (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  homework_text TEXT NOT NULL,
  homework_date DATE NOT NULL,
  attachment_url VARCHAR(500),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_on TIMESTAMP DEFAULT NOW(),
  updated_on TIMESTAMP DEFAULT NOW(),
  UNIQUE(class_id, subject_id, homework_date)
);

-- Create Indexes
CREATE INDEX idx_classes_client ON classes(client_id);
CREATE INDEX idx_subjects_client ON subjects(client_id);
CREATE INDEX idx_teacher_assignments_teacher ON teacher_assignments(teacher_id);
CREATE INDEX idx_teacher_assignments_class ON teacher_assignments(class_id);
CREATE INDEX idx_homework_class_date ON homework(class_id, homework_date);
CREATE INDEX idx_homework_teacher ON homework(teacher_id);
