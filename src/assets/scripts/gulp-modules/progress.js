// Инициализация rangeSlider

document.querySelectorAll('.js-range-slider').forEach(el => {
  const defaultValue = el.dataset.value;
  $(el).ionRangeSlider({
    type: 'single',
    min: 0,
    max: 100,
    from: +defaultValue,
  });
});

// Реализация появляющегося purple block
$('.js-filter-text').on('click', event => {
  $(event.target)
    .siblings('.purple-block')
    .toggleClass('active');
});

$('.js-purple-close').on('click', event => {
  $(event.target)
    .closest('.purple-block')
    .removeClass('active');
});

// Вызов поп-апа
const progressCards = document.querySelectorAll('.progress-card');
const progressPopUp = document.querySelector('.progress-pop-up');
const closeProgressBtn = document.querySelector('.js-close-progress-pop-up');

window.addEventListener('click', function(evt) {
  if (evt.target.closest('.progress-card') === null) return;
  progressPopUp.classList.add('active');
  body.classList.add('disabled-scroll');
});
// progressCards.forEach(card => {
//   card.addEventListener('click', () => {
//     progressPopUp.classList.add('active');
//     body.classList.add('disabled-scroll');
//   });
// });

closeProgressBtn.addEventListener('click', () => {
  progressPopUp.classList.remove('active');
  body.classList.remove('disabled-scroll');
});

// Инициализация слайдера в поп-апе
const sliderConfig = {
  speed: 400,
  autoHeight: true,
  slidesPerView: 1,
  freeMode: true,
  spaceBetween: 50,
  centeredSlides: true,
  watchSlidesVisibility: true,
  adaptiveHeight: true,
  allowTouchMove: true,
  pagination: {
    el: '.swiper-pagination',
    type: 'fraction',
  },
  // navigation: {
  //   nextEl: '.swiper-button-next',
  //   prevEl: '.swiper-button-prev',
  // },
};

const swiperProgress = new Swiper('.pop-up__slider', sliderConfig);

// Переключение слайдер по клику
const leftBtn = document.querySelector('.left-btn');
const rightBtn = document.querySelector('.right-btn');

leftBtn.addEventListener('click', () => {
  swiperProgress.slidePrev();
});

rightBtn.addEventListener('click', () => {
  swiperProgress.slideNext();
});

/**получение актуальных данных */
buildProgressDataHandler();
function buildProgressDataHandler() {
  if (document.documentElement.dataset.mode === 'local') return;
  const $container = document.querySelector('.progress__cards-wrapper');
  const state = {
    rendered: 2,
    portion: 2,
    data: [],
    loadMore: document.querySelector('.progress__load-more-btn'),
  };

  const getCards = async () => {
    const sendData = new FormData();
    sendData.append('action', 'constructions');
    return fetch('/wp-admin/admin-ajax.php', {
      method: 'POST',
      body: sendData,
    });
  };
  const getSingleCard = async id => {
    const sendData = new FormData();
    sendData.append('action', 'constructions');
    sendData.append('id', id);
    return fetch('/wp-admin/admin-ajax.php', {
      method: 'POST',
      body: sendData,
    });
  };
  getCards()
    .then(res => res.json())
    .then(result => {
      state.data = result;
      render();
    });

  function render(res) {
    $container.innerHTML = '';
    const cards = state.data
      .map((singleCardData, index) => {
        if (index + 1 > state.rendered) return '';
        return $progressCard(singleCardData);
      })
      .join('');
    state.rendered += state.portion;
    $container.insertAdjacentHTML('afterbegin', cards);
    if (document.querySelectorAll('.progress-card').length >= state.data.length) {
      state.loadMore.remove();
    }
  }

  function updatePopupInfo(data, id) {
    const popup = document.querySelector('.progress-pop-up');
    popup.style.opacity = 0;
    const datetitle = document.querySelector('.pop-up__header');
    const text = document.querySelector('.pop-up__list');
    const sliderContainer = document.querySelector('.pop-up__slider');
    const swiper = sliderContainer.swiper;
    const slidesWrapper = sliderContainer.querySelector('.swiper-wrapper');

    const gallery = data.find(item => item.id === Number(id));

    slidesWrapper.innerHTML = gallery.data.gallery
      .map(img => {
        if (!img.match(/png|jpg|svg|jpeg/i)) {
          return `
        <div class="pop-up__slider-slide swiper-slide"> 
          <iframe class="pop-up__slider-img" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen src="${img}" alt="Progress of building"></iframe>
        </div>
        `;
        }
        return `
      <div class="pop-up__slider-slide swiper-slide"> 
        <img class="pop-up__slider-img" src="${img}" alt="Progress of building">
      </div>
      `;
      })
      .join('');
    swiper.update();
    datetitle.innerHTML = `
    <span class="pop-up__header-month">${gallery.data.nameMonth}</span>
    <span class="pop-up__header-year">${gallery.data.year}</span>
    `;
    text.innerHTML = gallery.data.text
      .map(
        part => `
    <li class="pop-up__element">${part}</li>
    `,
      )
      .join('');
    popup.style.opacity = 1;
  }

  window.addEventListener('click', function(evt) {
    if (evt.target.closest('.progress__load-more-btn') === null) return;
    render();
  });
  window.addEventListener('click', function(evt) {
    if (evt.target.closest('[data-card-id]') === null) return;
    const id = evt.target.closest('[data-card-id]').dataset.cardId;

    getSingleCard(id)
      .then(res => res.json())
      .then(res => updatePopupInfo(res, id));
  });

  function $progressCard(data) {
    const base = document.documentElement.dataset.base;
    const imagesCount = data.data.gallery.filter(img => img.match(/\.(jpg|png|svg|jpeg|webp)/))
      .length;
    const videosCount = data.data.gallery.filter(img => !img.match(/\.(jpg|png|svg|jpeg|webp)/))
      .length;
    const imgSrc = data.data.gallery[0];
    const imgSrcMobile =
      data.data.screensaver_mobile_version !== null &&
      data.data.screensaver_mobile_version !== false
        ? data.data.screensaver_mobile_version
        : data.data.gallery[0];
    const isMobile = window.innerWidth <= 1024;
    return `
    <div class="progress-card" data-card-id="${data.id}"> 
      <figure class="progress-card-top"> 
      <img class="progress-card__img" src="${isMobile ? imgSrcMobile : imgSrc}" alt="Card photo"/>
      <img class="progress-card__img-plus" src="${base}/assets/images/progress/plus.svg" alt="Plus"/></figure>
      <div class="progress-card-bottom"> 
        <span class="progress-card__date">${data.data.nameMonth} ${data.data.year}</span>
        <span class="progress-card__numbers"> 
        <span class="progress-card__numbers-info progress-card__numbers-info_video">${videosCount}</span>
        <span class="progress-card__numbers-info progress-card__numbers-info_pages">${imagesCount}</span></span>
      </div>
    </div>
    `;
  }
}
