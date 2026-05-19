document.addEventListener("DOMContentLoaded", () => {
    // Scroll Progress Bar
    const progressBar = document.querySelector(".scroll-progress");
    window.addEventListener("scroll", () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = scrollPercent + "%";
    });

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

    // Active Navigation Link Highlighting
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-links a");

    window.addEventListener("scroll", () => {
        let current = "";
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
        const text1 = "Hello I am";
        const roles = [" Henok Gizaw"," Backend Engineer", " Embedded Systems Engineer"];
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
        
        // Start typing after a short delay
        setTimeout(typeWriter, 500);
    }
});
