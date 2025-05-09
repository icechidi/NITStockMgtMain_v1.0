const db = require("./config/db")

async function setupDatabase() {
  try {
    console.log("Checking database connection...")
    await db.query("SELECT NOW()")
    console.log("Database connection successful")

    console.log("Checking if users table exists...")
    const tableCheck = await db.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')",
    )

    if (!tableCheck.rows[0].exists) {
      console.log("Users table does not exist. Creating it now...")

      // Create users table
      await db.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(20) NOT NULL DEFAULT 'user',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Create updated_at trigger function
      await db.query(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql
      `)

      // Create trigger
      await db.query(`
        CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
      `)

      console.log("Users table created successfully")
    } else {
      console.log("Users table already exists")

      // Check table structure
      console.log("Checking users table structure...")
      const columns = await db.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users'
      `)

      console.log("Users table columns:", columns.rows)
    }

    console.log("Database setup complete")
  } catch (error) {
    console.error("Database setup error:", error)
  } finally {
    // Close the database connection
    await db.end()
  }
}

// Run the setup
setupDatabase()
