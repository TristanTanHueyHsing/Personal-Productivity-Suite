# migration_cascade_delete.py
# Run this script to add cascade delete constraints to existing database

import sqlite3
import os
import shutil
from datetime import datetime

def backup_database(db_path):
    """Create a backup of the current database"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = f"{db_path}.backup_{timestamp}"
    shutil.copy2(db_path, backup_path)
    print(f"✅ Database backed up to: {backup_path}")
    return backup_path

def migrate_database(db_path="app.db"):
    """Migrate database to add cascade delete constraints"""
    
    # Check if database exists
    if not os.path.exists(db_path):
        print(f"❌ Database file {db_path} not found!")
        return False
    
    # Create backup
    backup_path = backup_database(db_path)
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        print("🔄 Starting migration...")
        
        # Enable foreign key constraints
        cursor.execute("PRAGMA foreign_keys = ON")
        
        # 1. Create new tables with CASCADE constraints
        print("📝 Creating new tables with CASCADE constraints...")
        
        # Users table (unchanged structure, but we'll recreate for consistency)
        cursor.execute("""
            CREATE TABLE users_new (
                id INTEGER PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                username TEXT NOT NULL,
                password TEXT NOT NULL
            )
        """)
        
        # Notes table with CASCADE
        cursor.execute("""
            CREATE TABLE notes_new (
                id INTEGER PRIMARY KEY,
                title TEXT NOT NULL DEFAULT 'Untitled Note',
                content TEXT NOT NULL DEFAULT '',
                preview TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                user_id INTEGER NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users_new(id) ON DELETE CASCADE
            )
        """)
        
        # Todos table with CASCADE
        cursor.execute("""
            CREATE TABLE todos_new (
                id INTEGER PRIMARY KEY,
                text TEXT NOT NULL,
                completed BOOLEAN DEFAULT 0,
                priority TEXT DEFAULT 'medium',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                user_id INTEGER,
                FOREIGN KEY (user_id) REFERENCES users_new(id) ON DELETE CASCADE
            )
        """)
        
        # Journals table with CASCADE
        cursor.execute("""
            CREATE TABLE journals_new (
                id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                mood TEXT DEFAULT 'neutral',
                tags TEXT DEFAULT '[]',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                user_id INTEGER,
                FOREIGN KEY (user_id) REFERENCES users_new(id) ON DELETE CASCADE
            )
        """)
        
        # Pomodoro sessions table with CASCADE
        cursor.execute("""
            CREATE TABLE pomodoro_sessions_new (
                id INTEGER PRIMARY KEY,
                user_id INTEGER NOT NULL,
                focus_sessions_completed INTEGER DEFAULT 0,
                session_date DATE DEFAULT CURRENT_DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users_new(id) ON DELETE CASCADE
            )
        """)
        
        # 2. Copy data from old tables to new tables
        print("📋 Copying existing data...")
        
        # Copy users
        cursor.execute("INSERT INTO users_new SELECT * FROM users")
        
        # Copy notes (if table exists)
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='notes'")
        if cursor.fetchone():
            cursor.execute("INSERT INTO notes_new SELECT * FROM notes")
        
        # Copy todos (if table exists)
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='todos'")
        if cursor.fetchone():
            cursor.execute("INSERT INTO todos_new SELECT * FROM todos")
        
        # Copy journals (if table exists)
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='journals'")
        if cursor.fetchone():
            cursor.execute("INSERT INTO journals_new SELECT * FROM journals")
        
        # Copy pomodoro_sessions (if table exists)
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='pomodoro_sessions'")
        if cursor.fetchone():
            cursor.execute("INSERT INTO pomodoro_sessions_new SELECT * FROM pomodoro_sessions")
        
        # 3. Drop old tables
        print("🗑️  Removing old tables...")
        cursor.execute("DROP TABLE IF EXISTS users")
        cursor.execute("DROP TABLE IF EXISTS notes")
        cursor.execute("DROP TABLE IF EXISTS todos")
        cursor.execute("DROP TABLE IF EXISTS journals")
        cursor.execute("DROP TABLE IF EXISTS pomodoro_sessions")
        
        # 4. Rename new tables
        print("🔄 Renaming new tables...")
        cursor.execute("ALTER TABLE users_new RENAME TO users")
        cursor.execute("ALTER TABLE notes_new RENAME TO notes")
        cursor.execute("ALTER TABLE todos_new RENAME TO todos")
        cursor.execute("ALTER TABLE journals_new RENAME TO journals")
        cursor.execute("ALTER TABLE pomodoro_sessions_new RENAME TO pomodoro_sessions")
        
        # 5. Create indexes
        print("📊 Creating indexes...")
        cursor.execute("CREATE UNIQUE INDEX IF NOT EXISTS ix_users_email ON users(email)")
        cursor.execute("CREATE INDEX IF NOT EXISTS ix_users_id ON users(id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS ix_notes_id ON notes(id)")
        
        # 6. Verify foreign key constraints
        print("✅ Verifying foreign key constraints...")
        cursor.execute("PRAGMA foreign_key_check")
        violations = cursor.fetchall()
        if violations:
            print(f"⚠️  Foreign key violations found: {violations}")
            raise Exception("Foreign key violations detected!")
        
        # Commit all changes
        conn.commit()
        print("✅ Migration completed successfully!")
        
        # Show table counts for verification
        cursor.execute("SELECT COUNT(*) FROM users")
        user_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM notes")
        notes_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM todos")
        todos_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM journals")
        journals_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM pomodoro_sessions")
        pomodoro_count = cursor.fetchone()[0]
        
        print(f"📊 Data verification:")
        print(f"   Users: {user_count}")
        print(f"   Notes: {notes_count}")
        print(f"   Todos: {todos_count}")
        print(f"   Journals: {journals_count}")
        print(f"   Pomodoro Sessions: {pomodoro_count}")
        
        return True
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        conn.rollback()
        
        # Restore from backup
        print(f"🔄 Restoring from backup: {backup_path}")
        shutil.copy2(backup_path, db_path)
        print("✅ Database restored from backup")
        
        return False
        
    finally:
        conn.close()

def test_cascade_delete(db_path="app.db"):
    """Test that cascade delete is working properly"""
    print("\n🧪 Testing cascade delete functionality...")
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Enable foreign keys
        cursor.execute("PRAGMA foreign_keys = ON")
        
        # Create a test user
        cursor.execute("INSERT INTO users (email, username, password) VALUES (?, ?, ?)",
                      ("test@example.com", "testuser", "testpass"))
        test_user_id = cursor.lastrowid
        
        # Create test data for this user
        cursor.execute("INSERT INTO notes (title, content, user_id) VALUES (?, ?, ?)",
                      ("Test Note", "Test content", test_user_id))
        cursor.execute("INSERT INTO todos (text, user_id) VALUES (?, ?)",
                      ("Test Todo", test_user_id))
        
        # Count records before deletion
        cursor.execute("SELECT COUNT(*) FROM notes WHERE user_id = ?", (test_user_id,))
        notes_before = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM todos WHERE user_id = ?", (test_user_id,))
        todos_before = cursor.fetchone()[0]
        
        print(f"   Before deletion: {notes_before} notes, {todos_before} todos")
        
        # Delete the user (should cascade)
        cursor.execute("DELETE FROM users WHERE id = ?", (test_user_id,))
        
        # Count records after deletion
        cursor.execute("SELECT COUNT(*) FROM notes WHERE user_id = ?", (test_user_id,))
        notes_after = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM todos WHERE user_id = ?", (test_user_id,))
        todos_after = cursor.fetchone()[0]
        
        print(f"   After deletion: {notes_after} notes, {todos_after} todos")
        
        if notes_after == 0 and todos_after == 0:
            print("✅ Cascade delete is working correctly!")
            conn.rollback()  # Don't save test data
            return True
        else:
            print("❌ Cascade delete is not working!")
            conn.rollback()
            return False
            
    except Exception as e:
        print(f"❌ Test failed: {e}")
        conn.rollback()
        return False
    finally:
        conn.close()

if __name__ == "__main__":
    print("🚀 Starting database migration for cascade delete...")
    print("=" * 50)
    
    # Change to the directory where your app.db is located
    # If running from project root, change to backend directory
    if os.path.exists("backend/app.db"):
        os.chdir("backend")
        print("📁 Changed to backend directory")
    
    # Run migration
    success = migrate_database()
    
    if success:
        # Test the migration
        test_success = test_cascade_delete()
        
        if test_success:
            print("\n🎉 Migration completed successfully!")
            print("💡 Your database now supports cascade delete.")
            print("💡 When you delete a user, all their related data will be automatically deleted.")
        else:
            print("\n⚠️  Migration completed but cascade delete test failed.")
            print("💡 Please check your foreign key constraints.")
    else:
        print("\n❌ Migration failed. Database has been restored from backup.")
        
    print("\n" + "=" * 50)