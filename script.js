const cursor = document.getElementById("cursor");
const loadingScreen = document.getElementById("loading-screen");
const form = document.getElementById("contact-form");
const success = document.getElementById("success-message");
const themeToggle = document.getElementById("theme-toggle");
const peaceToggle = document.getElementById("peace-toggle");
const starsCanvas = document.getElementById("stars");
const projectDialog = document.getElementById("project-dialog");
const projectDialogTitle = document.getElementById("project-dialog-title");
const projectDialogDescription = document.getElementById("project-dialog-description");
const projectPreviewImage = document.querySelector(".project-preview-image");
const projectPreviewCount = document.querySelector(".project-preview-count");
const technologyList = document.querySelector(".technology-list");
const repositoryLinks = document.querySelector(".project-repository-links");
const projectOpenButtons = Array.from(document.querySelectorAll(".project-open"));
const projectCloseButton = document.querySelector(".project-close");

const projects = [
    {
        id: "mitch-site",
        title: "mitch-site",
        image: "docs/images/projects/mitch-site-preview.svg",
        description: "A lightweight personal website built to practice semantic HTML and CSS. It organizes an about page and project gallery into a clear, responsive experience.",
        technologies: ["HTML5", "CSS3"],
        repositories: [{ name: "mitch-site", url: "https://github.com/lubi0036/mitch-site" }],
    },
    {
        id: "budget-tracker",
        title: "Budget Tracker MVC",
        image: "docs/images/projects/budget-tracker-preview.svg",
        description: "A budgeting application for recording transactions and setting monthly allocations, helping users understand spending and track progress in one place.",
        technologies: ["C#", "ASP.NET MVC", "SQLite"],
        repositories: [{ name: "Budget Tracker MVC", url: "https://github.com/lubi0036/Lab6-BudgetTracker-MVC-Application" }],
    },
    {
        id: "memeforge",
        title: "MemeForge Labs",
        image: "docs/images/projects/memeforge-preview.svg",
        description: "A meme-making application with reusable visual templates, user accounts, and database-backed content. The related container lab packages the app for consistent local deployment.",
        technologies: ["PHP", "Bootstrap", "SQLite", "Docker"],
        repositories: [
            { name: "MemeForgeLab6", url: "https://github.com/lubi0036/MemeForgeLab6" },
            { name: "Lab7MemeForgeContainer", url: "https://github.com/lubi0036/Lab7MemeForgeContainer" },
        ],
    },
    {
        id: "invoice-manager",
        title: "Invoice Manager",
        image: "docs/images/projects/invoice-manager-preview.svg",
        description: "A PHP invoice-management project that keeps invoice records organized and makes everyday billing workflows easier to follow.",
        technologies: ["PHP", "SQLite"],
        repositories: [{ name: "invoice-manager", url: "https://github.com/lubi0036/invoice-manager" }],
    },
];

let activeProjectIndex = -1;
let projectCloseTimer;

const renderProject = (index) => {
    const project = projects[index];
    activeProjectIndex = index;
    projectDialogTitle.textContent = project.title;
    projectDialogDescription.textContent = project.description;
    projectPreviewImage.src = project.image;
    projectPreviewImage.alt = `Illustrated project preview for ${project.title}`;
    projectPreviewCount.textContent = `${String(index + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`;

    technologyList.replaceChildren();
    for (const technology of project.technologies) {
        const item = document.createElement("li");
        item.textContent = technology;
        technologyList.append(item);
    }

    repositoryLinks.replaceChildren();
    for (const [index, repository] of project.repositories.entries()) {
        const link = document.createElement("a");
        link.className = index === 0 ? "project-btn project-github-button" : "project-related-repository";
        link.href = repository.url;
        link.target = "_blank";
        link.rel = "noreferrer";
        link.textContent = index === 0 ? "View on GitHub" : `View ${repository.name} on GitHub`;
        repositoryLinks.append(link);
    }
};

const closeProjectPreview = () => {
    if (!projectDialog.open || projectDialog.classList.contains("is-closing")) return;
    projectDialog.classList.add("is-closing");
    projectCloseTimer = window.setTimeout(() => {
        projectDialog.close();
        projectDialog.classList.remove("is-closing");
        projectOpenButtons[activeProjectIndex]?.focus();
    }, 180);
};

for (const [index, button] of projectOpenButtons.entries()) {
    const project = projects.find((item) => item.id === button.dataset.project);
    if (project) {
        const thumbnail = button.querySelector(".project-visual");
        thumbnail.src = project.image;
    }

    button.addEventListener("click", () => {
        window.clearTimeout(projectCloseTimer);
        renderProject(index);
        projectDialog.showModal();
    });
}

projectCloseButton.addEventListener("click", closeProjectPreview);
projectDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeProjectPreview();
});
projectDialog.addEventListener("click", (event) => {
    if (event.target === projectDialog) closeProjectPreview();
});
document.querySelector(".project-previous").addEventListener("click", () => {
    renderProject((activeProjectIndex - 1 + projects.length) % projects.length);
});
document.querySelector(".project-next").addEventListener("click", () => {
    renderProject((activeProjectIndex + 1) % projects.length);
});

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

