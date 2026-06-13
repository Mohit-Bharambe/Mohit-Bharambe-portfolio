document.addEventListener('DOMContentLoaded', () => {

    // Initialize EmailJS
    // IMPORTANT: Replace with your actual keys
    // emailjs.init("YOUR_PUBLIC_KEY");

    // 1. Initialize AOS (Animate On Scroll)
    // We'll use AOS for simple section fades
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50
    });

    // 2. GSAP Animations
    // Check if GSAP is loaded
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {

        gsap.registerPlugin(ScrollTrigger);

        // Hero Section Animation
        const heroTl = gsap.timeline();
        heroTl.from('.hero-anim', {
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            clearProps: 'all' // Clear props after animation to prevent conflicts
        });

        // Skills Grid Animation (Using Batch for better grid handling)
        // First, set initial state
        gsap.set('.skill-anim', { y: 50, opacity: 0 });

        ScrollTrigger.batch('.skill-anim', {
            start: 'top 90%',
            onEnter: batch => gsap.to(batch, {
                opacity: 1,
                y: 0,
                stagger: 0.15,
                duration: 0.8,
                ease: 'back.out(1.7)',
                overwrite: true
            }),
            // Ensure they are visible if we scroll back up/down (optional, but good for debugging)
            // onLeave: batch => gsap.set(batch, {opacity: 0, y: -50}), 
            // onEnterBack: batch => gsap.to(batch, {opacity: 1, y: 0, stagger: 0.15}),
            // onLeaveBack: batch => gsap.set(batch, {opacity: 0, y: 50})
        });

        // Projects Grid Animation
        gsap.set('.project-anim', { y: 50, opacity: 0 });

        ScrollTrigger.batch('.project-anim', {
            start: 'top 85%',
            onEnter: batch => gsap.to(batch, {
                opacity: 1,
                y: 0,
                stagger: 0.2,
                duration: 0.8,
                ease: 'power2.out',
                overwrite: true
            })
        });

        // Refresh ScrollTrigger to ensure positions are correct
        ScrollTrigger.refresh();

    } else {
        console.warn('GSAP not loaded. Fallback to CSS.');
        // Fallback: Ensure elements are visible if GSAP fails
        document.querySelectorAll('.skill-anim, .project-anim, .hero-anim').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }

    // 3. Typing Effect
    const typingText = document.querySelector('.typing-text');
    const phrases = [
    "Full Stack Developer",
    "React Developer",
    "Django Developer",
    "Python Backend Developer",
    "Web Developer",
    "JavaScript Developer",
    "UI Engineer",
    "Software Developer"
];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        if (!typingText) return;

        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typingText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typingText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(type, typeSpeed);
    }

    if (typingText) {
        type();
    }

    // 4. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(5, 5, 5, 0.95)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(5, 5, 5, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });

    // 5. Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'var(--bg-secondary)';
                navLinks.style.padding = '2rem';
                navLinks.style.borderBottom = '1px solid var(--border-color)';
            }
        });
    }

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                if (window.innerWidth <= 768 && navLinks) {
                    navLinks.style.display = 'none';
                }
            }
        });
    });

    // 6. Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (!name || !email || !message) {
                formStatus.textContent = 'Please fill in all fields.';
                formStatus.className = 'form-status error';
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            setTimeout(() => {
                formStatus.textContent = 'Message sent successfully! (Demo Mode)';
                formStatus.className = 'form-status success';
                contactForm.reset();
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

});
