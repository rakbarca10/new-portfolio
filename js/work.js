window.addEventListener('load', function () {
  gsap.registerPlugin(ScrollTrigger);

  const pageContainer = document.querySelector(".data-scroll-container");

  if (!pageContainer) {
    console.error('Scroll container not found');
    return;
  }

  let scroller;

  // Function to check if device is mobile/tablet
  function isMobile() {
    return window.innerWidth <= 768;
  }

  function initHorizontalScroll(container, scrollerInstance) {
    const pinWrap = document.querySelector(".horizontal-wrap");

    if (!pinWrap) {
      console.error('Horizontal wrap not found');
      return;
    }

    if (isMobile()) {
      console.log("Mobile device detected - skipping horizontal scroll");
      return;
    }

    // Force layout reflow
    pinWrap.offsetWidth;

    const pinWrapWidth = pinWrap.scrollWidth;
    const scrollLength = pinWrapWidth - window.innerWidth;

    if (scrollLength > 0) {
      console.log("Horizontal scroll initialized with scrollLength:", scrollLength);

      ScrollTrigger.killAll();

      gsap.to(".horizontal-wrap", {
        x: -scrollLength,
        ease: "none",
        scrollTrigger: {
          trigger: "#horizontal-section",
          scroller: container,
          start: "top top",
          end: () => `+=${pinWrap.scrollWidth}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    } else {
      console.warn("Not enough content to scroll horizontally.");
    }

    ScrollTrigger.addEventListener("refresh", () => {
      if (scrollerInstance) scrollerInstance.update();
    });

    ScrollTrigger.refresh();
  }

  function initWithoutLocomotive() {
    setTimeout(() => {
      initHorizontalScroll(window, null);
    }, 100);
  }

  if (typeof LocomotiveScroll === 'undefined') {
    console.warn('LocomotiveScroll not available, using fallback');
    initWithoutLocomotive();
    return;
  }

  try {
    scroller = new LocomotiveScroll({
      el: pageContainer,
      smooth: true,
      multiplier: 1,
    });

    scroller.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(pageContainer, {
      scrollTop(value) {
        return arguments.length
          ? scroller.scrollTo(value, 0, 0)
          : scroller.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        };
      },
      pinType: pageContainer.style.transform ? "transform" : "fixed"
    });

    setTimeout(() => {
      initHorizontalScroll(pageContainer, scroller);
    }, 300);

  } catch (error) {
    console.error("LocomotiveScroll failed to initialize", error);
    initWithoutLocomotive();
  }

  // Debounced resize handler
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      if (scroller) scroller.update();
      if (!isMobile()) {
        initHorizontalScroll(pageContainer, scroller);
      }
      ScrollTrigger.refresh();
    }, 300);
  });
});


// Handle single/two item containers for styling
document.querySelectorAll('.product-works').forEach(container => {
  const items = container.querySelectorAll('.project-inside');
  if (items.length === 1) {
    container.classList.add('single-item');
  } else if (items.length === 2) {
    container.classList.add('two-items');
  }
});
