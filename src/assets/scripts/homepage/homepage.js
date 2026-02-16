import { intersectionObserver, throttle } from '../common/intersectionObserver';
import { fadeUpLines, splitToLines } from '../modules/effects/animationHelpers';
import clipPathEntry from '../modules/effects/clipPathEntry';

import { gsap, ScrollTrigger, SplitText } from 'gsap/all';
gsap.registerPlugin(ScrollTrigger, SplitText);

const animBlocks = document.querySelectorAll('.block-anim');

animBlocks.forEach(animBlock => {
  animBlock.querySelectorAll('.button-anim').forEach(button => {
    gsap.fromTo(
      button,
      {
        autoAlpha: 0,
        y: 50,
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: animBlock,
          start: 'top center',
          toggleActions: 'play none none none',
          once: true,
        },
      },
    );
  });
});

const quotes = document.querySelectorAll('.text-anim');

function setupSplits() {
  quotes.forEach(quote => {
    // Reset if needed
    if (quote.anim) {
      quote.anim.progress(1).kill();
      quote.split.revert();
    }

    quote.split = SplitText.create(quote, {
      type: 'words',
      linesClass: 'split-line',
    });

    // Set up the anim
    quote.anim = gsap.from(quote.split.words, {
      scrollTrigger: {
        trigger: quote,

        start: 'top +=90%',
        // markers: { startColor: '#dfdcff', endColor: 'transparent' },
      },
      duration: 0.4,
      ease: 'circ.out',

      opacity: 0,
      y: 40,
      stagger: 0.03,
    });
  });
}

// ScrollTrigger.addEventListener('refresh', setupSplits);
setupSplits();
window.addEventListener('load', setupSplits);

const chars = document.querySelectorAll('.chars-anim');

function setupSplitsChars() {
  chars.forEach(quote => {
    // Reset if needed
    if (quote.anim) {
      quote.anim.progress(1).kill();
      quote.split.revert();
    }

    quote.split = SplitText.create(quote, {
      type: ' chars',
      linesClass: 'split-line',
    });

    // Set up the anim
    quote.anim = gsap.from(quote.split.chars, {
      scrollTrigger: {
        trigger: quote,

        start: 'top +=90%',
        // markers: { startColor: '#dfdcff', endColor: 'transparent' },
      },
      duration: 0.4,
      ease: 'circ.out',

      opacity: 0,
      y: 40,
      stagger: 0.02,
    });
  });
}

// ScrollTrigger.addEventListener('refresh', setupSplitsChars);
setupSplitsChars();
window.addEventListener('load', setupSplitsChars);

function splitToLinesAndFadeUp(selector) {
  const elementRef = document.querySelector(selector);
  let mathM = elementRef.innerHTML.match(
    /<\s*(\w+\b)(?:(?!<\s*\/\s*\1\b)[\s\S])*<\s*\/\s*\1\s*>|\S+/g,
  );
  if (mathM === null) return;
  mathM = mathM.map(el => `<span style="display:inline-flex"><span>${el}</span></span>`);
  elementRef.innerHTML = mathM.join(' ');
  gsap.set(elementRef, { overflow: 'hidden', opacity: 1 });
  gsap.set(elementRef.children, { overflow: 'hidden' });
  gsap.set(elementRef.querySelectorAll('span>span'), {
    overflow: 'initial',
    display: 'inline-block',
  });
  let tl = gsap
    .timeline()
    .fromTo(
      elementRef.querySelectorAll('span>span'),
      { yPercent: 100 },
      { yPercent: 0, stagger: 0.05, duration: 1, ease: 'power4.out' },
    )
    .add(() => {
      // elementRef.innerHTML = elementRef.textContent;
    });
}

// Top-section slider

const progressBar = document.querySelector('.third-column__progress-bar');
let pauseProgress = 0;

const scrollContent = document.querySelector('.scroll-content');
const slides = Array.from(scrollContent.children);
const slideCount = slides.length;
const slideHeight = slides[0].offsetHeight;
const pauseDuration = 5000; // пауза в мс
const scrollSpeed = 3; // Увеличили скорость прокрутки (с 0.5 до 3)

let offset = 0;
let lastTimestamp = null;
let isPaused = false;
let pauseStart = null;
let direction = 1; // 1 — вниз, -1 — вверх

