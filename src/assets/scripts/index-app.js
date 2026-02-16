import i18next from 'i18next';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import axios from 'axios';
import * as yup from 'yup';
import FormMonster from '../../pug/components/form/form';
import SexyInput from '../../pug/components/input/input';
import { throttle } from './common/intersectionObserver';
const formsWithTel = ['#call-form'];
const newForm = ['#call-back-form'];

formsWithTel.forEach(form => {
  const $form = document.querySelector(form);
  console.log(form);
  if ($form) {
    /* eslint-disable */
    new FormMonster({
      /* eslint-enable */
      elements: {
        $form,
        showSuccessMessage: false,
        successAction: () => {
          const callBlock = document.querySelector('.call-block');
          const callThanksBlock = document.querySelector('.call-thanks-block');
          callBlock.classList.add('hidden');
          callThanksBlock.classList.add('active');
          callThanksBlock.classList.remove('hidden');
        },
        $btnSubmit: $form.querySelector('[data-btn-submit]'),
        fields: {
          name: {
            inputWrapper: new SexyInput({
              animation: 'none',
              $field: $form.querySelector('[data-field-name]'),
            }),
            rule: yup
              .string()
              .required(i18next.t('required'))
              .trim(),
            defaultMessage: i18next.t('name'),
            valid: false,
            error: [],
          },
          agree: {
            inputWrapper: new SexyInput({
              animation: 'none',
              $field: $form.querySelector('[data-field-agree]'),
            }),
            rule: yup
              .string()
              .nullable()
              .required(i18next.t('required'))
              .trim(),
            defaultMessage: i18next.t('name'),
            valid: false,
            error: [],
          },

          phone: {
            inputWrapper: new SexyInput({
              animation: 'none',
              $field: $form.querySelector('[data-field-phone]'),
              typeInput: 'phone',
            }),
            rule: yup
              .string()
              .required(i18next.t('required'))
              .min(15, i18next.t('field_too_short', { cnt: 19 - 8 })),

            defaultMessage: i18next.t('phone'),
            valid: false,
            error: [],
          },
        },
      },
    });
    // $form.querySelector('.js-mask-absolute').addEventListener('click', () => {
    //   $form.querySelector('[name="phone"]').focus();
    // }, false);
  }
});

newForm.forEach(form => {
  const $form = document.querySelector(form);
  console.log(form);
  if ($form) {
    /* eslint-disable */
    new FormMonster({
      /* eslint-enable */
      elements: {
        $form,
        showSuccessMessage: false,
        successAction: () => {
          const call = document.querySelector('.call');
          const callBlock = document.querySelector('.call-block');
          const callThanksBlock = document.querySelector('.call-thanks-block');
          call.classList.add('active');
          callBlock.classList.add('hidden');
          callThanksBlock.classList.add('active');
          callThanksBlock.classList.remove('hidden');
        },
        $btnSubmit: $form.querySelector('[data-btn-submit]'),
        fields: {
          phone: {
            inputWrapper: new SexyInput({
              animation: 'none',
              $field: $form.querySelector('[data-field-phone]'),
              typeInput: 'phone',
            }),
            rule: yup
              .string()
              .required(i18next.t('required'))
              .min(15, i18next.t('field_too_short', { cnt: 19 - 8 })),

            defaultMessage: i18next.t('phone'),
            valid: false,
            error: [],
          },
        },
      },
    });
    // $form.querySelector('.js-mask-absolute').addEventListener('click', () => {
    //   $form.querySelector('[name="phone"]').focus();
    // }, false);
  }
});

function headerHandle() {
  const header = document.querySelector('.header');
  let prevScrollY = 0;
  const headerChange = () => {
    if (window.scrollY < 175) {
      header.classList.remove('hidden');
      header.classList.remove('not-on-top');
      prevScrollY = window.scrollY;
      return;
    }
    if (prevScrollY > window.scrollY) {
      header.classList.remove('hidden');
      prevScrollY = window.scrollY;
      return;
    }
    header.classList.add('not-on-top');
    header.classList.add('hidden');
    prevScrollY = window.scrollY;
  };
  const throttleHeaderChange = throttle(headerChange, 300);

  window.addEventListener('scroll', throttleHeaderChange);
}
headerHandle();

// Вызов меню
const menuBtn = document.querySelector('.header-btn-menu');
const menu = document.querySelector('.menu');
const body = document.querySelector('body');
const menuCloseBtn = document.querySelector('.js-menu-close');

menuBtn.addEventListener('click', () => {
  menu.classList.add('active');
  body.classList.add('disabled-scroll');
  window.dispatchEvent(new Event('menu-open'));
});

menuCloseBtn.addEventListener('click', () => {
  window.dispatchEvent(new Event('menu-close'));
  gsap
    .timeline()
    .set('.menu', { pointerEvents: 'none' })
    .fromTo(
      '.menu',
      { webkitClipPath: 'circle(150% at 100% 0%)' },
      { webkitClipPath: 'circle(0% at 100% 0%)', duration: 1, ease: 'power4.out' },
    )
    .fromTo(
      '.menu .menu-block__link',
      { y: 0 },
      { y: -50, duration: 0.25, stagger: -0.05, ease: 'power4.out' },
      '<',
    )
    .fromTo(
      '.menu-block__header>*:not(svg)',
      { y: 0, autoAlpha: 1 },
      { y: -50, autoAlpha: 0, stagger: 0.05 },
      '<',
    )
    .fromTo('.menu-block__footer', { y: 0, autoAlpha: 1 }, { y: -50, autoAlpha: 0 }, '<')
    .add(() => {
      menu.classList.remove('active');
      body.classList.remove('disabled-scroll');
    })
    .set('.menu', { pointerEvents: '' });
});

window.addEventListener('menu-open', function(evt) {
  console.log('menu open');
  gsap
    .timeline()
    .fromTo(
      '.menu',
      { webkitClipPath: 'circle(0% at 100% 0%)' },
      { webkitClipPath: 'circle(150% at 100% 0%)', duration: 2, ease: 'power4.out' },
    )
    .fromTo(
      '.menu .menu-block__link',
      { y: -50 },
      { y: 0, duration: 1.25, stagger: -0.05, ease: 'power4.out' },
      '<',
    )
    .fromTo(
      '.menu-block__header>*:not(svg)',
      { y: -50, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, stagger: 0.05 },
      '<',
    )
    .fromTo('.menu-block__footer', { y: -50, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, '<');
});
