// src/main.ts
import { supabase } from './db';
import { Testimonial, Blog, Faq } from './types';
import { Header } from './header';

document.addEventListener('DOMContentLoaded', async () => {
    // Wait a bit for DOM to be fully ready, then initialize
    setTimeout(() => {
        const header = new Header();
        header.init();
    }, 100);

    // --- Core Data Loading Functions ---

    /**
     * Loads testimonials from Supabase and renders them.
     */
    const loadTestimonials = async (): Promise<void> => {
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error loading testimonials:', error);
            return;
        }

        const testimonialContainer = document.getElementById('testimonial-container') as HTMLDivElement | null;
        if (testimonialContainer) {
            testimonialContainer.innerHTML = '';
            (data as Testimonial[]).forEach(testimonial => {
                const card = document.createElement('div');
                card.className = 'testimonial-card';
                card.innerHTML = `
                    <p class="quote">"${testimonial.quote}"</p>
                    <p class="author">- ${testimonial.author}</p>
                `;
                testimonialContainer.appendChild(card);
            });
            initializeTestimonialSlider();
        }
    };

    /**
     * Loads blog posts from Supabase and renders them.
     */
    const loadBlogPosts = async (): Promise<void> => {
        const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error loading blogs:', error);
            return;
        }

        const blogContainer = document.getElementById('blog-posts') as HTMLDivElement | null;
        if (blogContainer) {
            blogContainer.innerHTML = '';
            (data as Blog[]).forEach(post => {
                const article = document.createElement('article');
                article.className = 'blog-post';
                article.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                    <a href="${post.link}" target="_blank" class="read-more">Read More</a>
                `;
                blogContainer.appendChild(article);
            });
        }
    };

    /**
     * Loads FAQs from Supabase and renders them.
     */
    const loadFaqs = async (): Promise<void> => {
        const { data, error } = await supabase
            .from('faqs')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error loading FAQs:', error);
            return;
        }

        const faqList = document.getElementById('faq-list') as HTMLDivElement | null;
        if (faqList) {
            faqList.innerHTML = '';
            (data as Faq[]).forEach(faq => {
                const item = document.createElement('div');
                item.className = 'faq-item';
                item.innerHTML = `
                    <div class="faq-question">
                        <p>${faq.question}</p>
                        <span class="toggle-icon">+</span>
                    </div>
                    <div class="faq-answer">
                        <p>${faq.answer}</p>
                    </div>
                `;
                faqList.appendChild(item);
            });
        }
    };

    /**
     * Initializes the testimonial slider functionality.
     */
    const initializeTestimonialSlider = (): void => {
        const testimonialContainer = document.getElementById('testimonial-container') as HTMLDivElement | null;
        const scrollLeftBtn = document.getElementById('scroll-left') as HTMLButtonElement | null;
        const scrollRightBtn = document.getElementById('scroll-right') as HTMLButtonElement | null;

        if (testimonialContainer && scrollLeftBtn && scrollRightBtn) {
            const scrollStep = (): number => {
                const card = testimonialContainer.querySelector('.testimonial-card') as HTMLDivElement | null;
                if (!card) return 300;
                const cardStyle = window.getComputedStyle(card);
                const cardWidth = card.offsetWidth;
                const cardMarginRight = parseInt(cardStyle.marginRight, 10);
                return cardWidth + cardMarginRight;
            };

            scrollRightBtn.addEventListener('click', () => {
                testimonialContainer.scrollBy({ left: scrollStep(), behavior: 'smooth' });
            });

            scrollLeftBtn.addEventListener('click', () => {
                testimonialContainer.scrollBy({ left: -scrollStep(), behavior: 'smooth' });
            });
        }
    };

    // --- INITIALIZATION ---
    await loadTestimonials();
    await loadBlogPosts();
    await loadFaqs();
});
