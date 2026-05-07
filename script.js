document.addEventListener('DOMContentLoaded', () => {
    // Carousel Logic
    const track = document.querySelector('.carousel-track');
    const items = document.querySelectorAll('.carousel-item');
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');

    let currentIndex = 0;

    function updateCarousel() {
        const itemWidth = items[0].getBoundingClientRect().width;
        track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    }

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();
    });

    // Auto-resize carousel on window resize
    window.addEventListener('resize', updateCarousel);

    // FAQ Logic
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');

        question.addEventListener('click', () => {
            const isOpen = answer.style.display === 'block';

            // Close all other FAQs
            faqItems.forEach(i => {
                i.querySelector('.faq-answer').style.display = 'none';
                i.querySelector('i').className = 'fas fa-plus';
            });

            if (!isOpen) {
                answer.style.display = 'block';
                icon.className = 'fas fa-minus';
            }
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    // Countdown Timer Logic
    function startTimer(duration) {
        let timer = duration, hours, minutes, seconds;
        const displayHours = document.querySelectorAll('.timer-unit span')[0];
        const displayMinutes = document.querySelectorAll('.timer-unit span')[1];
        const displaySeconds = document.querySelectorAll('.timer-unit span')[2];

        setInterval(function () {
            hours = parseInt(timer / 3600, 10);
            minutes = parseInt((timer % 3600) / 60, 10);
            seconds = parseInt(timer % 60, 10);

            displayHours.textContent = hours < 10 ? "0" + hours : hours;
            displayMinutes.textContent = minutes < 10 ? "0" + minutes : minutes;
            displaySeconds.textContent = seconds < 10 ? "0" + seconds : seconds;

            if (--timer < 0) {
                timer = duration;
            }
        }, 1000);
    }

    // Start a 2.5-hour countdown (in seconds)
    startTimer((2 * 60 * 60) + (30 * 60));

    // Tracking Logic
    function trackInitiateCheckout(planName) {
        if (typeof fbq !== 'undefined') {
            fbq('track', 'InitiateCheckout', {
                content_name: planName,
                currency: 'BRL'
            });
        }
        // UTMify usually tracks clicks automatically via URL decoration, 
        // but explicit events can be added here if needed.
    }

    // Attach tracking to buttons
    document.querySelectorAll('.track-checkout-premium').forEach(btn => {
        btn.addEventListener('click', () => trackInitiateCheckout('Plano Premium'));
    });

    document.querySelectorAll('.track-checkout-basic').forEach(btn => {
        btn.addEventListener('click', () => trackInitiateCheckout('Plano Básico'));
    });

    document.querySelectorAll('.track-checkout-upsell').forEach(btn => {
        btn.addEventListener('click', () => trackInitiateCheckout('Upsell Premium'));
    });

    // UTM Passing Logic for zuckpay.com.br
    function decorateLinks() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.toString()) {
            const checkoutLinks = document.querySelectorAll('a[href*="zuckpay.com.br"]');
            checkoutLinks.forEach(link => {
                try {
                    const url = new URL(link.href);
                    urlParams.forEach((value, key) => {
                        url.searchParams.set(key, value);
                    });
                    link.href = url.toString();
                } catch (e) {
                    console.error('Error decorating link:', e);
                }
            });
        }
    }

    // Run decoration immediately and also after a short delay to catch any dynamic links
    decorateLinks();
    setTimeout(decorateLinks, 1000);

    // Upsell Pop-up Logic
    const basicBtn = document.getElementById('basic-plan-btn');
    const popup = document.getElementById('upsell-popup');
    const noThanksBtn = document.querySelector('.btn-no-thanks');
    const acceptUpsellBtn = document.querySelector('.upsell-actions .btn-primary-v2');

    if (basicBtn && popup) {
        basicBtn.addEventListener('click', (e) => {
            e.preventDefault();
            trackInitiateCheckout('Click Básico (Abre Popup)');
            popup.style.display = 'flex';
        });

        if (noThanksBtn) {
            noThanksBtn.addEventListener('click', (e) => {
                // popup stays open or closes, link handles redirection
                // We already have track-checkout-basic class on this link
            });
        }

        if (acceptUpsellBtn) {
            acceptUpsellBtn.addEventListener('click', (e) => {
                // Already handled by track-checkout-upsell class
            });
        }

        // Close popup when clicking outside
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.style.display = 'none';
            }
        });
    }

});
