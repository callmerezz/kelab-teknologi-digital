const themeButton = document.querySelector(".theme-toggle");
const menuButton = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const savedTheme = localStorage.getItem("theme");
const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
let hasManualTheme = savedTheme === "light" || savedTheme === "dark";

function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    if (themeButton) {
        themeButton.textContent = theme === "dark" ? "Mod Cerah" : "Mod Gelap";
        themeButton.setAttribute(
            "aria-label",
            theme === "dark" ? "Tukar ke mod cerah" : "Tukar ke mod gelap"
        );
    }
}

setTheme(
    hasManualTheme
        ? savedTheme
        : systemThemeQuery.matches
          ? "dark"
          : "light"
);

systemThemeQuery.addEventListener("change", function (event) {
    if (!hasManualTheme) {
        setTheme(event.matches ? "dark" : "light");
    }
});

if (themeButton) {
    themeButton.addEventListener("click", function () {
        const newTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        hasManualTheme = true;
        localStorage.setItem("theme", newTheme);
        setTheme(newTheme);
    });
}

if (menuButton && navLinks) {
    function setMenuOpen(isOpen) {
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"
        );
        navLinks.classList.toggle("is-open", isOpen);
        document.body.classList.toggle("menu-open", isOpen);
    }

    menuButton.addEventListener("click", function () {
        setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
    });

    navLinks.addEventListener("click", function (event) {
        if (event.target.closest("a")) {
            setMenuOpen(false);
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            setMenuOpen(false);
        }
    });
}

const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let wheelScrollTarget = window.scrollY;
let wheelScrollFrame = 0;
let lastWheelScrollFrameTime = 0;

function stopWheelScroll() {
    if (wheelScrollFrame) {
        cancelAnimationFrame(wheelScrollFrame);
        wheelScrollFrame = 0;
    }
    lastWheelScrollFrameTime = 0;
    wheelScrollTarget = window.scrollY;
}

function animateWheelScroll() {
    const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
    );
    wheelScrollTarget = Math.min(maxScroll, Math.max(0, wheelScrollTarget));
    const distance = wheelScrollTarget - window.scrollY;
    if (Math.abs(distance) < 0.5) {
        window.scrollTo({ top: wheelScrollTarget, behavior: "instant" });
        wheelScrollFrame = 0;
        lastWheelScrollFrameTime = 0;
        return;
    }

    const now = performance.now();
    const elapsed = lastWheelScrollFrameTime
        ? Math.min((now - lastWheelScrollFrameTime) / 1000, 0.05)
        : 1 / 60;
    lastWheelScrollFrameTime = now;
    window.scrollTo({
        top: window.scrollY + distance * (1 - Math.exp(-12 * elapsed)),
        behavior: "instant"
    });
    wheelScrollFrame = requestAnimationFrame(animateWheelScroll);
}

function canScrollElement(element, deltaY) {
    while (element && element !== document.documentElement) {
        const overflowY = window.getComputedStyle(element).overflowY;
        if (
            /(auto|scroll|overlay)/.test(overflowY) &&
            element.scrollHeight > element.clientHeight
        ) {
            const atTop = element.scrollTop <= 0;
            const atBottom =
                element.scrollTop + element.clientHeight >= element.scrollHeight;
            if ((deltaY < 0 && !atTop) || (deltaY > 0 && !atBottom)) {
                return true;
            }
        }
        element = element.parentElement;
    }
    return false;
}

window.addEventListener("wheel", function (event) {
    if (
        reducedMotionQuery.matches ||
        event.defaultPrevented ||
        event.ctrlKey ||
        Math.abs(event.deltaY) <= Math.abs(event.deltaX)
    ) {
        return;
    }

    const target =
        event.target instanceof Element ? event.target : event.target.parentElement;
    if (canScrollElement(target, event.deltaY)) {
        return;
    }

    event.preventDefault();
    if (!wheelScrollFrame) {
        wheelScrollTarget = window.scrollY;
    }
    const deltaMultiplier =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
            ? 16
            : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
              ? window.innerHeight
              : 1;
    const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
    );
    wheelScrollTarget = Math.min(
        maxScroll,
        Math.max(0, wheelScrollTarget + event.deltaY * deltaMultiplier)
    );

    if (!wheelScrollFrame) {
        wheelScrollFrame = requestAnimationFrame(animateWheelScroll);
    }
}, { passive: false });

window.addEventListener("pointerdown", stopWheelScroll);
window.addEventListener("touchstart", stopWheelScroll, { passive: true });
window.addEventListener("keydown", stopWheelScroll);

reducedMotionQuery.addEventListener("change", function (event) {
    if (event.matches) {
        stopWheelScroll();
    }
});

const newsSlider = document.querySelector(".news-slider-section");
if (newsSlider) {
    const sliderTrack = newsSlider.querySelector(".slider-track");
    const newsSlides = Array.from(newsSlider.querySelectorAll(".news-slide"));
    const slideDots = Array.from(newsSlider.querySelectorAll(".slider-dots .dot"));
    const previousSlideButton = newsSlider.querySelector(".prev-btn");
    const nextSlideButton = newsSlider.querySelector(".next-btn");

    if (
        sliderTrack &&
        newsSlides.length > 0 &&
        slideDots.length === newsSlides.length &&
        previousSlideButton &&
        nextSlideButton
    ) {
        let currentSlide = Math.max(
            newsSlides.findIndex(function (slide) {
                return slide.classList.contains("active");
            }),
            0
        );

        function showNewsSlide(index) {
            currentSlide = (index + newsSlides.length) % newsSlides.length;
            sliderTrack.style.transform = "translateX(-" + currentSlide * 100 + "%)";

            newsSlides.forEach(function (slide, slideIndex) {
                const isActive = slideIndex === currentSlide;
                slide.classList.toggle("active", isActive);
                slide.setAttribute("aria-hidden", String(!isActive));
                slide.toggleAttribute("inert", !isActive);
            });

            slideDots.forEach(function (dot, dotIndex) {
                const isActive = dotIndex === currentSlide;
                dot.classList.toggle("active", isActive);
                if (isActive) {
                    dot.setAttribute("aria-current", "true");
                } else {
                    dot.removeAttribute("aria-current");
                }
            });
        }

        previousSlideButton.addEventListener("click", function () {
            showNewsSlide(currentSlide - 1);
        });

        nextSlideButton.addEventListener("click", function () {
            showNewsSlide(currentSlide + 1);
        });

        slideDots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                showNewsSlide(index);
            });
        });

        showNewsSlide(currentSlide);
        newsSlider.addEventListener("news:data-updated", function () {
            showNewsSlide(0);
        });
    }
}
