document.addEventListener('DOMContentLoaded', () => {
    setupScroll();
});

/* Scroll Animations & Header Control */
function setupScroll() {
    const header = document.querySelector('.site-header');
    const reveals = document.querySelectorAll('.reveal');

    window.addEventListener('scroll', () => {
        // Header styling (transparent to solid)
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Reveal elements on scroll
        reveals.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementTop < windowHeight * 0.85) {
                el.classList.add('active');
            }
        });
    });
    
    // Trigger once on load to catch elements already in view
    window.dispatchEvent(new Event('scroll'));
}

/* Mobile Menu Toggle */
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    const toggle = document.querySelector('.nav-toggle');
    
    if (menu && toggle) {
        menu.classList.toggle('active');
        toggle.classList.toggle('active');
    }
}

/* News Modal Control */
function openModal(title, date, content) {
    const modalBody = document.getElementById('modalBody');
    const modal = document.getElementById('newsModal');
    
    if (modalBody && modal) {
        modalBody.innerHTML = `
            <p style="color:var(--text-muted); margin-bottom:16px; font-family:var(--font-display);">${date}</p>
            <h3 style="font-family:var(--font-serif); font-size:24px; margin-bottom:32px;">${title}</h3>
            <div style="line-height:2;">${content}</div>
        `;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeModal() {
    const modal = document.getElementById('newsModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Close modal when clicking outside content
document.addEventListener('click', (e) => {
    const modal = document.getElementById('newsModal');
    if (e.target === modal) {
        closeModal();
    }
});