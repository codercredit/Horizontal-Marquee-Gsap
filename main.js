// Ensure GSAP plugins are registered
gsap.registerPlugin(ScrollTrigger);

function horizontalInfiniteMarquee(options) {
  // Default configuration
  const config = {
    marqueeSelector: ".marqueeOne",
    spinningStarSelector: ".spinningStar",
    marqueeDuration: 30,
    spinningRotation: 1440,
    spinningDuration: 40,
    hoverPause: true, // Enable/disable hover pause
  };

  // Merge user-provided options with defaults
  Object.assign(config, options);

  let direction = 1;

  // Ensure the elements exist in the DOM
  const marquee = document.querySelector(config.marqueeSelector);
  const spinningStar = document.querySelector(config.spinningStarSelector);

  // Check if the marquee element exists
  if (marquee) {
    // Marquee animation setup
    const roll1 = roll(config.marqueeSelector, {
      duration: config.marqueeDuration,
    });

    // Scroll trigger for marquee
    ScrollTrigger.create({
      onUpdate(self) {
        if (self.direction !== direction) {
          direction *= -1;
          roll1.timeScale(direction * 15);
          gsap.to([roll1], {
            timeScale: direction,
            overwrite: true,
            duration: 1,
          });
        }
      },
    });

    // Hover pause functionality (if enabled)
    if (config.hoverPause) {
      marquee.addEventListener("mouseenter", () => {
        roll1.pause();
        if (spinningStar) {
          tween.pause(); // Pause the spinning animation
        }
      });
      marquee.addEventListener("mouseleave", () => {
        roll1.resume();
        if (spinningStar) {
          tween.resume(); // Resume the spinning animation
        }
      });
    }
  }

  // Check if the spinning star element exists
  let tween;
  if (spinningStar) {
    // Spinning star animation setup
    tween = gsap.to(config.spinningStarSelector, {
      rotation: config.spinningRotation,
      duration: config.spinningDuration,
      ease: "none",
      repeat: -1,
    });

    // Set initial progress
    tween.progress(0.5);

    // Scroll trigger for spinning star
    ScrollTrigger.create({
      trigger: config.spinningStarSelector,
      start: "center center",
      end: "+=5000",
      onUpdate({ getVelocity }) {
        const velocity = getVelocity();

        let timeScale = 1;
        let endTimeScale = 1;

        if (velocity > 1) {
          timeScale = 1;
        } else {
          timeScale = -1;
          endTimeScale = -1;
        }

        gsap.to(tween, {
          duration: 0.05,
          timeScale: timeScale,
        });

        gsap.to(tween, {
          duration: 0.05,
          timeScale: endTimeScale,
          delay: 1,
        });
      },
    });
  }

  // Marquee rolling animation function
  function roll(targets, vars, reverse) {
    vars = vars || {};
    vars.ease || (vars.ease = "none");
    const tl = gsap.timeline({
        repeat: -1,
        onReverseComplete() {
          this.totalTime(this.rawTime() + this.duration() * 100);
        },
      }),
      elements = gsap.utils.toArray(targets),
      clones = elements.map((el) => {
        let clone = el.cloneNode(true);
        el.parentNode.appendChild(clone);
        return clone;
      }),
      positionClones = () =>
        elements.forEach((el, i) =>
          gsap.set(clones[i], {
            position: "absolute",
            overwrite: false,
            top: el.offsetTop,
            left: el.offsetLeft + (reverse ? -el.offsetWidth : el.offsetWidth),
          })
        );
    positionClones();
    elements.forEach((el, i) =>
      tl.to([el, clones[i]], { xPercent: reverse ? 100 : -100, ...vars }, 0)
    );
    window.addEventListener("resize", () => {
      let time = tl.totalTime();
      tl.totalTime(0);
      positionClones();
      tl.totalTime(time);
    });
    return tl;
  }
}

// Wait for DOM content to load before initializing
document.addEventListener("DOMContentLoaded", () => {
  horizontalInfiniteMarquee({
    marqueeSelector: ".marqueeOne",
    spinningStarSelector: ".spinningStar",
    marqueeDuration: 40, // Speed up marquee scrolling
    spinningRotation: 720, // Reduce spin amount
    spinningDuration: 20, // Make spinning faster
    hoverPause: true, // Enable pause on hover
  });
});




// Another Part


