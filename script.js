// Welcome Animation Controller
class WelcomeAnimationController {
    constructor() {
        this.welcomeOverlay = document.getElementById('welcome-overlay');
        this.navbar = document.querySelector('.navbar');
        this.hero = document.querySelector('.hero');
        this.sections = document.querySelectorAll('section');
        this.typedTextElement = document.querySelector('.typed-text');

        this.typingTexts = [
            "Computer Science Graduate",
            "Data Science Enthusiast",
            "Software Developer",
            "Machine Learning Engineer",
            "Problem Solver"
        ];

        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;

        this.init();
    }

    init() {
        this.showWelcomeOverlay();

        // Start typing animation after short delay
        setTimeout(() => {
            this.startTypingAnimation();
        }, 2000);

        // Hide overlay and reveal content after full welcome sequence
        setTimeout(() => {
            this.hideWelcomeOverlay();
        }, 6000);
    }

    showWelcomeOverlay() {
        if (this.welcomeOverlay) {
            this.welcomeOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    hideWelcomeOverlay() {
        if (this.welcomeOverlay) {
            this.welcomeOverlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
            setTimeout(() => {
                this.showMainContent();
            }, 500);
        }
    }

    showMainContent() {
        if (this.navbar) this.navbar.classList.add('show');
        if (this.hero) {
            setTimeout(() => this.hero.classList.add('show'), 300);
        }

        this.sections.forEach((section, index) => {
            if (section.id !== 'home') {
                setTimeout(() => section.classList.add('show'), 600 + index * 200);
            }
        });
    }

    startTypingAnimation() {
        this.typeText();
    }

    typeText() {
        const currentText = this.typingTexts[this.currentTextIndex];
        const element = this.typedTextElement;

        if (!element) return;

        if (this.isDeleting) {
            element.textContent = currentText.substring(0, --this.currentCharIndex);
        } else {
            element.textContent = currentText.substring(0, ++this.currentCharIndex);
        }

        let typeSpeed = this.isDeleting ? 50 : 100;

        if (!this.isDeleting && this.currentCharIndex === currentText.length) {
            this.isDeleting = true;
            typeSpeed = 1500;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.typingTexts.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.typeText(), typeSpeed);
    }
}

// Mobile Navigation Toggle
document.getElementById('nav-toggle')?.addEventListener('click', () => {
    document.getElementById('nav-menu')?.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('nav-menu')?.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Active link highlight
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';

    sections.forEach(section => {
        const top = section.offsetTop - 200;
        if (scrollY >= top) current = section.id;
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Contact Form with EmailJS
class ContactFormHandler {
    constructor() {
        this.form = document.getElementById('contact-form');
        if (!this.form) return;

        this.submitBtn = this.form.querySelector('.submit-btn');
        this.originalBtnContent = this.submitBtn.innerHTML;
        this.isSubmitting = false;

        this.emailjsConfig = {
            serviceId: 'service_d1vkzzr',
            templateId: 'template_4cfdtfr',
            publicKey: 'bJBhsfDvX4Ksk07DZ'
        };

        this.init();
    }

    init() {
        this.form.addEventListener('submit', e => this.handleSubmit(e));
        this.addInputValidation();
        this.loadEmailJS();
    }

    loadEmailJS() {
        if (!window.emailjs) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
            script.onload = () => emailjs.init(this.emailjsConfig.publicKey);
            document.head.appendChild(script);
        } else {
            emailjs.init(this.emailjsConfig.publicKey);
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        if (this.isSubmitting) return;

        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        if (!this.validateForm(data)) {
            this.showMessage('Please fill in all required fields correctly.', 'error');
            return;
        }

        this.setSubmittingState(true);

        try {
            const result = await emailjs.sendForm(
                this.emailjsConfig.serviceId,
                this.emailjsConfig.templateId,
                this.form,
                this.emailjsConfig.publicKey
            );

            this.showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
            this.form.reset();

        } catch (error) {
            this.showMessage('EmailJS failed, opening email client as backup...', 'info');
            setTimeout(() => this.handleMailtoFallback(data), 1000);
        } finally {
            this.setSubmittingState(false);
        }
    }

    handleMailtoFallback(data) {
        const mailto = `mailto:sameershaik1301@gmail.com?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`)}`;
        window.location.href = mailto;
    }

    validateForm(data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return data.name?.trim() &&
            emailRegex.test(data.email) &&
            data.subject?.trim() &&
            data.message?.trim();
    }

    setSubmittingState(state) {
        this.isSubmitting = state;
        this.submitBtn.disabled = state;
        this.submitBtn.innerHTML = state
            ? `<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>`
            : this.originalBtnContent;
    }

    showMessage(message, type) {
        this.form.querySelector('.form-message')?.remove();

        const msgDiv = document.createElement('div');
        msgDiv.className = `form-message form-message-${type}`;
        msgDiv.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i> <span>${message}</span>`;
        this.form.insertBefore(msgDiv, this.submitBtn);

        setTimeout(() => msgDiv.remove(), 5000);
    }

    addInputValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateInput(input));
            input.addEventListener('input', () => input.classList.remove('error'));
        });
    }

    validateInput(input) {
        const value = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const valid = input.type === 'email' ? emailRegex.test(value) : !!value;

        input.classList.toggle('error', !valid);
        return valid;
    }
}

// Intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Animate these elements when they enter view
document.querySelectorAll('.skill-category, .project-card, .timeline-item, .cert-card').forEach(el => {
    observer.observe(el);
});

// Project card hover
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-10px) scale(1.02)');
    card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0) scale(1)');
});

// Skill hover
document.querySelectorAll('.skill-category').forEach(skill => {
    skill.addEventListener('mouseenter', () => skill.style.transform = 'translateY(-10px) rotate(2deg)');
    skill.addEventListener('mouseleave', () => skill.style.transform = 'translateY(0) rotate(0deg)');
});

// Initialize after DOM loads
document.addEventListener('DOMContentLoaded', () => {
    new WelcomeAnimationController();
    new ContactFormHandler();
    console.log('Portfolio loaded!');
});

// Add custom nav styles dynamically
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: #2563eb !important;
    }
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(style);