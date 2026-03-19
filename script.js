const cursorGlow = document.querySelector(".cursor-glow");
const revealItems = document.querySelectorAll(".reveal");
const tiltCards = document.querySelectorAll(".tilt-card");
const counter = document.querySelector("[data-count]");
const qtyButtons = document.querySelectorAll("[data-qty]");
const qtyInput = document.querySelector(".qty-input");
const productPhoto = document.querySelector(".product-photo");
const productPhotoFrame = document.querySelector(".product-photo-frame");

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

window.addEventListener("pointermove", (event) => {
  const x = `${(event.clientX / window.innerWidth) * 100}%`;
  const y = `${(event.clientY / window.innerHeight) * 100}%`;
  cursorGlow?.style.setProperty("--x", x);
  cursorGlow?.style.setProperty("--y", y);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => observer.observe(item));

tiltCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const bounds = card.getBoundingClientRect();
    const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -12;
    const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  });
});

if (counter) {
  const target = Number(counter.dataset.count);
  let started = false;

  const startCount = () => {
    if (started) return;
    started = true;

    const duration = 1400;
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const progress = clamp((currentTime - startTime) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(target * eased);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        counter.textContent = String(target);
      }
    };

    requestAnimationFrame(updateCount);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startCount();
        }
      });
    },
    { threshold: 0.6 }
  );

  counterObserver.observe(counter);
}

qtyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!qtyInput) return;
    const delta = Number(button.dataset.qty);
    const current = Number(qtyInput.value) || 1;
    const next = clamp(current + delta, 1, 10);
    qtyInput.value = String(next);
  });
});

if (productPhoto && productPhotoFrame) {
  const showPhotoFallback = () => {
    productPhotoFrame.classList.add("is-missing");
  };

  if (productPhoto.complete && productPhoto.naturalWidth === 0) {
    showPhotoFallback();
  }

  productPhoto.addEventListener("error", showPhotoFallback);
}

window.addEventListener("scroll", () => {
  const offset = window.scrollY * 0.04;
  document.querySelectorAll(".shape").forEach((shape, index) => {
    const direction = index % 2 === 0 ? 1 : -1;
    shape.style.transform = `translate3d(${offset * direction}px, ${offset * -0.3}px, 0)`;
  });
});
