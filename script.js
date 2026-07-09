const animatedBlocks = document.querySelectorAll("[data-animate]");
const counters = document.querySelectorAll("[data-counter]");
const progressIndicator = document.getElementById("progress-indicator");
const faqItems = document.querySelectorAll(".faq-item");
const agentCards = document.querySelectorAll(".agent-mini");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.18 }
);

animatedBlocks.forEach((block) => revealObserver.observe(block));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const element = entry.target;
      const target = Number(element.dataset.counter);
      const duration = 1400;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        element.textContent = Math.floor(progress * target).toLocaleString("fa-IR");

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(element);
    });
  },
  { threshold: 0.45 }
);

counters.forEach((counter) => counterObserver.observe(counter));

faqItems.forEach((item) => {
  const trigger = item.querySelector(".faq-question");

  trigger.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");

    faqItems.forEach((entry) => {
      entry.classList.remove("open");
      entry.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("open");
      trigger.setAttribute("aria-expanded", "true");
    }
  });
});

if (agentCards.length > 0) {
  let activeIndex = 0;

  window.setInterval(() => {
    agentCards[activeIndex].classList.remove("active");
    activeIndex = (activeIndex + 1) % agentCards.length;
    agentCards[activeIndex].classList.add("active");
  }, 2200);
}

const updateProgress = () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  progressIndicator.style.width = `${Math.min(progress, 100)}%`;
};

updateProgress();
window.addEventListener("scroll", updateProgress, { passive: true });
