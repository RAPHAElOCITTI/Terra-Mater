// src/header.ts

/**
 * Header component with consistent styling and responsive menu.
 */
export class Header {
    /**
     * The HTML string for the header element.
     */
    private headerHTML: string = `
        <div class="scroll-progress"></div>
        <nav class="navbar">
            <div class="nav-container">
                <a href="#home" class="logo">Terra Mater</a>
                <button role="button" title="Menu Button" aria-label="Menu Button" id="hamburger-button" class="hamburger hamburger--spin" type="button" alt="Menu">
                    <span class="hamburger-box">
                        <span class="hamburger-inner"></span>
                    </span>
                </button>
                <ul class="nav-menu">
                    <li><a href="#home" class="nav-link">Home</a></li>
                    <li><a href="#about" class="nav-link">About</a></li>
                    <li><a href="#services" class="nav-link">Services</a></li>
                    <li><a href="#contact" class="nav-link">Contact</a></li>
                    <li><a href="/admin" class="nav-link">Admin</a></li>
                </ul>
            </div>
        </nav>
    `;

    constructor() {
        this.init();
    }

    /**
     * Initializes the header component.
     */
    public init(): void {
        this.appendHeader();
        this.setupEventListeners();
        this.handleScroll();
    }

    /**
     * Appends the header HTML to the body of the document.
     */
    private appendHeader(): void {
        document.body.insertAdjacentHTML('afterbegin', this.headerHTML);
    }

    /**
     * Sets up event listeners for the hamburger menu and nav links.
     */
    private setupEventListeners(): void {
        const hamburgerButton = document.getElementById('hamburger-button') as HTMLButtonElement | null;
        const navMenu = document.querySelector('.nav-menu') as HTMLUListElement | null;

        if (hamburgerButton && navMenu) {
            hamburgerButton.addEventListener('click', () => {
                hamburgerButton.classList.toggle('is-active');
                navMenu.classList.toggle('active');
                document.body.classList.toggle('no-scroll');
            });

            navMenu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburgerButton.classList.remove('is-active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                });
            });
        }
    }

    /**
     * Handles the scroll event to change the navbar's appearance and update the scroll progress bar.
     */
    private handleScroll(): void {
        const navbar = document.querySelector('.navbar') as HTMLElement | null;
        const scrollProgress = document.querySelector('.scroll-progress') as HTMLElement | null;

        if (navbar) {
            const navHeight = navbar.offsetHeight;

            window.addEventListener('scroll', () => {
                if (window.scrollY > navHeight) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }

                if (scrollProgress) {
                    const totalHeight = document.body.scrollHeight - window.innerHeight;
                    const scrollPosition = window.scrollY;
                    const progress = (scrollPosition / totalHeight) * 100;
                    scrollProgress.style.width = progress + '%';
                }
            });
        }
    }
}