// Register GSAP plugins
if (gsap && gsap.registerPlugin) {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Initializes a horizontal infinite marquee animation with optional spinning elements.
 * @param {Object} options - Configuration options for the marquee.
 * @param {string} options.marqueeSelector - CSS selector for the marquee container.
 * @param {string} options.spinningStarSelector - CSS selector for the spinning element.
 * @param {number} options.marqueeDuration - Duration for one full marquee scroll.
 * @param {number} options.spinningRotation - Total rotation for the spinning element.
 * @param {number} options.spinningDuration - Duration for one full spin of the spinning element.
 * @param {boolean} options.hoverPause - Whether the animation should pause on hover.
 */
function initializeHorizontalInfiniteMarquee(options) {
  // Default configuration
  const defaultConfig = {
    marqueeSelector: ".marqueeOne",
    spinningStarSelector: ".spinningStar",
    marqueeDuration: 30,
    spinningRotation: 1440,
    spinningDuration: 40,
    hoverPause: true,
  };

  // Merge user options with defaults
  const config = { ...defaultConfig, ...options };
  let direction = 1; // Direction of marquee animation

  // Select marquee and spinning star elements
  const marqueeElement = document.querySelector(config.marqueeSelector);
  const spinningStarElement = document.querySelector(config.spinningStarSelector);

  // Handle marquee animation
  if (marqueeElement) {
    const marqueeAnimation = createRollingAnimation(config.marqueeSelector, {
      duration: config.marqueeDuration,
    });

    // Update marquee animation direction based on scroll
    ScrollTrigger.create({
      onUpdate(self) {
        if (self.direction !== direction) {
          direction *= -1;
          marqueeAnimation.timeScale(direction);
        }
      },
    });

    // Pause/resume marquee on hover
    if (config.hoverPause) {
      marqueeElement.addEventListener("mouseenter", () => {
        marqueeAnimation.pause();
        if (spinningStarElement && spinningStarAnimation) {
          spinningStarAnimation.pause();
        }
      });

      marqueeElement.addEventListener("mouseleave", () => {
        marqueeAnimation.resume();
        if (spinningStarElement && spinningStarAnimation) {
          spinningStarAnimation.resume();
        }
      });
    }
  }

  // Handle spinning star animation
  let spinningStarAnimation;
  if (spinningStarElement) {
    spinningStarAnimation = gsap.to(config.spinningStarSelector, {
      rotation: config.spinningRotation,
      duration: config.spinningDuration,
      ease: "none",
      repeat: -1,
    });

    // Set initial spin progress
    spinningStarAnimation.progress(0.5);

    // Adjust spin speed based on scroll velocity
    ScrollTrigger.create({
      trigger: config.spinningStarSelector,
      start: "center center",
      end: "+=5000",
      onUpdate({ getVelocity }) {
        const velocity = getVelocity();
        const timeScale = velocity > 0 ? 1 : -1;

        gsap.to(spinningStarAnimation, {
          timeScale,
          duration: 0.05,
        });
      },
    });
  }

  /**
   * Creates a rolling animation for a marquee effect.
   * @param {string} targets - CSS selector for the elements to animate.
   * @param {Object} vars - GSAP animation parameters.
   * @param {boolean} reverse - Reverse direction of the rolling animation.
   * @returns {Object} - GSAP timeline instance.
   */
  function createRollingAnimation(targets, vars, reverse = false) {
    vars.ease = vars.ease || "none";
    const timeline = gsap.timeline({
      repeat: -1,
      onReverseComplete() {
        this.totalTime(this.rawTime() + this.duration() * 100);
      },
    });

    const elements = gsap.utils.toArray(targets);
    const clones = elements.map((el) => {
      const clone = el.cloneNode(true);
      el.parentNode.appendChild(clone);
      return clone;
    });

    const positionClones = () => {
      elements.forEach((el, i) => {
        gsap.set(clones[i], {
          position: "absolute",
          top: el.offsetTop,
          left: el.offsetLeft + (reverse ? -el.offsetWidth : el.offsetWidth),
        });
      });
    };

    positionClones();

    elements.forEach((el, i) => {
      timeline.to([el, clones[i]], { xPercent: reverse ? 100 : -100, ...vars }, 0);
    });

    window.addEventListener("resize", () => {
      const currentTime = timeline.totalTime();
      timeline.totalTime(0);
      positionClones();
      timeline.totalTime(currentTime);
    });

    return timeline;
  }
}

// Initialize the marquee after DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeHorizontalInfiniteMarquee({
    marqueeSelector: ".marqueeOne",
    spinningStarSelector: ".spinningStar",
    marqueeDuration: 40,
    spinningRotation: 720,
    spinningDuration: 20,
    hoverPause: true,
  });
});
