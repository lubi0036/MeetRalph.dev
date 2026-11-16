const cursor = document.getElementById("cursor");
const loadingScreen = document.getElementById("loading-screen");
const form = document.getElementById("contact-form");
const success = document.getElementById("success-message");
const themeToggle = document.getElementById("theme-toggle");
const peaceToggle = document.getElementById("peace-toggle");
const starsCanvas = document.getElementById("stars");

const updateCursor = (event) => {
    if (!cursor) return;
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
};

document.addEventListener("mousemove", updateCursor);

document.addEventListener("mouseleave", () => {
    if (cursor) {
        cursor.style.opacity = "0";
    }
});

document.addEventListener("mouseenter", () => {
    if (cursor) {
        cursor.style.opacity = "1";
    }
});

window.addEventListener("load", () => {
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add("hidden");
        }
    }, 1700);
});

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
    });
}

if (peaceToggle) {
    peaceToggle.addEventListener("click", () => {
        document.body.classList.toggle("peace-mode");
    });
}

if (form) {
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        success.style.display = "block";
        form.reset();

        setTimeout(() => {
            success.style.display = "none";
        }, 2500);
    });
}

if (starsCanvas) {
    const ctx = starsCanvas.getContext("2d");
    const stars = [];

    const resizeCanvas = () => {
        const ratio = window.devicePixelRatio || 1;
        starsCanvas.width = window.innerWidth * ratio;
        starsCanvas.height = window.innerHeight * ratio;
        starsCanvas.style.width = `${window.innerWidth}px`;
        starsCanvas.style.height = `${window.innerHeight}px`;
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        createStars();
    };

    const createStars = () => {
        const totalStars = Math.min(140, Math.max(70, Math.floor(window.innerWidth / 12)));
        stars.length = 0;

        for (let i = 0; i < totalStars; i++) {
            stars.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                radius: Math.random() * 2.2 + 0.8,
                speed: Math.random() * 0.8 + 0.2,
                alpha: Math.random() * 0.8 + 0.2,
            });
        }
    };

    const animateStars = () => {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        for (const star of stars) {
            star.y += star.speed;

            if (star.y > window.innerHeight) {
                star.y = -10;
                star.x = Math.random() * window.innerWidth;
            }

            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        requestAnimationFrame(animateStars);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animateStars();
}

