document.addEventListener('DOMContentLoaded', () => {
    // Scroll Reveal Intersection Observer
    const revealTargets = document.querySelectorAll('.benefits-grid, .how-it-works, .details-grid, .chart-container-block, .data-metric, .data-table');
    
    revealTargets.forEach(target => {
        target.style.opacity = '0';
        target.style.transform = 'translateY(20px)';
        target.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
    });

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.15
    });

    revealTargets.forEach(target => revealObserver.observe(target));

    // --- GENERIC FULLSCREEN MORPH ENGINE ---
    const morphTriggers = document.querySelectorAll('[data-target-view]');
    const circularBackBtns = document.querySelectorAll('.btn-circular-back');

    morphTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetViewId = trigger.getAttribute('data-target-view');
            const targetFullscreenView = document.getElementById(targetViewId);

            if (targetFullscreenView) {
                // Read input device pointer event locations to center origin coordinates
                const touchX = e.clientX || window.innerWidth / 2;
                const touchY = e.clientY || window.innerHeight / 2;

                targetFullscreenView.style.transformOrigin = `${touchX}px ${touchY}px`;
                
                // Absolute structural layout constraint lock to fix background movement leaks
                document.body.style.width = '100vw';
                document.body.style.height = '100vh';
                document.body.style.overflow = 'hidden';
                
                targetFullscreenView.classList.add('is-expanded');
            }
        });
    });

    // --- REVERSE ACTION SHRINK ENGINE ---
    circularBackBtns.forEach(button => {
        button.addEventListener('click', () => {
            const activeOverlayView = button.closest('.page-view-overlay');
            if (activeOverlayView) {
                activeOverlayView.classList.remove('is-expanded');
                
                // Clear hardware locks smoothly after animation finishes transition cycles
                setTimeout(() => {
                    document.body.style.width = '';
                    document.body.style.height = '';
                    document.body.style.overflow = 'auto';
                }, 600); // Transitions synchronization window parameter
            }
        });
    });
});
