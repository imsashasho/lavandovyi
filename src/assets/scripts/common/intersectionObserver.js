let options = {
  rootMargin: '-50px',
  threshold: 0,
};

export const intersectionObserver = (selector, onIntersect) => {
  const handleIntersection = entries => {
    const { isIntersecting } = entries[0];

    if (isIntersecting) {
      onIntersect && onIntersect();
      observer.disconnect();
    }
  };

  let observer = new IntersectionObserver(handleIntersection, options);
  let target = document.querySelector(selector);
  // observer.observe(target);
};

export const throttle = (func, ms) => {
  let isThrottled = false,
    savedArgs,
    savedThis;

  function wrapper() {
    if (isThrottled) {
      // (2)
      savedArgs = arguments;
      savedThis = this;
      return;
    }

    func.apply(this, arguments); // (1)

    isThrottled = true;

    setTimeout(function() {
      isThrottled = false; // (3)
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }

  return wrapper;
};