function animate(timestamp) {
  if (!lastTimestamp) lastTimestamp = timestamp;
  const delta = timestamp - lastTimestamp;
  lastTimestamp = timestamp;

  if (isPaused) {
    pauseProgress += delta;

    const progressPercentage = Math.min((pauseProgress / pauseDuration) * 100, 100);
    progressBar.style.width = `${progressPercentage}%`;

    if (timestamp - pauseStart >= pauseDuration) {
      isPaused = false;
      pauseProgress = 0;
      progressBar.style.width = '0';
    }
  } else {
    offset += direction * scrollSpeed * (delta / 16);

    // Ограничения прокрутки
    if (direction === 1 && offset >= (slideCount - 1) * slideHeight) {
      offset = (slideCount - 1) * slideHeight;
      direction = -1;
      isPaused = true;
      pauseStart = timestamp;
    } else if (direction === -1 && offset <= 0) {
      offset = 0;
      direction = 1;
      isPaused = true;
      pauseStart = timestamp;
    }

    scrollContent.style.transform = `translateY(${-offset}px)`;

    // Точнее определяем остановку на слайдах
    if (!isPaused) {
      let remainder = offset % slideHeight;
      if (direction === 1 && remainder < scrollSpeed) {
        isPaused = true;
        pauseStart = timestamp;
      }
      if (direction === -1 && slideHeight - remainder < scrollSpeed) {
        isPaused = true;
        pauseStart = timestamp;
      }
    }
  }

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

//Top section slider second block

const progressBarSecondBlock = document.getElementById('swiperProgressBar');

function resetProgressBar() {
  progressBarSecondBlock.style.width = '0%';
  progressBarSecondBlock.offsetHeight; // Force reflow
  progressBarSecondBlock.style.transition = 'none'; // Reset transition
  progressBarSecondBlock.offsetHeight; // Force reflow again
  progressBarSecondBlock.style.transition = 'width 5s linear';
  progressBarSecondBlock.style.width = '100%';
}

const secondColumnSwiper = new Swiper('.second-column__swiper', {
  direction: 'horizontal',
  loop: true,
  slidesPerView: 1,
  spaceBetween: 0,
  effect: 'fade',
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  on: {
    slideChangeTransitionStart: resetProgressBar,
  },
});
resetProgressBar();

//Lavanda

function animateSecondSection() {
  const digits = document.querySelectorAll('.lavanda-park [data-count]');
  digits.forEach(digitForAnim => {
    const isDigitInteger = Number.isInteger(+digitForAnim.dataset.count);
    gsap.fromTo(
      digitForAnim,
      {
        textContent: 0,
      },
      {
        textContent: (e, target) => {
          // console.log(target);
          return target.dataset.count;
        },
        duration: 4,
        ease: 'power1.out',
        snap: { textContent: isDigitInteger ? 1 : 0.1 },
        stagger: 0,
        // onUpdate: textContent.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      },
    );
  });
}

function setupIntersectionObserver(selector, selector_2) {
  const target = document.querySelector(selector);
  if (!target) {
    return;
  }

  const observerOptions = {
    root: null, // Область видимости - весь экран
    rootMargin: '0px 0px -20% 0px', // Смещаем нижнюю границу на 15% вверх
    threshold: 0, // Срабатывает, как только элемент пересекает границу
  };

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        splitToLinesAndFadeUp(selector_2);
        animateSecondSection();
        observerInstance.unobserve(entry.target); // Прекращаем отслеживание, если нужно только один раз
      }
    });
  }, observerOptions);

  observer.observe(target); // Начинаем отслеживать элемент
}

// Запуск отслеживания
setupIntersectionObserver('.lavanda-park', '.left-side__header');
setupIntersectionObserver('.gallery', '.gallery__title');
setupIntersectionObserver('.gallery', '.gallery__text');

