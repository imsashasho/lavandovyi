import gsap from 'gsap';

export function splitToLines(selector) {
  const elementRef = typeof selector === 'string' ? document.querySelector(selector) : selector;
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
}

export function fadeUpLines(element, settings = {}) {
  gsap
    .timeline()
    .fromTo(
      element.querySelectorAll('span>span'),
      { yPercent: 100 },
      { yPercent: 0, stagger: 0.05, duration: 1, ease: 'power2.out', ...settings },
    )
    .add(() => {
      // elementRef.innerHTML = elementRef.textContent;
    });
}
