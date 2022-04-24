'use strict';

///////////////////////////////////////

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const learnMoreButton = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav__links');
const navHeader = document.querySelector('.nav');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const header = document.querySelector('.header');
const navHeight = navHeader.getBoundingClientRect().height;
const allSections = document.querySelectorAll('.section');
const imgTargets = document.querySelectorAll('img[data-src]');

// OverLay
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Scroll to 'Learn more' Button
learnMoreButton.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// navigation Buttons
nav.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    !e.target.classList.contains('nav__link') ||
    e.target.classList.contains('btn--show-modal')
  )
    return;
  document
    .querySelector(e.target.getAttribute('href'))
    .scrollIntoView({ behavior: 'smooth' });
});

// Operations
tabsContainer.addEventListener('click', function (e) {
  const btn = e.target.closest('.operations__tab');
  if (!btn) return;
  tabs.forEach(tab => {
    tab.classList.remove('operations__tab--active');
  });
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  btn.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${btn.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Navigator hover
function handleHover(e, opacity) {
  if (!e.target.classList.contains('nav__link')) return;
  const siblings = e.target.closest('.nav').querySelectorAll('.nav__link');
  siblings.forEach(function (el) {
    if (el !== e.target) {
      el.style.opacity = opacity;
    }
  });
}
nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.5);
});
nav.addEventListener('mouseout', function (e) {
  handleHover(e, 1);
});

// Sticky Navigator
const navigaorObserver = new IntersectionObserver(stickNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
navigaorObserver.observe(header);
function stickNav(entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    navHeader.classList.add('sticky');
  } else {
    navHeader.classList.remove('sticky');
  }
}

// Section Show
function showSection(entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  sectionObserver.unobserve(entry.target);
}
const sectionObserver = new IntersectionObserver(showSection, {
  root: null,
  threshold: 0,
});

allSections.forEach(function (section) {
  // section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

// Lazy Loading images

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// Slider
const slides = document.querySelectorAll('.slide');
/*
let currntSlide = 0;
let slidesNumber = slides.length - 1;
function goToSlide() {
  if (currntSlide === slidesNumber + 1) currntSlide = 0;
  if (currntSlide === -1) currntSlide = slidesNumber;
  slides.forEach(function (slide, index) {
    slide.style.transform = `translateX(${(index - currntSlide) * 100}%)`;
  });
}
//0%,100%,200%
//-100,0%,100%
goToSlide();

const rightBtn = document.querySelector('.slider__btn--right');
rightBtn.addEventListener('click', function () {
  currntSlide++;
  goToSlide();
});
const leftBtn = document.querySelector('.slider__btn--left');
leftBtn.addEventListener('click', function () {
  currntSlide--;
  goToSlide();
});*/

let slideNumber = 0;
let maxSlide = slides.length;
const dotContainer = document.querySelector('.dots');

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

function goToSlide(slideNum) {
  slides.forEach(function (slide, index) {
    slide.style.transform = `translateX(${(index - slideNum) * 100}%)`;
  });
}
//0%,100%,200%
//-100,0%,100%
goToSlide(0);
createDots();

const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

activateDot(0);
const rightBtn = document.querySelector('.slider__btn--right');
rightBtn.addEventListener('click', function () {
  nextSlide();
});
const leftBtn = document.querySelector('.slider__btn--left');
leftBtn.addEventListener('click', function () {
  previosSlide();
});

function nextSlide() {
  slideNumber++;
  if (slideNumber === maxSlide) slideNumber = 0;
  goToSlide(slideNumber);
  activateDot(slideNumber);
}
function previosSlide() {
  slideNumber--;
  if (slideNumber === -1) slideNumber = maxSlide - 1;
  activateDot(slideNumber);
  goToSlide(slideNumber);
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') previosSlide();
  e.key === 'ArrowRight' && nextSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    slideNumber = e.target.dataset.slide;
    goToSlide(slideNumber);
    activateDot(slideNumber);
  }
});