//Gallery

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.gallery__btn');
  const displays = document.querySelectorAll('.gallery__display_wrapper');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(btn => btn.classList.remove('active'));

      button.classList.add('active');

      const targetId = button.id;

      displays.forEach(display => display.classList.remove('active'));

      const targetDisplay = document.querySelector(
        `.gallery__display_wrapper[data-for="${targetId}"]`,
      );

      if (targetDisplay) {
        targetDisplay.classList.add('active');
      }
    });
  });

  const galleryPhotosSwiper = new Swiper('.gallery__photos_swiper', {
    direction: 'horizontal',
    loop: false,
    slidesPerView: 'auto',
    // spaceBetween: 20,
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 'auto',
      },
    },
    navigation: {
      nextEl: '.photos_swiper-button-next',
      prevEl: '.photos_swiper-button-prev',
    },
  });

  const galleryViewsSwiper = new Swiper('.gallery__views_swiper', {
    direction: 'horizontal',
    loop: false,
    slidesPerView: 'auto',
    // spaceBetween: 20,
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 'auto',
      },
    },
    navigation: {
      nextEl: '.view_swiper-button-next',
      prevEl: '.view_swiper-button-prev',
    },
  });

  const galleryVideosSwiper = new Swiper('.gallery__videos_swiper', {
    direction: 'horizontal',
    loop: false,
    slidesPerView: 'auto',
    // spaceBetween: 20,
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 'auto',
      },
    },
    navigation: {
      nextEl: '.video_swiper-button-next',
      prevEl: '.video_swiper-button-prev',
    },
  });

  window.addEventListener('resize', () => {
    galleryPhotosSwiper.update();
  });

  window.addEventListener('resize', () => {
    galleryViewsSwiper.update();
  });

  window.addEventListener('resize', () => {
    galleryVideosSwiper.update();
  });
});

