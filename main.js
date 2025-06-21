document.addEventListener('DOMContentLoaded', function() {
            const API_URL = '/api'; // Replace with your actual backend URL

            // --- TESTIMONIALS ---
            function loadTestimonials() {
                fetch(`${API_URL}/testimonials`)
                    .then(response => {
                        if (!response.ok) throw new Error('Network response was not ok');
                        return response.json();
                    })
                    .then(testimonials => {
                        const container = document.getElementById('testimonial-container');
                        if (!container) return;
                        container.innerHTML = testimonials.map(testimonial => `
                            <div class="testimonial-card">
                                <p class="testimonial-quote">${testimonial.quote}</p>
                                <p class="testimonial-author">- ${testimonial.author}</p>
                            </div>
                        `).join('');
                    }).catch(error => {
                        console.error('Error loading testimonials:', error);
                        const container = document.getElementById('testimonial-container');
                        if(container) container.innerHTML = "<p>Could not load testimonials.</p>";
                    });
            }

            // --- BLOGS ---
            function loadBlogPosts() {
                fetch(`${API_URL}/blogs`)
                    .then(response => {
                         if (!response.ok) throw new Error('Network response was not ok');
                        return response.json();
                    })
                    .then(posts => {
                        const container = document.getElementById('blog-container');
                         if (!container) return;
                        container.innerHTML = posts.map(post => `
                            <div class="blog-post-card">
                                <h3>${post.title}</h3>
                                <p class="blog-excerpt">${post.content.substring(0, 150)}...</p>
                                <a href="#" class="read-more-link">Read More</a>
                            </div>
                        `).join('');
                    }).catch(error => {
                        console.error('Error loading blog posts:', error);
                        const container = document.getElementById('blog-container');
                        if(container) container.innerHTML = "<p>Could not load blog posts.</p>";
                    });
            }

            // --- FAQs ---
            function loadFaqs() {
                fetch(`${API_URL}/faqs`)
                    .then(response => {
                        if (!response.ok) throw new Error('Network response was not ok');
                        return response.json();
                    })
                    .then(faqs => {
                        const container = document.getElementById('faq-container');
                        if (!container) return;
                        container.innerHTML = faqs.map(faq => `
                            <div class="faq-item">
                                <h4>${faq.question}</h4>
                                <p>${faq.answer}</p>
                            </div>
                        `).join('');

                        // Add event listeners AFTER content is loaded
                        addFaqEventListeners();
                    }).catch(error => {
                        console.error('Error loading FAQs:', error);
                         const container = document.getElementById('faq-container');
                        if(container) container.innerHTML = "<p>Could not load FAQs.</p>";
                    });
            }

            // Function to add click events to all FAQ items
            function addFaqEventListeners() {
                const faqContainer = document.getElementById('faq-container');
                 if (!faqContainer) return;
                const faqItems = faqContainer.querySelectorAll('.faq-item');

                faqItems.forEach(item => {
                    item.addEventListener('click', () => {
                        const isActive = item.classList.contains('active');
                        // Optional: Accordion behavior (close all others)
                        faqItems.forEach(otherItem => {
                            otherItem.classList.remove('active');
                        });
                        // Toggle active class on the clicked item
                        if (!isActive) {
                            item.classList.add('active');
                        }
                    });
                });
            }
            
            // --- INITIALIZE INTERACTIVITY ---
            
            // This logic is for the static scroll buttons
            function initializeTestimonialSlider() {
                const testimonialContainer = document.getElementById('testimonial-container');
                const scrollLeftBtn = document.getElementById('scroll-left');
                const scrollRightBtn = document.getElementById('scroll-right');

                if (testimonialContainer && scrollLeftBtn && scrollRightBtn) {
                    const scrollStep = () => {
                        const card = testimonialContainer.querySelector('.testimonial-card');
                        if (!card) return 300; // Fallback scroll value
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
            }

            // --- LOAD ALL CONTENT & INITIALIZE ---
            loadTestimonials();
            loadBlogPosts();
            loadFaqs();
            initializeTestimonialSlider();
        });
