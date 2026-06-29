document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const moonIcon = document.getElementById("moon-icon");
  const sunIcon = document.getElementById("sun-icon");

  // Check for saved theme preference; default to light if nothing is saved
  const savedTheme = localStorage.getItem("theme");

  // Set initial theme (force light mode if no saved preference)
  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    updateIcons("dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    updateIcons("light");
  }

  // Toggle theme on click
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateIcons(newTheme);
  });

  function updateIcons(theme) {
    if (theme === "dark") {
      moonIcon.style.display = "none";
      sunIcon.style.display = "block";
    } else {
      moonIcon.style.display = "block";
      sunIcon.style.display = "none";
    }
  }

  // Education Cards Mobile Click Logic
  const eduCards = document.querySelectorAll(".edu-card");

  const updateBodyScrollLock = () => {
    const hasActiveCard = Array.from(eduCards).some((c) =>
      c.classList.contains("active"),
    );
    if (window.innerWidth <= 600 && hasActiveCard) {
      document.body.classList.add("edu-popup-open");
    } else {
      document.body.classList.remove("edu-popup-open");
    }
  };

  // Toggle popup on card click
  eduCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      // Don't close if clicking inside the popup itself
      if (e.target.closest(".flixer-popup")) return;

      // Remove active from all other cards to keep only one open
      eduCards.forEach((c) => {
        if (c !== card) c.classList.remove("active");
      });

      // Toggle the current card
      card.classList.toggle("active");
      updateBodyScrollLock();
      e.stopPropagation(); // Prevent document click from immediately closing it
    });
  });

  // Close when clicking anywhere outside the cards
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".edu-card")) {
      eduCards.forEach((card) => card.classList.remove("active"));
      updateBodyScrollLock();
    }
  });

  // Close popups when scrolling the page (only on desktop - on mobile we block scroll when popup sheet is active)
  document.addEventListener(
    "scroll",
    () => {
      if (window.innerWidth > 600) {
        eduCards.forEach((card) => card.classList.remove("active"));
      }
    },
    { passive: true },
  );

  // Fetch Top GitHub Projects
  const githubProjectsContainer = document.getElementById("github-projects");
  if (githubProjectsContainer) {
    // Fetch up to 100 repos, sort by last updated, using a cache-buster query parameter to get fresh updates
    fetch(
      "https://api.github.com/users/myst-25/repos?sort=updated&per_page=100&t=" +
        new Date().getTime(),
    )
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((repos) => {
        // Filter out forks and sort purely by last updated date (newest first)
        const topRepos = repos
          .filter((repo) => !repo.fork)
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
          .slice(0, 5); // Take top 5

        githubProjectsContainer.innerHTML = ""; // Clear loading message

        topRepos.forEach((repo) => {
          const el = document.createElement("a");
          el.href = repo.html_url;
          el.target = "_blank";
          el.className = "project-item";

          const lang = repo.language || "Code";
          const desc = repo.description || "No description provided.";
          el.setAttribute("aria-label", repo.name);

          el.innerHTML = `
                        <div class="project-info">
                            <h3 aria-label="${repo.name}">${repo.name}</h3>
                            <p>${desc}</p>
                        </div>
                        <span class="project-meta">${lang} <span class="link-arrow">↗</span></span>
                    `;

          githubProjectsContainer.appendChild(el);
        });

        // Add "View All Projects" Button
        const viewAllContainer = document.createElement("div");
        viewAllContainer.className = "view-all-projects-container";
        viewAllContainer.innerHTML = `<a href="https://github.com/myst-25" target="_blank" class="view-all-btn" aria-label="View all projects on GitHub">View all on GitHub ↗</a>`;
        githubProjectsContainer.appendChild(viewAllContainer);
      })
      .catch((error) => {
        console.error("Error fetching GitHub repos:", error);
        githubProjectsContainer.innerHTML = `
                    <a href="https://github.com/myst-25/PDFOS" target="_blank" class="project-item" aria-label="PDFOS">
                        <div class="project-info">
                            <h3 aria-label="PDFOS">PDFOS</h3>
                            <p>A cross-platform, UI-based PDF manipulation tool built entirely in Python.</p>
                        </div>
                        <span class="project-meta">Python <span class="link-arrow">↗</span></span>
                    </a>
                    <a href="https://github.com/myst-25/Portfolio" target="_blank" class="project-item" aria-label="Portfolio">
                        <div class="project-info">
                            <h3 aria-label="Portfolio">Portfolio</h3>
                            <p>My personal portfolio website with custom minimalist design.</p>
                        </div>
                        <span class="project-meta">HTML/CSS <span class="link-arrow">↗</span></span>
                    </a>
                `;
      });
  }

  // Scroll Reveal Animation
  const revealElements = document.querySelectorAll(".reveal");
  const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -20px 0px",
  };

  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach((el) => {
    revealOnScroll.observe(el);
  });

  // Profile Image 3D Tilt Effect
  const profileImg = document.querySelector(".profile-img");
  if (profileImg) {
    let ticking = false;
    profileImg.addEventListener("mousemove", (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = profileImg.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          // Calculate tilt angle (max 15 degrees)
          const tiltX = ((y - centerY) / centerY) * -15;
          const tiltY = ((x - centerX) / centerX) * 15;

          profileImg.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
          profileImg.style.transition = "transform 0.1s ease";
          ticking = false;
        });
        ticking = true;
      }
    });

    profileImg.addEventListener("mouseleave", () => {
      profileImg.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
      profileImg.style.transition = "transform 0.5s ease";
    });
  }

  // Render Dynamic Status
  const statusContainer = document.getElementById("dynamic-status");
  const statusText = document.getElementById("dynamic-status-text");

  if (statusContainer && typeof STATUS_CONFIG !== "undefined") {
    const renderStatus = (statusKeyOrText) => {
      const key = statusKeyOrText.trim().toLowerCase();
      const activeStatus = STATUS_CONFIG[key] || {
        text: statusKeyOrText.trim(),
      };

      // 7 Colors for 7 Days of the week (changes every 24hrs)
      const weekColors = [
        "#ef4444", // Sunday: Red
        "#f97316", // Monday: Orange
        "#eab308", // Tuesday: Yellow
        "#10b981", // Wednesday: Green
        "#3b82f6", // Thursday: Blue
        "#8b5cf6", // Friday: Violet
        "#ec4899", // Saturday: Pink
      ];

      const currentDay = new Date().getDay(); // Returns 0 (Sun) to 6 (Sat)
      const dailyColor = weekColors[currentDay];

      statusText.textContent = activeStatus.text;
      // Override the color with the daily color
      statusContainer.style.setProperty("--status-color", dailyColor);
      statusContainer.style.display = "inline-flex";
    };

    // 1. Instant Render (Zero Delay)
    // Use cached status from a previous visit, or fallback to the default config
    let initialStatus = localStorage.getItem("myst_cached_status");

    if (!initialStatus) {
      for (const key in STATUS_CONFIG) {
        if (STATUS_CONFIG[key].active) {
          initialStatus = key;
          break;
        }
      }
    }

    // Render immediately so there is no layout jump
    if (initialStatus) {
      renderStatus(initialStatus);
    }

    // Helper to find the active status from raw gist text
    // E.g., searches for a status with a '#' prefix like "#available" or "#working on self"
    const parseActiveStatusFromGist = (rawText) => {
      const normalized = rawText.toLowerCase();

      // Check for each defined status key to see if it is prefixed with '#'
      for (const key in STATUS_CONFIG) {
        // Matches "#key", "# key", or "#[key]" formats
        const regex = new RegExp(`#\\s*${key}\\b`, "i");
        if (regex.test(normalized)) {
          return key;
        }
      }
      return null;
    };

    // 2. Background Fetch for Updates
    if (
      typeof STATUS_GIST_URL !== "undefined" &&
      STATUS_GIST_URL.trim() !== ""
    ) {
      fetch(STATUS_GIST_URL + "?v=" + new Date().getTime())
        .then((res) => res.text())
        .then((text) => {
          if (text && text.trim() !== "") {
            const newStatus = parseActiveStatusFromGist(text);
            if (newStatus) {
              // Save it for the next time they visit
              localStorage.setItem("myst_cached_status", newStatus);
              // Update the display silently
              renderStatus(newStatus);
            } else {
              // Fallback if no matching status is selected in the gist
              renderStatus("available");
            }
          }
        })
        .catch((err) => {
          console.error("Failed to fetch Gist status:", err);
          // If fetching fails, render cached status or default fallback status
          if (!initialStatus) {
            renderStatus("available");
          }
        });
    }
  }

  // Profile Modal Logic
  const profileImgEl = document.querySelector(".profile-img");
  const profileModal = document.getElementById("profile-modal");

  if (profileImgEl && profileModal) {
    profileImgEl.addEventListener("click", () => {
      profileModal.classList.add("active");
    });
    
    profileModal.addEventListener("click", () => {
      profileModal.classList.remove("active");
    });
  }

  // Email Modal Logic
  const emailLink = document.getElementById("email-link");
  const emailModal = document.getElementById("email-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const copyEmailBtn = document.getElementById("copy-email-btn");
  const emailAddress = "mohammedyaminsalman@gmail.com";

  if (emailLink && emailModal) {
    emailLink.addEventListener("click", (e) => {
      e.preventDefault();
      emailModal.classList.add("active");
    });

    closeModalBtn.addEventListener("click", () => {
      emailModal.classList.remove("active");
    });

    // Close on outside click
    emailModal.addEventListener("click", (e) => {
      if (e.target === emailModal) {
        emailModal.classList.remove("active");
      }
    });

    // Copy email functionality (with mobile fallback)
    copyEmailBtn.addEventListener("click", () => {
      const handleSuccess = () => {
        copyEmailBtn.textContent = "Copied! ✓";
        copyEmailBtn.style.backgroundColor = "#10b981"; // Success green
        copyEmailBtn.style.color = "#fff";

        setTimeout(() => {
          copyEmailBtn.textContent = "Copy Email"; // Reset to default
          copyEmailBtn.style.backgroundColor = "";
          copyEmailBtn.style.color = "";
        }, 2000);
      };

      const handleError = (err) => {
        console.error("Failed to copy text: ", err);
        copyEmailBtn.textContent = "Failed to copy";
        setTimeout(() => {
          copyEmailBtn.textContent = "Copy Email";
        }, 2000);
      };

      if (navigator.clipboard && window.isSecureContext) {
        // Modern Async Clipboard API
        navigator.clipboard
          .writeText(emailAddress)
          .then(handleSuccess)
          .catch(handleError);
      } else {
        // Fallback for older mobile browsers and non-HTTPS local testing
        try {
          const textArea = document.createElement("textarea");
          textArea.value = emailAddress;

          // Prevent scrolling and rendering on screen
          textArea.style.position = "fixed";
          textArea.style.top = "-9999px";
          textArea.style.left = "-9999px";

          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();

          const successful = document.execCommand("copy");
          document.body.removeChild(textArea);

          if (successful) {
            handleSuccess();
          } else {
            handleError(new Error("execCommand failed"));
          }
        } catch (err) {
          handleError(err);
        }
      }
    });
  }

  // Hero Contact Button Logic
  const heroContactBtn = document.getElementById("hero-contact-btn");
  if (heroContactBtn && emailModal) {
    heroContactBtn.addEventListener("click", () => {
      emailModal.classList.add("active");
    });
  }

  // Custom Cursor Logic
  const customCursor = document.getElementById("custom-cursor");
  // Only enable if the device supports hover (not touch)
  if (customCursor && window.matchMedia("(pointer: fine)").matches) {
    let cursorTicking = false;
    document.addEventListener("mousemove", (e) => {
      if (!cursorTicking) {
        window.requestAnimationFrame(() => {
          customCursor.style.left = `${e.clientX}px`;
          customCursor.style.top = `${e.clientY}px`;
          cursorTicking = false;
        });
        cursorTicking = true;
      }
    });

    // Delegate event listener for interactive elements
    document.body.addEventListener("mouseover", (e) => {
      const target = e.target.closest(
        "a, button, .project-item, .edu-card, .theme-toggle, input, textarea",
      );
      if (target) {
        customCursor.classList.add("cursor-hover");
      }
    });

    document.body.addEventListener("mouseout", (e) => {
      const target = e.target.closest(
        "a, button, .project-item, .edu-card, .theme-toggle, input, textarea",
      );
      if (target) {
        customCursor.classList.remove("cursor-hover");
      }
    });

    // Hide cursor when it leaves the window
    document.addEventListener("mouseleave", () => {
      customCursor.style.opacity = "0";
    });
    document.addEventListener("mouseenter", () => {
      customCursor.style.opacity = "0.5";
    });
  }
});