// iframe
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loadIframeButton').addEventListener('click', function() {
    // Заменяем URL iframe на реальный
    var iframe = document.getElementById('lazyIframe');
    iframe.src = 'https://widget.thefloors.io/363/';
    iframe.style.display = 'block';

    // Скрываем кнопку после загрузки iframe
    this.style.display = 'none';
    document.querySelector('.iframe__container').classList.add('active-iframe');
  });
});
//construction and news
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.construction_news__btn');
  const displays = document.querySelectorAll('.construction_news__wrapper');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(btn => btn.classList.remove('active'));

      button.classList.add('active');

      const targetId = button.id;

      displays.forEach(display => display.classList.remove('active'));

      const targetDisplay = document.querySelector(
        `.construction_news__wrapper[data-for="${targetId}"]`,
      );

      if (targetDisplay) {
        targetDisplay.classList.add('active');
      }
    });
  });

  const constructionSwiper = new Swiper('.construction__slider', {
    direction: 'horizontal',
    loop: false,
    slidesPerView: '1',
    spaceBetween: 0,
    navigation: {
      nextEl: '.construction__swiper-button-next',
      prevEl: '.construction__swiper-button-prev',
    },
    breakpoints: {
      360: {
        slidesPerView: 1,
      },
      1024: {
        slidesPerView: 'auto',
        spaceBetween: 12,
      },
    },
  });

  const newsSwiper = new Swiper('.news__slider', {
    direction: 'horizontal',
    loop: false,
    slidesPerView: '1',
    spaceBetween: 0,
    navigation: {
      nextEl: '.news__swiper-button-next',
      prevEl: '.news__swiper-button-prev',
    },
  });
});
{
  // Button Douwn
  document.querySelector('[data-scroll-down]').addEventListener('click', function(evt) {
    document.querySelector('.lavanda-park').scrollIntoView({ behavior: 'smooth' });
  });

  const animationItemSelectors = ['.section-text', '.left-side__header'];

  animationItemSelectors.forEach(selector => {
    intersectionObserver(selector, () => {
      splitToLinesAndFadeUp(selector);
    });
  });

  // function animateValue(obj, start, end, duration) {
  //   let startTimestamp = null;
  //   const step = timestamp => {
  //     if (!startTimestamp) startTimestamp = timestamp;
  //     const progress = Math.min((timestamp - startTimestamp) / duration, 1);
  //     obj.innerHTML = Math.floor(progress * (end - start) + start);
  //     if (progress < 1) {
  //       window.requestAnimationFrame(step);
  //     }
  //   };
  //   window.requestAnimationFrame(step);
  // }

  // let tl2 = gsap.timeline();
  // tl2.to('#scrollingText', {
  //   x: 100,
  //   duration: 20,
  //   repeat: -1,
  //   ease: 'linear',
  // });
  // let tl = gsap.timeline();
  // tl.to('#scrollingText', {
  //   xPercent: 30,
  //   scrollTrigger: {
  //     trigger: '.stocks-section',
  //     scrub: 1,
  //   },
  // });

  // gsap.to(document.querySelectorAll('img'), {
  //   yPercent: 10,
  //   ease: 'none',
  //   scrollTrigger: {
  //     trigger: '.start-section',
  //     // start: "top bottom", // the default values
  //     // end: "bottom top",
  //     scrub: true,
  //   },
  // });

  document.addEventListener('DOMContentLoaded', () => {
    // Движение кастомного курсора по слайдеру
    // const $slider = $('.js-slider');
    // $slider.on('mouseover', startMoveInCursor);
    // $slider.on('mouseout', stopMoveInCursor);
    const $customCursor = $('.js-slider-controller');
    // let slider = null;

    // const sliderConfig = {
    //   speed: 400,
    //   // autoHeight: true,
    //   autoHeight: false,
    //   slidesPerView: 1.15,
    //   freeMode: true,
    //   adaptiveHeight: true,
    //   allowTouchMove: true,
    //   pagination: {
    //     el: '.swiper-pagination',
    //     type: 'fraction',
    //   },
    //   navigation: {
    //     nextEl: '.slider-section-next',
    //     prevEl: '.slider-section-prev',
    //   },
    //   on: {
    //     init: e => {
    //       let { slides } = e;
    //       slides = slides.filter(el => !el.classList.contains('swiper-slide-duplicate'));
    //       document.querySelector('.slider-section .slider-section__all-slides').textContent =
    //         slides.length;
    //     },
    //     activeIndexChange: e => {
    //       document.querySelector('.slider-section .slider-section__curr-slide').textContent =
    //         e.realIndex + 1;
    //     },
    //   },
    //   breakpoints: {
    //     360: {
    //       slidesPerView: 1,
    //       spaceBetween: 40,
    //     },
    //     1024: {
    //       slidesPerView: 1.15,
    //       spaceBetween: 50,
    //     },
    //   },
    // };

    // const slider = new Swiper('.swiper', sliderConfig);

    // sideSwitchArrow(
    //   {
    //     onNext: () => {
    //       slider.slideNext();
    //     },
    //     onPrev: () => {
    //       slider.slidePrev();
    //     },
    //   },
    //   $customCursor[0],
    //   document.querySelector('.js-slider-wrapper'),
    // );
    // function stopMoveInCursor(e) {
    //   e.stopPropagation();
    //   $customCursor.removeClass('active');
    //   document.onmousemove = null;
    // }

    // function sideSwitchArrow(opts, arrowArgs, conArgs) {
    //   const isMobile = window.matchMedia('(max-width:1024px)').matches;
    //   const arrow = arrowArgs;
    //   const container = conArgs;
    //   const mediumCordValue = document.documentElement.clientWidth / 2;
    //   // document.body.append(arrow);
    //   container.style.cursor = 'none';
    //   arrow.style.cursor = 'none';
    //   arrow.style.zIndex = 10;
    //   arrow.__proto__.hide = function some() {
    //     this.style.opacity = '0';
    //     this.style.pointerEvents = 'none';
    //   };
    //   arrow.__proto__.show = function some() {
    //     this.style.opacity = '1';
    //   };
    //   arrow.dataset.side = 'leftSide';
    //   arrow.hide();

    //   container.addEventListener('mousemove', desktopNavButtonHandler);
    //   container.addEventListener('mouseenter', () => {
    //     arrow.show();
    //     arrow.classList.add('active');
    //   });
    //   container.addEventListener('mouseleave', () => {
    //     arrow.hide();
    //     arrow.classList.remove('active');
    //   });
    //   if (document.documentElement.clientWidth < 1025) {
    //     window.removeEventListener('mousemove', desktopNavButtonHandler);
    //     arrow.remove();
    //   }

    //   /** Записывает координаты обьекта, на котором нужно скрыть стрелку переключения слайдера */
    //   /** ms ---> main-screen */

    //   function desktopNavButtonHandler(evt) {
    //     // arrow.style.transform = `translate(${evt.clientX - 18}px, ${evt.clientY - 18}px)`;
    //     // arrow.style.transform = `translate(${evt.clientX - 120}px, ${evt.offsetY}px)`;
    //     arrow.style.left = `${evt.clientX - 120}px`;
    //     arrow.style.top = `${evt.offsetY}px`;

    //     getCursorSide(evt.clientX);
    //     handleArrowVisibility(evt);
    //   }

    //   function handleArrowVisibility() {}

    //   function getCursorSide(x) {
    //     if (x < mediumCordValue) {
    //       arrow.classList.add('left-side');
    //       arrow.dataset.side = 'leftSide';
    //     } else {
    //       arrow.classList.remove('left-side');
    //       arrow.dataset.side = 'rightSide';
    //     }
    //   }
    //   container.addEventListener('click', () => {
    //     if (isMobile && !opts.notOnMobile) return;
    //     switchGallerySlide(arrow.dataset.side);
    //   });
    //   const navigate = {
    //     leftSide: () => {
    //       opts.onPrev();
    //     },
    //     rightSide: () => {
    //       opts.onNext();
    //     },
    //   };

    //   function switchGallerySlide(side) {
    //     navigate[side]();
    //     return navigate.side;
    //   }

    //   // eslint-disable-next-line no-unused-vars
    // }
  });
  // let prevIndex = 0;
  // const swiper1 = new Swiper('.advantages-slider', {
  //   grabCursor: true,
  //   loop: true,
  //   keyboard: true,
  //   spaceBetween: 50,
  //   // initialSlide: 0,
  //   preloadImages: false,
  //   lazy: true,
  //   height: 600,
  //   centeredSlides: false,
  //   watchSlidesVisibility: true,
  //   allowTouchMove: false,
  //   speed: 1250,
  //   on: {
  //     init: e => {
  //       let { slides } = e;
  //       slides = slides.filter(el => !el.classList.contains('swiper-slide-duplicate'));
  //       document.querySelector('.advantages-section .first-column__all-slides').textContent =
  //         slides.length;
  //     },
  //     beforeTransitionStart: e => {
  //       // console.log(e);
  //       // console.log(prevIndex, e.realIndex);
  //       // console.log((prevIndex < e.realIndex) ? 'next' : 'prev');
  //       // const direction = e.touches.startX > e.touches.currentX ? 'forward' : 'backward';
  //       // console.log(direction);
  //       // // debugger
  //       // const item = document.querySelector('.advantages-slider .swiper-slide-prev img');
  //       // item.style.transition = '.1s ease-out';
  //       // item.style.opacity = 0;
  //       // setTimeout(() => {
  //       //   item.style.opacity = 1;
  //       // }, 1000);
  //       // prevIndex = e.realIndex;
  //     },
  //     activeIndexChange: e => {
  //       // console.log(e);
  //       document.querySelector('.advantages-section .first-column__curr-slide').textContent =
  //         e.realIndex + 1;
  //     },
  //   },
  //   breakpoints: {
  //     1400: {
  //       autoHeight: true,
  //       slidesPerView: 1.75,
  //     },
  //     768: {
  //       initialSlide: 1,
  //       autoHeight: true,
  //       slidesPerView: 1.75,
  //       centeredSlides: false,
  //     },
  //     360: {
  //       spaceBetween: 0,
  //       slidesPerView: 1,
  //       autoHeight: true,
  //       centeredSlides: false,
  //     },
  //   },
  //   simulateTouch: true,
  //   navigation: {
  //     nextEl: '.advantages-slider-next',
  //     prevEl: '.advantages-slider-prev',
  //   },
  //   pagination: {
  //     el: '.second-column__nav-wrapper',
  //     clickable: true,
  //     type: 'progressbar',
  //   },
  // });
  // document.querySelector('.advantages-slider-next').addEventListener('click', function(evt) {
  //   const item = document.querySelector('.advantages-slider .swiper-slide-prev img');
  //   item.style.transition = '.1s ease-out';
  //   item.style.opacity = 0;
  //   setTimeout(() => {
  //     item.style.opacity = '';
  //   }, 1000);
  // });
  // document.querySelector('.advantages-slider-prev').addEventListener('click', function(evt) {
  //   const item = document.querySelector('.advantages-slider .swiper-slide-active img');
  //   console.log(item);
  //   item.style.transition = '.2s ease-out';
  //   item.style.opacity = 0;
  //   setTimeout(() => {
  //     item.style.opacity = '';
  //   }, 1000);
  // });
  // const swiper2 = new Swiper('.advantages-text-slider', {
  //   grabCursor: true,
  //   loop: true,
  //   keyboard: true,
  //   spaceBetween: 50,
  //   // initialSlide: 0,
  //   preloadImages: false,
  //   lazy: true,
  //   height: 600,
  //   centeredSlides: false,
  //   watchSlidesVisibility: true,
  //   speed: 750,
  //   effect: 'fade',
  //   fadeEffect: {
  //     crossFade: true,
  //   },
  //   breakpoints: {
  //     1400: {
  //       autoHeight: true,
  //       slidesPerView: 1,
  //       noSwiping: false,
  //     },
  //     768: {
  //       initialSlide: 1,
  //       autoHeight: true,
  //       slidesPerView: 1,
  //       centeredSlides: false,
  //       init: false,
  //     },
  //     360: {
  //       spaceBetween: 0,
  //       slidesPerView: 1,
  //       autoHeight: true,
  //       centeredSlides: false,
  //       init: false,
  //     },
  //   },
  //   simulateTouch: true,
  //   navigation: {
  //     nextEl: '.advantages-slider-next',
  //     prevEl: '.advantages-slider-prev',
  //   },
  //   on: {
  //     init: e => {
  //       e.slidesForAnimation = [];
  //       e.titlesForAnimation = [];
  //       document
  //         .querySelectorAll('.advantages-section .first-column__text.section-text')
  //         .forEach(text => {
  //           splitToLines(text);
  //           e.slidesForAnimation.push(text);
  //           console.log(e);
  //         });
  //       document.querySelectorAll('.advantages-section .first-column__header').forEach(text => {
  //         splitToLines(text);
  //         e.titlesForAnimation.push(text);
  //         console.log(e);
  //       });
  //     },
  //     activeIndexChange: e => {
  //       if (!e.slidesForAnimation) return;
  //       const currentText = e.slidesForAnimation[e.activeIndex];
  //       const currentTitle = e.titlesForAnimation[e.activeIndex];
  //       if (!currentText) return;
  //       fadeUpLines(currentText);
  //       fadeUpLines(currentTitle);
  //     },
  //   },
  // });
  // function fadeUpLines(element) {
  //   gsap
  //     .timeline()
  //     .fromTo(
  //       element.querySelectorAll('span>span'),
  //       { yPercent: 100 },
  //       { yPercent: 0, stagger: 0.05, duration: 1, ease: 'power2.out' },
  //     )
  //     .add(() => {
  //       // elementRef.innerHTML = elementRef.textContent;
  //     });
  // }
  // function splitToLines(selector) {
  //   const elementRef = typeof selector === 'string' ? document.querySelector(selector) : selector;
  //   let mathM = elementRef.innerHTML.match(
  //     /<\s*(\w+\b)(?:(?!<\s*\/\s*\1\b)[\s\S])*<\s*\/\s*\1\s*>|\S+/g,
  //   );
  //   if (mathM === null) return;
  //   mathM = mathM.map(el => `<span style="display:inline-flex"><span>${el}</span></span>`);
  //   elementRef.innerHTML = mathM.join(' ');
  //   gsap.set(elementRef, { overflow: 'hidden', opacity: 1 });
  //   gsap.set(elementRef.children, { overflow: 'hidden' });
  //   gsap.set(elementRef.querySelectorAll('span>span'), {
  //     overflow: 'initial',
  //     display: 'inline-block',
  //   });
  // }

  // var init = false;

  // let swiper3 = Swiper;

  // function swiperMode() {
  //   let tablet = window.matchMedia('(max-width: 1024px)');
  //   let desktop = window.matchMedia('(min-width: 1025px)');

  // Enable (for mobile)
  // if (desktop.matches) {
  //   if (!init) {
  //     init = true;
  // swiper3 = new Swiper('.stocks-section-slider', {
  //   grabCursor: true,
  //   loop: true,
  //   keyboard: true,
  //   spaceBetween: 50,
  //   direction: 'vertical',
  //   mousewheel: true,
  //   // initialSlide: 0,
  //   preloadImages: false,
  //   lazy: true,
  //   height: 620,
  //   centeredSlides: false,
  //   watchSlidesVisibility: true,
  //   speed: 300,
  //   breakpoints: {
  //     1024: {
  //       autoHeight: true,
  //       slidesPerView: 1,
  //     },
  //     768: {
  //       initialSlide: 1,
  //       slidesPerView: 2,
  //       loop: false,
  //       autoHeight: false,
  //     },
  //     360: {
  //       spaceBetween: 0,
  //       slidesPerView: 2,
  //       centeredSlides: false,
  //       spaceBetween: 50,
  //       loop: false,
  //       autoHeight: false,
  //     },
  //   },
  //   simulateTouch: true,
  // });
  //   }
  //   return;
  // }

  // Disable (for tablet)
  //   if (tablet.matches) {
  //     init = false;
  //   }
  // }

  // intersectionObserver('.lavanda-park', () => {
  //   const digits = document.querySelectorAll('.lavanda-park [data-count]');
  //   console.log('HI');
  //   digits.forEach(digitForAnim => {
  //     const isDigitInteger = Number.isInteger(+digitForAnim.dataset.count);
  //     gsap.fromTo(
  //       digitForAnim,
  //       {
  //         textContent: 0,
  //       },
  //       {
  //         textContent: (e, target) => {
  //           console.log(target);
  //           return target.dataset.count;
  //         },
  //         duration: 4,
  //         ease: 'power1.out',
  //         snap: { textContent: isDigitInteger ? 1 : 0.1 },
  //         stagger: 0,
  //         // onUpdate: textContent.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
  //       },
  //     );
  //   });
  // });

  /* On Load
   **************************************************************/
  // window.addEventListener('load', function() {
  //   swiperMode();
  // });

  // /* On Resize
  //  **************************************************************/
  // window.addEventListener('resize', function() {
  //   swiperMode();
  // });

  // calmPlaceAnimation();
  // function calmPlaceAnimation() {
  //   gsap.set('.calm-place__img', { clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)' });
  //   intersectionObserver('.calm-place__header', () => {
  //     setTimeout(() => {
  //       gsap
  //         .timeline()
  //         .to('.calm-place__img', {
  //           clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
  //           duration: 1.8,
  //           stagger: 0.15,
  //           transformOrigin: 'center',
  //           clear: 'all',
  //           ease: 'expo.out',
  //         })
  //         .fromTo(
  //           '.calm-place__img img',
  //           {
  //             scale: 1.5,
  //           },
  //           {
  //             scale: 1,
  //             duration: 2.25,
  //             stagger: 0.15,
  //             transformOrigin: 'center',
  //             clear: 'all',
  //             ease: 'expo.out',
  //           },
  //           '<',
  //         );
  //     }, 750);
  //   });
  // }

  // clipPathEntry('.slider-section img', document.body, {}, gsap);

  function screen1Animation() {
    const startClip = 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)';
    const endClip = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%';
    const title = document.querySelector('.first-column__text');
    const text = document.querySelector('.first-column__header');
    splitToLines(title);
    splitToLines(text);

    gsap.set(title.querySelectorAll('span>span'), { yPercent: 100 });
    gsap.set(text.querySelectorAll('span>span'), { yPercent: 100 });
    gsap
      .timeline()
      .add(() => {
        window.dispatchEvent(new Event('preloader-off'));
      })
      .fromTo(
        '.second-column__img, .third-column__img',
        { clipPath: startClip, webkitClipPath: startClip },
        {
          clipPath: endClip,
          webkitClipPath: endClip,
          duration: 2.25,
          delay: 0.5,
          ease: 'power4.out',
          clearProps: 'transform',
        },
      )
      .fromTo(
        '.first-column__btn-link',
        {
          autoAlpha: 0,
          y: 50,
        },
        {
          autoAlpha: 1,
          y: 0,
        },
        '<',
      )
      .add(() => {
        fadeUpLines(title);
        fadeUpLines(text);
      }, '<');
  }
  screen1Animation();
}

