-- Skema relasional konseptual PaperNotes untuk tugas SQL.
-- PocketBase tetap menggunakan collection/migration; file ini dijalankan terpisah
-- pada SQLite biasa dan tidak boleh dijalankan terhadap file database PocketBase.

BEGIN TRANSACTION;

CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    email_visibility INTEGER NOT NULL DEFAULT 0 CHECK (email_visibility IN (0, 1)),
    verified INTEGER NOT NULL DEFAULT 0 CHECK (verified IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE folders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 100),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, name),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE tags (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 50),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, name),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE notes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    folder_id TEXT,
    title TEXT NOT NULL DEFAULT '',
    desc TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (folder_id) REFERENCES folders (id) ON DELETE SET NULL
);

CREATE TABLE note_tags (
    id TEXT PRIMARY KEY,
    note_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (note_id, tag_id),
    FOREIGN KEY (note_id) REFERENCES notes (id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
);

CREATE TABLE note_versions (
    id TEXT PRIMARY KEY,
    note_id TEXT NOT NULL,
    title TEXT NOT NULL DEFAULT '',
    desc TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (note_id) REFERENCES notes (id) ON DELETE CASCADE
);

CREATE INDEX idx_notes_user_created ON notes (user_id, created_at);
CREATE INDEX idx_note_tags_tag ON note_tags (tag_id);
CREATE INDEX idx_note_versions_note_created ON note_versions (note_id, created_at);

INSERT INTO users (id, name, email, password_hash, email_visibility, verified) VALUES
    ('0000000000user1', 'fadhil', 'fadhil@example.com', '$2a$10$poeNU6OyJzZTlC54tufU0.vAKjyttogv8xxunLlIvLr4DYPt1wFsa', 1, 1),
    ('0000000000user2', 'andrew', 'andrew@example.com', '$2a$10$tvMKuG.eu/unV2Y5fC2lmOxp1.RKPQIEDgubvI4ZOtR99a/dQPxXK', 1, 1),
    ('0000000000user3', 'sarah', 'sarah@example.com', '$2a$10$h4FJXrACl6Vqxi.ProDEd.yrJSpHHDy.YAKGFSwrlt2szgEkmHaIS', 1, 1),
    ('0000000000user4', 'nabila', 'nabila@example.com', '$2a$10$ytKVMDlNfO/nKi4NpyRGg.csqMLJA.EsuX9R4rbnnbKo5CTVwEIbe', 1, 1),
    ('0000000000user5', 'bima', 'bima@example.com', '$2a$10$GPNfTdjZ.l0WdSCa5nfkWORzbTxkEbyNL/v.XSpT1A12hDtS1dgGK', 1, 1);

INSERT INTO folders (id, user_id, name) VALUES
    ('00000000folder1', '0000000000user1', 'Development'),
    ('00000000folder2', '0000000000user2', 'Work'),
    ('00000000folder3', '0000000000user3', 'Reading'),
    ('00000000folder4', '0000000000user4', 'Ideas'),
    ('00000000folder5', '0000000000user5', 'Personal');

INSERT INTO tags (id, user_id, name) VALUES
    ('00000000000tag1', '0000000000user1', 'svelte'),
    ('00000000000tag2', '0000000000user2', 'meeting'),
    ('00000000000tag3', '0000000000user3', 'reading'),
    ('00000000000tag4', '0000000000user4', 'project'),
    ('00000000000tag5', '0000000000user5', 'shopping');

INSERT INTO notes (id, user_id, folder_id, title, desc, created_at, updated_at) VALUES
    ('0000000000note1', '0000000000user1', '00000000folder1', 'Belajar SvelteKit', 'Pelajari routing, load function, form actions, dan API endpoint di SvelteKit.', '2025-09-15 10:00:00', '2025-09-15 10:00:00'),
    ('0000000000note2', '0000000000user2', '00000000folder2', 'Meeting', 'Meeting dengan tim pada hari Jumat pukul 10:00.', '2025-09-15 23:00:00', '2025-09-15 23:00:00'),
    ('0000000000note3', '0000000000user3', '00000000folder3', 'Buku yang Ingin Dibaca', 'Clean Code, The Pragmatic Programmer, dan Designing Data-Intensive Applications.', '2025-09-16 00:00:00', '2025-09-16 00:00:00'),
    ('0000000000note4', '0000000000user4', '00000000folder4', 'Ide Project', 'Membuat aplikasi notes sederhana seperti Google Keep menggunakan SvelteKit.', '2025-09-15 22:00:00', '2025-09-15 22:00:00'),
    ('0000000000note5', '0000000000user5', '00000000folder5', 'Belanja Mingguan', 'Beli susu, telur, roti, kopi, dan buah.', '2025-09-15 16:00:00', '2025-09-15 16:00:00');

INSERT INTO note_tags (id, note_id, tag_id) VALUES
    ('0000000notetag1', '0000000000note1', '00000000000tag1'),
    ('0000000notetag2', '0000000000note2', '00000000000tag2'),
    ('0000000notetag3', '0000000000note3', '00000000000tag3'),
    ('0000000notetag4', '0000000000note4', '00000000000tag4'),
    ('0000000notetag5', '0000000000note5', '00000000000tag5');

INSERT INTO note_versions (id, note_id, title, desc, created_at, updated_at) VALUES
    ('0000000version1', '0000000000note1', 'Belajar SvelteKit', 'Pelajari routing dan form actions di SvelteKit.', '2025-09-14 10:00:00', '2025-09-14 10:00:00'),
    ('0000000version2', '0000000000note2', 'Meeting', 'Meeting tim hari Jumat.', '2025-09-14 23:00:00', '2025-09-14 23:00:00'),
    ('0000000version3', '0000000000note3', 'Buku yang Ingin Dibaca', 'Clean Code dan The Pragmatic Programmer.', '2025-09-15 00:00:00', '2025-09-15 00:00:00'),
    ('0000000version4', '0000000000note4', 'Ide Project', 'Membuat aplikasi notes sederhana.', '2025-09-14 22:00:00', '2025-09-14 22:00:00'),
    ('0000000version5', '0000000000note5', 'Belanja Mingguan', 'Beli susu, telur, roti, dan buah.', '2025-09-14 16:00:00', '2025-09-14 16:00:00');

COMMIT;
