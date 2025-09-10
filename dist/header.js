// src/header.ts
/**
 * Header component with consistent styling and responsive menu.
 */
var Header = /** @class */ (function () {
    function Header() {
        /**
         * The HTML string for the header element.
         */
        this.headerHTML = "\n        <div class=\"scroll-progress\"></div>\n        <nav class=\"navbar\">\n            <div class=\"nav-container\">\n                <a href=\"#home\" class=\"logo\">Terra Mater</a>\n                <button role=\"button\" title=\"Menu Button\" aria-label=\"Menu Button\" id=\"hamburger-button\" class=\"hamburger hamburger--spin\" type=\"button\" alt=\"Menu\">\n                    <span class=\"hamburger-box\">\n                        <span class=\"hamburger-inner\"></span>\n                    </span>\n                </button>\n                <ul class=\"nav-menu\">\n                    <li><a href=\"#home\" class=\"nav-link\">Home</a></li>\n                    <li><a href=\"#about\" class=\"nav-link\">About</a></li>\n                    <li><a href=\"#services\" class=\"nav-link\">Services</a></li>\n                    <li><a href=\"#contact\" class=\"nav-link\">Contact</a></li>\n                    <li><a href=\"/admin\" class=\"nav-link\">Admin</a></li>\n                </ul>\n            </div>\n        </nav>\n    ";
        this.init();
    }
    /**
     * Initializes the header component.
     */
    Header.prototype.init = function () {
        this.appendHeader();
        this.setupEventListeners();
        this.handleScroll();
    };
    /**
     * Appends the header HTML to the body of the document.
     */
    Header.prototype.appendHeader = function () {
        document.body.insertAdjacentHTML('afterbegin', this.headerHTML);
    };
    /**
     * Sets up event listeners for the hamburger menu and nav links.
     */
    Header.prototype.setupEventListeners = function () {
        var hamburgerButton = document.getElementById('hamburger-button');
        var navMenu = document.querySelector('.nav-menu');
        if (hamburgerButton && navMenu) {
            hamburgerButton.addEventListener('click', function () {
                hamburgerButton.classList.toggle('is-active');
                navMenu.classList.toggle('active');
                document.body.classList.toggle('no-scroll');
            });
            navMenu.querySelectorAll('.nav-link').forEach(function (link) {
                link.addEventListener('click', function () {
                    hamburgerButton.classList.remove('is-active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                });
            });
        }
    };
    /**
     * Handles the scroll event to change the navbar's appearance and update the scroll progress bar.
     */
    Header.prototype.handleScroll = function () {
        var navbar = document.querySelector('.navbar');
        var scrollProgress = document.querySelector('.scroll-progress');
        if (navbar) {
            var navHeight_1 = navbar.offsetHeight;
            window.addEventListener('scroll', function () {
                if (window.scrollY > navHeight_1) {
                    navbar.classList.add('scrolled');
                }
                else {
                    navbar.classList.remove('scrolled');
                }
                if (scrollProgress) {
                    var totalHeight = document.body.scrollHeight - window.innerHeight;
                    var scrollPosition = window.scrollY;
                    var progress = (scrollPosition / totalHeight) * 100;
                    scrollProgress.style.width = progress + '%';
                }
            });
        }
    };
    return Header;
}());
export { Header };