//planning
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.planning__btn');
  const displays = document.querySelectorAll('.planning__display');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(btn => btn.classList.remove('active'));

      button.classList.add('active');

      planningOneRoomsSwiper.slideTo(0, 0);
      planningTwoRoomsSwiper.slideTo(0, 0);
      planningCommercialSwiper.slideTo(0, 0);

      const targetId = button.id;

      displays.forEach(display => display.classList.remove('active'));

      const targetDisplay = document.querySelector(`.planning__display[data-for="${targetId}"]`);

      if (targetDisplay) {
        targetDisplay.classList.add('active');
        if (targetId == '1-rooms') {
          document.querySelectorAll('.planning__text.text-anim').forEach(el => {
            el.classList.remove('active');
          });

          document.querySelector(`.planning__text[data-for="one_a"]`).classList.add('active');
        }
        if (targetId == '2-rooms') {
          document.querySelectorAll('.planning__text.text-anim').forEach(el => {
            el.classList.remove('active');
          });

          document.querySelector(`.planning__text[data-for="two_a"]`).classList.add('active');
        }
        if (targetId == 'commercial') {
          document.querySelectorAll('.planning__text.text-anim').forEach(el => {
            el.classList.remove('active');
          });

          document.querySelector(`.planning__text[data-for="com_1"]`).classList.add('active');
        }
      }
    });
  });

  const planningOneRoomsSwiper = new Swiper('.one-rooms .planning__swiper', {
    direction: 'horizontal',
    loop: false,
    slidesPerView: '1',
    spaceBetween: 0,
    pagination: {
      el: '.one-rooms .planning__swiper-pagination',
      type: 'fraction',
    },
    navigation: {
      nextEl: '.one-rooms .planning__swiper-button-next',
      prevEl: '.one-rooms .planning__swiper-button-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
      },
      1025: {
        slidesPerView: 2,
      },
      1366: {
        slidesPerView: 1,
      },
    },
    on: {
      slideChange: function() {
        const activeSlide = this.slides[this.activeIndex];
        const activeId = activeSlide.getAttribute('id');

        // Удалить класс active у всех описаний
        document.querySelectorAll('.planning__text.text-anim').forEach(el => {
          el.classList.remove('active');
        });

        // Добавить класс active только нужному описанию
        const matchingText = document.querySelector(`.planning__text[data-for="${activeId}"]`);
        if (matchingText) {
          matchingText.classList.add('active');
        }
      },
    },
  });

  const planningTwoRoomsSwiper = new Swiper('.two-rooms .planning__swiper', {
    direction: 'horizontal',
    loop: false,
    slidesPerView: '1',
    spaceBetween: 0,
    pagination: {
      el: '.two-rooms .planning__swiper-pagination',
      type: 'fraction',
    },
    navigation: {
      nextEl: '.two-rooms .planning__swiper-button-next',
      prevEl: '.two-rooms .planning__swiper-button-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
      },
      1025: {
        slidesPerView: 2,
      },
      1366: {
        slidesPerView: 1,
      },
    },
    on: {
      slideChange: function() {
        const activeSlide = this.slides[this.activeIndex];
        const activeId = activeSlide.getAttribute('id');

        // Удалить класс active у всех описаний
        document.querySelectorAll('.planning__text.text-anim').forEach(el => {
          el.classList.remove('active');
        });

        // Добавить класс active только нужному описанию
        const matchingText = document.querySelector(`.planning__text[data-for="${activeId}"]`);
        if (matchingText) {
          matchingText.classList.add('active');
        }
      },
    },
  });

  const planningCommercialSwiper = new Swiper('.commercial .planning__swiper', {
    direction: 'horizontal',
    loop: false,
    slidesPerView: '1',
    spaceBetween: 0,
    pagination: {
      el: '.commercial .planning__swiper-pagination',
      type: 'fraction',
    },
    navigation: {
      nextEl: '.commercial .planning__swiper-button-next',
      prevEl: '.commercial .planning__swiper-button-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
      },
      1025: {
        slidesPerView: 2,
      },
      1366: {
        slidesPerView: 1,
      },
    },
    on: {
      slideChange: function() {
        const activeSlide = this.slides[this.activeIndex];
        const activeId = activeSlide.getAttribute('id');

        // Удалить класс active у всех описаний
        document.querySelectorAll('.planning__text.text-anim').forEach(el => {
          el.classList.remove('active');
        });

        // Добавить класс active только нужному описанию
        const matchingText = document.querySelector(`.planning__text[data-for="${activeId}"]`);
        if (matchingText) {
          matchingText.classList.add('active');
        }
      },
    },
  });
});

