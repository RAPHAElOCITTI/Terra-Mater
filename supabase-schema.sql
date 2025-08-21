-- Terra Mater Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the required tables

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    quote TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    role VARCHAR(255), -- Optional field for author's role/title
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    excerpt TEXT, -- Optional short description/preview
    content TEXT NOT NULL, -- Full blog content
    link VARCHAR(1000), -- Optional external link to read more
    published BOOLEAN DEFAULT FALSE, -- Whether the blog is published
    featured BOOLEAN DEFAULT FALSE, -- Whether to feature the blog
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create faqs table
CREATE TABLE IF NOT EXISTS faqs (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(255), -- Optional category for organizing FAQs
    display_order INTEGER DEFAULT 0, -- For custom ordering
    active BOOLEAN DEFAULT TRUE, -- Whether to show the FAQ
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_testimonials_updated_at 
    BEFORE UPDATE ON testimonials 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blogs_updated_at 
    BEFORE UPDATE ON blogs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at 
    BEFORE UPDATE ON faqs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testimonials
INSERT INTO testimonials (quote, author, role) VALUES 
('Working with Charlotte has been transformational. Her gentle approach to motherhood coaching helped me find balance during one of the most challenging phases of my journey.', 'Sarah Michelle', 'New Mother'),
('Charlotte''s support through The Sacred Line gave me the confidence to trust my instincts as a mother. I felt truly held during those intense early months.', 'Emma Johnson', 'Mother of Two'),
('The motherhood guidance session was exactly what I needed. Charlotte created such a safe space for me to explore my fears and find my strength.', 'Maria Rodriguez', 'First-time Mother');

-- Insert sample data for blogs
INSERT INTO blogs (title, excerpt, content, link, published) VALUES 
('Embracing the Sacred Pause in Motherhood', 'Discover the power of taking intentional moments to connect with yourself during the beautiful chaos of motherhood.', 'In the whirlwind of motherhood, we often forget to pause and breathe. This sacred pause isn''t just rest—it''s a return to yourself...', 'https://example.com/sacred-pause', TRUE),
('Gentle Self-Nourishment for New Mothers', 'Simple, practical ways to nourish yourself while caring for your little ones.', 'Self-care as a mother doesn''t have to be complicated or time-consuming. Learn gentle ways to nourish your body and soul...', NULL, TRUE),
('Finding Your Motherhood Rhythm', 'Every mother has her own unique rhythm. Here''s how to discover and honor yours.', 'There''s no one-size-fits-all approach to motherhood. Your rhythm is unique to you, your children, and your circumstances...', NULL, FALSE);

-- Insert sample data for FAQs
INSERT INTO faqs (question, answer, category, display_order) VALUES 
('What is Terra Mater Coaching?', 'Terra Mater Coaching provides gentle, embodied support for mothers during their transformative journey. We combine somatic practices with practical wisdom to help mothers connect with their innate strength while receiving the deep care they need.', 'About', 1),
('How does The Sacred Line work?', 'The Sacred Line is our dedicated messaging support channel for ''Motherhood Anchor'' clients. It provides continuous guidance and connection, allowing you to feel supported through intense seasons of motherhood whenever you need it most.', 'Services', 2),
('What''s the difference between Motherhood Guidance and Motherhood Anchor?', 'Motherhood Guidance is a single transformative 1:1 session perfect for immediate support and clarity. Motherhood Anchor includes an initial session plus 2 months of ongoing support through The Sacred Line messaging channel.', 'Services', 3),
('Do you offer online sessions?', 'Yes, all sessions are available online for your convenience. We use secure video conferencing to ensure privacy and comfort during our work together.', 'Sessions', 4),
('How do I know which service is right for me?', 'If you''re seeking immediate clarity and support, Motherhood Guidance is perfect. If you''re going through an intense season and need ongoing support, Motherhood Anchor would be more suitable. Feel free to reach out if you''d like to discuss your specific needs.', 'Services', 5);

-- Set up Row Level Security (RLS) policies for public read access
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published/active content
CREATE POLICY "Allow public read access to testimonials" ON testimonials
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to published blogs" ON blogs
    FOR SELECT USING (published = true);

CREATE POLICY "Allow public read access to active FAQs" ON faqs
    FOR SELECT USING (active = true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published);
CREATE INDEX IF NOT EXISTS idx_blogs_featured ON blogs(featured);
CREATE INDEX IF NOT EXISTS idx_faqs_active ON faqs(active);
CREATE INDEX IF NOT EXISTS idx_faqs_display_order ON faqs(display_order);

-- Comments for documentation
COMMENT ON TABLE testimonials IS 'Stores client testimonials and feedback';
COMMENT ON TABLE blogs IS 'Stores blog posts and articles';
COMMENT ON TABLE faqs IS 'Stores frequently asked questions and answers';

COMMENT ON COLUMN blogs.published IS 'Whether the blog post is visible to the public';
COMMENT ON COLUMN blogs.featured IS 'Whether to feature the blog post prominently';
COMMENT ON COLUMN faqs.active IS 'Whether the FAQ is visible to the public';
COMMENT ON COLUMN faqs.display_order IS 'Custom ordering for FAQ display (lower numbers first)';