// public/js/dynamic-content.js

// Import Supabase client from CDN
const supabaseUrl = 'https://nwgopjqgwdbmbwzctads.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53Z29wanFnd2RibWJ3emN0YWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MDAwMDcsImV4cCI6MjA2ODA3NjAwN30.cd57Ldr86E44SkY77UdhKxY891BD-fltAC2mgcAcH_c';

// Initialize Supabase client
let supabase;

// Initialize the Supabase client when the page loads
function initSupabase() {
    // Check if environment variables are available (for production)
    const url = window.SUPABASE_URL || supabaseUrl;
    const key = window.SUPABASE_ANON_KEY || supabaseAnonKey;
    
    if (window.supabase) {
        supabase = window.supabase.createClient(url, key);
    } else {
        console.warn('⚠️ Supabase client not loaded. Please include Supabase CDN script.');
        return false;
    }
    return true;
}

// Utility function to show loading state
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '<div class="loading">Loading...</div>';
    }
}

// Utility function to show error state
function showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `<div class="error">Error: ${message}</div>`;
    }
}

// Fetch and display blogs
async function loadBlogs() {
    showLoading('blog-container');
    
    try {
        const { data: blogs, error } = await supabase
            .from('blogs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(6);

        if (error) {
            console.error('Error fetching blogs:', error);
            showError('blog-container', 'Failed to load blogs');
            return;
        }

        const container = document.getElementById('blog-container');
        if (!container) return;

        if (!blogs || blogs.length === 0) {
            container.innerHTML = '<p>No blog posts available at the moment.</p>';
            return;
        }

        container.innerHTML = blogs.map(blog => `
            <div class="blog-post-card">
                <h3>${escapeHtml(blog.title)}</h3>
                <p class="blog-excerpt">${escapeHtml(blog.excerpt || 'No excerpt available.')}</p>
                ${blog.link ? 
                    `<a href="${blog.link}" class="read-more-link" target="_blank" rel="noopener noreferrer">Read More →</a>` : 
                    `<span class="read-more-link disabled">Coming Soon →</span>`
                }
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading blogs:', error);
        showError('blog-container', 'Failed to load blogs');
    }
}

// Fetch and display testimonials
async function loadTestimonials() {
    showLoading('testimonial-container');
    
    try {
        const { data: testimonials, error } = await supabase
            .from('testimonials')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching testimonials:', error);
            showError('testimonial-container', 'Failed to load testimonials');
            return;
        }

        const container = document.getElementById('testimonial-container');
        if (!container) return;

        if (!testimonials || testimonials.length === 0) {
            container.innerHTML = '<p>No testimonials available at the moment.</p>';
            return;
        }

        container.innerHTML = testimonials.map(testimonial => `
            <div class="testimonial-card">
                <div class="testimonial-quote">${escapeHtml(testimonial.quote)}</div>
                <div class="testimonial-author">— ${escapeHtml(testimonial.author)}</div>
            </div>
        `).join('');

        // Initialize testimonial scrolling after loading
        initTestimonialScrolling();

    } catch (error) {
        console.error('Error loading testimonials:', error);
        showError('testimonial-container', 'Failed to load testimonials');
    }
}

// Fetch and display FAQs
async function loadFaqs() {
    showLoading('faq-container');
    
    try {
        const { data: faqs, error } = await supabase
            .from('faqs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching FAQs:', error);
            showError('faq-container', 'Failed to load FAQs');
            return;
        }

        const container = document.getElementById('faq-container');
        if (!container) return;

        if (!faqs || faqs.length === 0) {
            container.innerHTML = '<p>No FAQs available at the moment.</p>';
            return;
        }

        container.innerHTML = faqs.map((faq, index) => `
            <div class="faq-item" data-faq-id="${faq.id}">
                <h4>${escapeHtml(faq.question)}</h4>
                <p>${escapeHtml(faq.answer)}</p>
            </div>
        `).join('');

        // Initialize FAQ accordion functionality
        initFaqAccordion();

    } catch (error) {
        console.error('Error loading FAQs:', error);
        showError('faq-container', 'Failed to load FAQs');
    }
}

// Initialize FAQ accordion functionality
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const header = item.querySelector('h4');
        if (header) {
            header.addEventListener('click', () => {
                // Close other open FAQs
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current FAQ
                item.classList.toggle('active');
            });
        }
    });
}

// Initialize testimonial scrolling functionality
function initTestimonialScrolling() {
    const container = document.getElementById('testimonial-container');
    const leftButton = document.getElementById('scroll-left');
    const rightButton = document.getElementById('scroll-right');
    
    if (!container || !leftButton || !rightButton) return;

    leftButton.addEventListener('click', () => {
        container.scrollBy({ left: -300, behavior: 'smooth' });
    });

    rightButton.addEventListener('click', () => {
        container.scrollBy({ left: 300, behavior: 'smooth' });
    });
}

// Utility function to escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Configuration function to set Supabase credentials
function configureSupabase(url, anonKey) {
    window.SUPABASE_URL = url;
    window.SUPABASE_ANON_KEY = anonKey;
    
    // Re-initialize Supabase with new credentials
    if (window.supabase) {
        supabase = window.supabase.createClient(url, anonKey);
        console.log('✅ Supabase configured successfully');
        return true;
    }
    return false;
}

// Main initialization function
async function initializeDynamicContent() {
    console.log('🚀 Initializing dynamic content...');
    
    // Check if Supabase is available
    if (!initSupabase()) {
        console.warn('⚠️ Supabase not available. Dynamic content will not load.');
        return;
    }

    // Check if credentials are properly configured
    const url = window.SUPABASE_URL || supabaseUrl;
    const key = window.SUPABASE_ANON_KEY || supabaseAnonKey;
    
    if (url === 'https://your-project-ref.supabase.co' || key === 'your-anon-key-here') {
        console.warn('⚠️ SETUP REQUIRED: Please configure your Supabase credentials');
        
        // Show setup message in containers
        ['blog-container', 'testimonial-container', 'faq-container'].forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `
                    <div class="setup-message" style="text-align: center; padding: 2rem; background: rgba(255, 255, 255, 0.8); border-radius: 8px; margin: 1rem 0;">
                        <h3>Setup Required</h3>
                        <p>Please configure your Supabase credentials to load dynamic content.</p>
                        <p>Check the console or README for setup instructions.</p>
                    </div>
                `;
            }
        });
        return;
    }

    try {
        // Load all content in parallel for better performance
        await Promise.all([
            loadBlogs(),
            loadTestimonials(),
            loadFaqs()
        ]);
        
        console.log('✅ Dynamic content loaded successfully');
    } catch (error) {
        console.error('❌ Error initializing dynamic content:', error);
    }
}

// Export functions for global access
window.TerraMateDynamicContent = {
    initialize: initializeDynamicContent,
    configure: configureSupabase,
    loadBlogs,
    loadTestimonials,
    loadFaqs
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeDynamicContent);