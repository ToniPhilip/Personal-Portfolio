```javascript
/* =====================================================
   TONI PHILIP PORTFOLIO
   Shared JavaScript for index.html
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    // 1. AUTOMATIC FOOTER YEAR
    // Updates the copyright year automatically.
    const yearElements = document.querySelectorAll(".current-year");

    yearElements.forEach(function (element) {
        element.textContent = new Date().getFullYear();
    });


    // 2. NAVBAR SCROLL EFFECT
    // Adds a shadow when the visitor scrolls down.
    const navbar = document.querySelector(".custom-navbar");

    function updateNavbar() {
        if (!navbar) return;

        if (window.scrollY > 40) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", updateNavbar, {
        passive: true
    });

    updateNavbar();


    // 3. ACTIVE NAVIGATION LINK
    // Highlights the link matching the current HTML page.
    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    const navLinks = document.querySelectorAll(
        ".custom-navbar .nav-link"
    );

    navLinks.forEach(function (link) {
        const linkPage = link.getAttribute("href");

        if (!linkPage || linkPage.startsWith("#")) {
            return;
        }

        const normalizedLink = linkPage
            .split("/")
            .pop()
            .toLowerCase();

        const isCurrentPage =
            normalizedLink === currentPage ||
            (currentPage === "" && normalizedLink === "index.html");

        link.classList.toggle("active", isCurrentPage);

        if (isCurrentPage) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });


    // 4. MOBILE NAVBAR
    // Closes the Bootstrap mobile menu after a navigation link
    // is selected. Bootstrap's bundle must be loaded in the HTML.
    const mobileMenu = document.querySelector("#mainNavbar");

    if (mobileMenu && window.bootstrap) {
        navLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                if (
                    mobileMenu.classList.contains("show") &&
                    window.innerWidth < 992
                ) {
                    const collapseInstance =
                        window.bootstrap.Collapse.getOrCreateInstance(
                            mobileMenu
                        );

                    collapseInstance.hide();
                }
            });
        });
    }


    // 5. SMOOTH SCROLLING
    // Smoothly moves to sections linked with #section-id.
    // Links to other HTML pages are left unchanged.
    const internalLinks = document.querySelectorAll(
        'a[href^="#"]'
    );

    internalLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches ? "auto" : "smooth",
                    block: "start"
                });
            }
        });
    });


    // 6. SCROLL REVEAL ANIMATIONS
    // Reveals sections and cards as they enter the viewport.
    const revealElements = document.querySelectorAll(
        ".section-heading, .info-card, .skill-card, " +
        ".project-card, .cta-section"
    );

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
        "IntersectionObserver" in window &&
        !reducedMotion
    ) {
        revealElements.forEach(function (element) {
            element.classList.add("reveal");
        });

        const revealObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -30px 0px"
            }
        );

        revealElements.forEach(function (element) {
            revealObserver.observe(element);
        });
    }


    // 7. BACK-TO-TOP BUTTON
    // Creates a floating button when the page scrolls down.
    let backToTop = document.querySelector(".back-to-top");

    if (!backToTop) {
        backToTop = document.createElement("button");
        backToTop.type = "button";
        backToTop.className = "back-to-top";
        backToTop.setAttribute("aria-label", "Back to top");
        backToTop.setAttribute("title", "Back to top");
        backToTop.innerHTML = '<i class="bi bi-arrow-up"></i>';

        document.body.appendChild(backToTop);
    }

    function updateBackToTop() {
        backToTop.classList.toggle(
            "show",
            window.scrollY > 350
        );
    }

    window.addEventListener("scroll", updateBackToTop, {
        passive: true
    });

    updateBackToTop();

    backToTop.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: reducedMotion ? "auto" : "smooth"
        });
    });


    // 8. ANIMATED SKILL PROGRESS BARS
    // Used on the Skills page if progress bars are present.
    const progressBars = document.querySelectorAll(
        ".skill-progress"
    );

    if (progressBars.length > 0) {
        const progressObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;

                    const bar = entry.target;
                    const requestedWidth = parseFloat(
                        bar.dataset.progress || "0"
                    );

                    const safeWidth = Math.min(
                        100,
                        Math.max(0, requestedWidth)
                    );

                    bar.style.width = safeWidth + "%";
                    observer.unobserve(bar);
                });
            },
            {
                threshold: 0.25
            }
        );

        progressBars.forEach(function (bar) {
            bar.style.width = "0%";
            progressObserver.observe(bar);
        });
    }


    // 9. PROJECT CATEGORY FILTERS
    // Used on the Projects page if filter buttons are present.
    const filterButtons = document.querySelectorAll(
        "[data-filter]"
    );

    const projectItems = document.querySelectorAll(
        "[data-category]"
    );

    if (filterButtons.length > 0 && projectItems.length > 0) {
        filterButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                const selectedFilter =
                    button.dataset.filter.toLowerCase();

                filterButtons.forEach(function (item) {
                    const isActive = item === button;

                    item.classList.toggle("active", isActive);
                    item.setAttribute(
                        "aria-pressed",
                        String(isActive)
                    );
                });

                projectItems.forEach(function (project) {
                    const categories = (
                        project.dataset.category || ""
                    )
                        .toLowerCase()
                        .split(/\s+/);

                    const shouldShow =
                        selectedFilter === "all" ||
                        categories.includes(selectedFilter);

                    project.hidden = !shouldShow;
                });
            });
        });
    }


    // 10. CONTACT FORM VALIDATION
    // Checks required fields and email formatting.
    // This does not send an email without a backend or form service.
    const contactForm = document.querySelector("#contactForm");

    if (contactForm) {
        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        let feedback = contactForm.querySelector(
            ".form-feedback"
        );

        if (!feedback) {
            feedback = document.createElement("div");
            feedback.className = "form-feedback mt-3";
            feedback.setAttribute("role", "status");
            feedback.setAttribute("aria-live", "polite");
            contactForm.appendChild(feedback);
        }

        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            feedback.textContent = "";
            feedback.className = "form-feedback mt-3";

            const fields = contactForm.querySelectorAll(
                "input[required], textarea[required], select[required]"
            );

            let firstInvalidField = null;

            fields.forEach(function (field) {
                field.classList.remove("is-invalid");

                if (!field.checkValidity()) {
                    field.classList.add("is-invalid");

                    if (!firstInvalidField) {
                        firstInvalidField = field;
                    }
                }
            });

            const emailField = contactForm.querySelector(
                'input[type="email"]'
            );

            if (
                emailField &&
                emailField.value.trim() !== "" &&
                !emailPattern.test(emailField.value.trim())
            ) {
                emailField.classList.add("is-invalid");

                if (!firstInvalidField) {
                    firstInvalidField = emailField;
                }
            }

            if (firstInvalidField) {
                feedback.textContent =
                    "Please complete all required fields correctly.";

                feedback.classList.add("text-danger");

                firstInvalidField.focus();
                return;
            }

            feedback.textContent =
                "Your form passed validation. To deliver your message, " +
                "connect this form to an email service or backend.";

            feedback.classList.add("text-success");
        });

        // Remove an invalid style when a user edits a field.
        contactForm.querySelectorAll(
            "input, textarea, select"
        ).forEach(function (field) {
            field.addEventListener("input", function () {
                if (field.checkValidity()) {
                    field.classList.remove("is-invalid");
                }
            });
        });
    }


    // 11. IMAGE FALLBACK
    // Hides an image if its online source fails to load.
    document.querySelectorAll("img").forEach(function (img) {
        img.addEventListener("error", function () {
            img.classList.add("image-unavailable");
            img.setAttribute("aria-label", "Image unavailable");
        });
    });


    // 12. CONSOLE MESSAGE
    console.log("Toni Philip portfolio JavaScript loaded successfully.");

});
```