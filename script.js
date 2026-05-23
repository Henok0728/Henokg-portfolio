document.addEventListener("DOMContentLoaded", () => {
    // Preloader Promise / Waiting Time
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Create a Promise that resolves after a 2-second waiting time
        const waitingTime = new Promise(resolve => setTimeout(resolve, 2000));
        
        waitingTime.then(() => {
            // Add fade-out class to trigger CSS transition
            preloader.classList.add('fade-out');
            
            // Remove preloader from DOM after transition (600ms)
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600);
        });
    }

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                // Optional: Stop observing once it has become visible
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    // Profile Morph Logic
    let isMorphed = false;
    const profilePic = document.getElementById('profile-pic');
    const heroSlot = document.getElementById('hero-profile-slot');
    const navSlot = document.getElementById('nav-profile-slot');

    function morphProfile(toNav) {
        if (!profilePic || !heroSlot || !navSlot || toNav === isMorphed) return;
        
        // 1. First: Get initial bounds
        const first = profilePic.getBoundingClientRect();
        
        // 2. Last: Move element to new container and get new bounds
        if (toNav) {
            navSlot.appendChild(profilePic);
            profilePic.classList.add('morphed');
        } else {
            heroSlot.appendChild(profilePic);
            profilePic.classList.remove('morphed');
        }
        isMorphed = toNav;
        
        const last = profilePic.getBoundingClientRect();
        
        // 3. Invert: Calculate deltas
        const deltaX = first.left - last.left;
        const deltaY = first.top - last.top;
        const deltaW = first.width / last.width;
        const deltaH = first.height / last.height;
        
        // 4. Play: Animate from the inverted position to 0
        profilePic.animate([
            { transformOrigin: 'top left', transform: `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})` },
            { transformOrigin: 'top left', transform: 'none' }
        ], {
            duration: 600,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fill: 'both'
        });
    }

    // Active Navigation Link Highlighting
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-links a");

    window.addEventListener("scroll", () => {
        let current = "home";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").includes(current)) {
                link.classList.add("active");
            }
        });

        // Trigger morph based on active section
        morphProfile(current !== "home");
    });

    // 3D Tilt Effect on Project Cards (Vanilla JS)
    const cards = document.querySelectorAll(".project-card");
    
    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5; // max 5 deg
            const rotateY = ((x - centerX) / centerX) * 5;  // max 5 deg
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'none'; // remove transition for smooth tracking
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s ease'; // restore transition
        });
        
        card.addEventListener("mouseenter", () => {
            card.style.transition = 'none'; // prepare for tracking
        });
    });

    // Typing Effect for Headline
    const headline = document.querySelector('.headline');
    if (headline) {
        // Clear initial content to start typing
        headline.innerHTML = '';
        const text1 = "Hi, I am ";
        const roles = [" Backend Developer"," Embedded Systems Developer"];
        let roleIndex = 0;
        
        let i = 0;
        let isDeleting = false;
        let spanElement = null;
        let state = 0; // 0: type intro, 1: type/delete role, 2: type/delete dot, 3: wait

        function typeWriter() {
            if (state === 0) {
                if (i < text1.length) {
                    headline.appendChild(document.createTextNode(text1.charAt(i)));
                    i++;
                    setTimeout(typeWriter, 60);
                } else {
                    state = 1;
                    i = 0;
                    spanElement = document.createElement('span');
                    spanElement.className = 'accent-text';
                    headline.appendChild(spanElement);
                    setTimeout(typeWriter, 60);
                }
            } else if (state === 1) {
                const currentRole = roles[roleIndex];
                if (!isDeleting) {
                    if (i < currentRole.length) {
                        spanElement.appendChild(document.createTextNode(currentRole.charAt(i)));
                        i++;
                        setTimeout(typeWriter, 60);
                    } else {
                        state = 2;
                        i = 0;
                        setTimeout(typeWriter, 60);
                    }
                } else {
                    if (i > 0) {
                        spanElement.innerHTML = currentRole.substring(0, i - 1);
                        i--;
                        setTimeout(typeWriter, 30); // delete faster
                    } else {
                        isDeleting = false;
                        roleIndex = (roleIndex + 1) % roles.length;
                        setTimeout(typeWriter, 400); // pause before typing new role
                    }
                }
            } else if (state === 2) {
                if (!isDeleting) {
                    headline.appendChild(document.createTextNode("."));
                    state = 3;
                    setTimeout(typeWriter, 2500); // wait 2.5s before deleting
                } else {
                    headline.removeChild(headline.lastChild); // remove dot
                    state = 1;
                    i = roles[roleIndex].length;
                    setTimeout(typeWriter, 30);
                }
            } else if (state === 3) {
                isDeleting = true;
                state = 2;
                setTimeout(typeWriter, 30);
            }
        }
        
        setTimeout(typeWriter, 500);
    }

    // Contact Form Submission Handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            // Give visual feedback
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const formspreeEndpoint = "https://formspree.io/f/xykvppky";
            
            const formData = new FormData(contactForm);

            try {
                const response = await fetch(formspreeEndpoint, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    submitBtn.textContent = 'Message Sent!';
                    submitBtn.style.backgroundColor = '#10b981'; // Green success color
                    submitBtn.style.color = '#fff';
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (data.errors && data.errors.length > 0) {
                        submitBtn.textContent = data.errors[0].message;
                    } else if (formspreeEndpoint.includes('YOUR_FORMSPREE_ID')) {
                        submitBtn.textContent = 'Setup Required';
                        console.log("Please replace 'YOUR_FORMSPREE_ID' with your actual Formspree ID.");
                    } else {
                        submitBtn.textContent = 'Error Sending';
                    }
                    submitBtn.style.backgroundColor = '#f59e0b'; // Orange warning color
                }
            } catch (error) {
                submitBtn.textContent = 'Network Error';
                submitBtn.style.backgroundColor = '#ef4444'; // Red error color
            }

            // Reset button state after 3 seconds
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.backgroundColor = '';
                submitBtn.style.color = '';
                submitBtn.disabled = false;
            }, 3000);
        });
    }
});
