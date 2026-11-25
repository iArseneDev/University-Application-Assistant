-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, -- UUID
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('STUDENT', 'ADMIN')),
  is_verified INTEGER DEFAULT 0, -- 0 false, 1 true
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Students profile
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  other_names TEXT,
  gender TEXT NOT NULL CHECK(gender IN ('MALE', 'FEMALE')),
  date_of_birth TEXT NOT NULL, -- ISO date
  nationality TEXT NOT NULL,
  national_id TEXT UNIQUE NOT NULL,
  phone_number TEXT NOT NULL,
  alternative_phone TEXT,
  province TEXT NOT NULL,
  district TEXT NOT NULL,
  sector TEXT NOT NULL,
  cell TEXT NOT NULL,
  village TEXT NOT NULL,
  school_name TEXT NOT NULL,
  school_type TEXT NOT NULL,
  combination TEXT NOT NULL,
  year_of_completion INTEGER NOT NULL,
  index_number TEXT UNIQUE NOT NULL,
  total_points INTEGER NOT NULL,
  division TEXT,
  application_year INTEGER NOT NULL,
  entry_mode TEXT NOT NULL,
  sponsorship_type TEXT NOT NULL CHECK(sponsorship_type IN ('GOVERNMENT', 'PRIVATE', 'SELF')),
  disability_status INTEGER DEFAULT 0,
  disability_details TEXT,
  guardian_name TEXT NOT NULL,
  guardian_relationship TEXT NOT NULL,
  guardian_phone TEXT NOT NULL,
  guardian_email TEXT,
  status TEXT DEFAULT 'DRAFT' CHECK(status IN ('DRAFT','SUBMITTED','REVIEWED','ACCEPTED','REJECTED')),
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Subjects
CREATE TABLE IF NOT EXISTS subjects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL
);

-- Student results
CREATE TABLE IF NOT EXISTS student_results (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  grade TEXT NOT NULL,
  points INTEGER NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
  UNIQUE(student_id, subject_id)
);

-- Universities
CREATE TABLE IF NOT EXISTS universities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

-- Colleges
CREATE TABLE IF NOT EXISTS colleges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  university_id TEXT NOT NULL,
  FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE
);

-- Programs
CREATE TABLE IF NOT EXISTS programs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT,
  duration_years INTEGER,
  description TEXT,
  college_id TEXT NOT NULL,
  FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
);

-- Program requirements
CREATE TABLE IF NOT EXISTS program_requirements (
  id TEXT PRIMARY KEY,
  program_id TEXT NOT NULL,
  min_points INTEGER NOT NULL,
  required_combination TEXT,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
);

-- Required subjects per program
CREATE TABLE IF NOT EXISTS program_required_subjects (
  id TEXT PRIMARY KEY,
  program_requirement_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  min_grade TEXT,
  FOREIGN KEY (program_requirement_id) REFERENCES program_requirements(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- Applications
CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  program_id TEXT NOT NULL,
  priority INTEGER NOT NULL,
  payment_id TEXT,
  status TEXT DEFAULT 'DRAFT' CHECK(status IN ('DRAFT','SUBMITTED','REVIEWED','ACCEPTED','REJECTED')),
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  transaction_id TEXT UNIQUE NOT NULL,
  payer_name TEXT,
  phone_number TEXT NOT NULL,
  amount INTEGER NOT NULL DEFAULT 5000,
  status TEXT DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'APPROVED', 'REJECTED')),
  application_claimed INTEGER NOT NULL DEFAULT 0 CHECK(application_claimed IN (0, 1)),
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),
  approved_at INTEGER,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Documents (Vercel Blob URLs)
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('CERTIFICATE','ID','RESULT_SLIP')),
  file_url TEXT NOT NULL,
  verified INTEGER DEFAULT 0,
  uploaded_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Recommendations
CREATE TABLE IF NOT EXISTS recommendations (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  program_id TEXT NOT NULL,
  match_score INTEGER,
  reason TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
);

-- Cutoff history
CREATE TABLE IF NOT EXISTS cutoff_history (
  id TEXT PRIMARY KEY,
  program_id TEXT NOT NULL,
  year INTEGER NOT NULL,
  cutoff_points INTEGER NOT NULL,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_index_number ON students(index_number);
CREATE INDEX IF NOT EXISTS idx_results_student ON student_results(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_student ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_payment ON applications(payment_id);

CREATE TABLE IF NOT EXISTS blogs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  author_id TEXT NOT NULL,
  status TEXT DEFAULT 'DRAFT' CHECK(status IN ('DRAFT', 'PUBLISHED')),
  published_at INTEGER,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON blogs(published_at);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  from_user_id TEXT NOT NULL,
  to_user_id TEXT NOT NULL,
  subject TEXT,
  content TEXT NOT NULL,
  is_read INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_messages_from ON messages(from_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_to ON messages(to_user_id);