//

function frontScreenModalHandler() {
  let isInited = false;
  const popup = document.querySelector('[data-front-screen-popup]');
  const videoToCopy = document.querySelector('.start-section .second-column__img');

  videoToCopy.addEventListener('play', () => {
    videoToCopy.style.objectFit = 'cover';
  });

  document.body.addEventListener('click', function(evt) {
    const target = evt.target.closest('[data-front-screen-popup-call]');
    if (!target) return;
    if (!isInited) {
      const node = videoToCopy.cloneNode(true);
      node.setAttribute('controls', true);
      popup.querySelector('.front-screen-modal-content').insertAdjacentElement('afterbegin', node);
      isInited = true;
    }
    if (isInited)
      popup.querySelectorAll('.front-screen-modal-content video').forEach(el => el.play());

    videoToCopy.pause();
    popup.classList.add('active');
  });
  document.body.addEventListener('click', function(evt) {
    const target = evt.target.closest('[data-front-screen-popup-close]');
    if (!target) return;
    popup.classList.remove('active');
    videoToCopy.play();
    popup.querySelectorAll('.front-screen-modal-content video').forEach(el => el.pause());
  });
}

frontScreenModalHandler();

document.addEventListener('DOMContentLoaded', () => {
  const videoContainers = document.querySelectorAll('.video-container');
  console.log(videoContainers);
  videoContainers.forEach(container => {
    const video = container.querySelector('.video-player');
    const playBtn = container.querySelector('.play-button');
    const pauseBtn = container.querySelector('.pause-button');
    console.log(video);
    playBtn.addEventListener('click', () => {
      video.play();
    });

    pauseBtn.addEventListener('click', () => {
      video.pause();
      // Если хочешь сбросить видео в начало:
      // video.currentTime = 0;
    });
  });
});
