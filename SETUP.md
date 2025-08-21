# Terra Mater - Environmental Conservation Management System

## Setup Instructions

### 1. Supabase Database Setup

Run the SQL script in `database-setup.sql` in your Supabase SQL Editor to create all necessary tables:
- testimonials
- blogs
- faqs
- projects
- data_entries

### 2. Environment Configuration

Update the `.env` file with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 3. Running the Application

For development with vite:
```bash
npm install
npm run dev
```

For quick testing with Python HTTP server:
```bash
python3 -m http.server 8080
```
Then visit `http://localhost:8080/admin.html`

### 4. Admin Dashboard Features

The admin dashboard (`admin.html`) provides full CRUD operations for:
- **Testimonials**: Manage customer testimonials
- **Blog Posts**: Manage blog content
- **FAQs**: Manage frequently asked questions
- **Projects**: Manage environmental conservation projects
- **Data Entries**: Manage project-specific data with JSON storage

### 5. Authentication

The system uses Supabase Auth for secure admin access. Create admin users through the Supabase dashboard or using the signup functionality.

### 6. Data Models

- **Projects**: Track conservation projects with name, description, location
- **Data Entries**: Store project-related data in flexible JSON format
- **Content**: Testimonials, blogs, and FAQs for public website

### File Structure

```
src/
├── admin.ts          # Admin dashboard logic
├── auth.ts           # Authentication utilities  
├── supabaseClient.ts # Supabase configuration
├── types/index.ts    # TypeScript interfaces
├── main.ts           # Main website functionality
└── db.ts             # Database utilities

admin.html            # Admin dashboard UI
index.html           # Main website
database-setup.sql   # Database schema
```

### Next Steps

1. Set up your Supabase project and run the database setup
2. Configure your environment variables
3. Create an admin user
4. Test the CRUD operations through the admin dashboard