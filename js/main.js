"use strict";

const counterElements = document.querySelectorAll(".count span");

const navButton = document.querySelector(".nav-toggle");

const scroller = document.querySelector(".scroller");

const testimonialsElement = document.querySelector(".testimonial__content");

const faqs = document.querySelectorAll(".faq__card");

// testimonial index
let currentTestimonal = 0;

const nextTestimonialBtn = document.querySelector("#next-testimonial");

const previousTestimonialBtn = document.querySelector("#previous-testimonial");

const testimonials = [
  {
    id: 0,
    review:
      "Discovering my dream home was effortless with this real estate platform. The user-friendly interface and transparent process made it a stress-free experience. I highly recommend it for anyone on the house-hunting journey!",
    author: "sarah thompson",
    rating: 5,
  },
  {
    id: 0,
    review:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem recusandae rerum molestias maiores, commodi delectus laboriosam ratione deleniti voluptas quia",
    author: "john doe",
    rating: 4,
  },
  {
    id: 0,
    review:
      "Repellat soluta omnis quod voluptas libero necessitatibus iure at praesentium. Nesciunt tempore laboriosam nostrum ullam, commodi accusantium in distinctio et temporibus! Incidunt, debitis facere. Debitis, perspiciatis velit",
    author: "anna thomas",
    rating: 5,
  },
];

const sizeOfTestimonials = testimonials.length;

/**
 * control mobile navigation menu visibility
 */
function toggleMobileMenu() {
  const state = navButton.getAttribute("data-state");

  if (!state || state === "closed") {
    navButton.setAttribute("data-state", "opened");
    navButton.setAttribute("aria-expanded", "true");
  } else {
    navButton.setAttribute("data-state", "closed");
    navButton.setAttribute("aria-expanded", "false");
  }
}

/**
 * callback function for intersection observer
 * @param {Array<IntersectionObserverEntry>} entries
 * @param {IntersectionObserver} observer
 */
function handleIntersection(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const endValue = parseInt(entry.target.dataset.value);

      countUp(undefined, endValue, 5000, entry.target);
      // should only run once
      observer.unobserve(entry.target);
    }
  });
}

/**
 *  slowly increment number value
 * @param {number} start
 * @param {number} end
 * @param {number} interval
 * @param {HTMLElement} element
 */

function countUp(start = 0, end, interval = 4000, element) {
  let count = start;
  const gap = 10;
  const duration = Math.floor(interval / end);

  const intervalId = setInterval(() => {
    // display count
    setTimeout(() => {
      if (count + gap >= end) {
        count = end;
      } else {
        count += gap;
      }
    }, 1000);
    element.textContent = count;
    if (count === end) {
      clearInterval(intervalId);
    }
  }, duration);
}

/**
 *  logos infinite horizontal scroll animation
 */
function addAnimation() {
  scroller.setAttribute("data-animated", true);

  const innerScroller = scroller.querySelector(".scroller__inner");

  const scrollerContent = Array.from(innerScroller.children);

  scrollerContent.forEach((item) => {
    const duplicatedItem = item.cloneNode(true);
    duplicatedItem.setAttribute("aria-hidden", true);
    innerScroller.appendChild(duplicatedItem);
  });
}

/**
 *  change the testimonial being displayed to current index value
 * @param {number} index
 */
function updateTestimonial() {
  const testimonial = testimonials[currentTestimonal];

  const quote = testimonialsElement.querySelector(".review span");

  const author = testimonialsElement.querySelector(".author");

  const ratings = testimonialsElement.querySelector(".stars");

  testimonialsElement.classList.add("animated");

  quote.textContent = testimonial.review;

  author.textContent = testimonial.author;

  ratings.innerHTML = Array.from(
    { length: testimonial.rating },
    (_, idx) => `<img src="./images/star.svg" alt="" />`
  ).join("");
}

/**
 *  increment index of testimonial
 */
function getNextTestimonial() {
  if (currentTestimonal >= sizeOfTestimonials - 1) {
    currentTestimonal = 0;
  } else {
    currentTestimonal++;
  }
  updateTestimonial();
}

/**
 *  decrement index of testimonial
 */
function getPreviousTestimonial() {
  if (currentTestimonal === 0) {
    currentTestimonal = sizeOfTestimonials - 1;
  } else {
    currentTestimonal--;
  }
  updateTestimonial();
}

/**
 *
 * @param {HTMLLIElement} element
 */
function toggleFaqCard(element) {
  const state = element.getAttribute("data-state");

  faqs.forEach((faq) => {
    if (faq === element && state !== "open") {
      faq.setAttribute("data-state", "open");
    } else {
      faq.setAttribute("data-state", "closed");
    }

    const faqBtn = faq.querySelector("button");

    faqBtn.textContent = faq.dataset.state === "open" ? "-" : "+";
  });

  if (state === "open") {
    element.setAttribute("data-state", "closed");
    return;
  }

  element.setAttribute("data-state", "open");
}

// intersection observer
const observer = new IntersectionObserver(handleIntersection, {
  root: null,
  threshold: 0.3,
});

counterElements.forEach((element) => {
  observer.observe(element);
});

// anime({
//   targets: "img.test",
//   translateY: [
//     {
//       value: 200,
//       duration: 500,
//     },
//   ],
// });

navButton.addEventListener("click", toggleMobileMenu);

// add scroller animation only when user doesn't mind animations
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  addAnimation();
}

previousTestimonialBtn.addEventListener("click", getPreviousTestimonial);

nextTestimonialBtn.addEventListener("click", getNextTestimonial);

faqs.forEach((faq) => {
  faq.addEventListener("click", () => toggleFaqCard(faq));
});

testimonialsElement.addEventListener("animationend", function () {
  this.classList.remove("animated");
});
