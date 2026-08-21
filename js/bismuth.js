/* ------------------------------------------------------------
   1. CAROUSEL CLASS (shared by inline carousel and lightbox)
   ------------------------------------------------------------ */
class Carousel {
  constructor(container, options = {}) {
    this.container = container;
    this.type = options.type || 'slides';
    this.currentIndex = 0;

    if (this.type === 'slides') {
      this.slides = [...container.querySelectorAll('.slide')];
    } else if (this.type === 'lightbox') {
      this.items = options.items || [];
      this.imageElement = container.querySelector('#lightbox-img');
      this.captionElement = container.querySelector('#lightbox-caption');
    }

    this.init();
  }

  init() {
    const prevBtn = this.container.querySelector('[data-carousel-button="prev"], .carousel-prev');
    const nextBtn = this.container.querySelector('[data-carousel-button="next"], .carousel-next');

    if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
    if (nextBtn) nextBtn.addEventListener('click', () => this.next());

    // KEYBOARD SUPPORT FOR LIGHTBOX
    if (this.type === 'lightbox') {
      document.addEventListener('keydown', (e) => {
        if (!this.container.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') this.prev();
        if (e.key === 'ArrowRight') this.next();
      });
    }

    // INLINE CAROUSEL
    if (this.type === 'slides') this.update();
  }

  next() {
    this.goTo(this.currentIndex + 1);
  }

  prev() {
    this.goTo(this.currentIndex - 1);
  }

  goTo(index) {
    const total = this.type === 'slides' ? this.slides.length : this.items.length;
    if (total === 0) return;
    this.currentIndex = (index + total) % total;
    this.update();
  }

  update() {
    if (this.type === 'slides') {
      this.slides.forEach((slide, i) => {
        const iframe = slide.querySelector('iframe');
        if (iframe) {
          const isActive = slide === this.slides[this.currentIndex];
          if (!isActive) {
          iframe.contentWindow?.postMessage(
            '{"event":"command","func":"pauseVideo","args":""}',
            '*'
          );
        }
      }

        if (i === this.currentIndex) slide.setAttribute('data-active', '');
        else slide.removeAttribute('data-active');
      });
    } else {
      const item = this.items[this.currentIndex];
      if (this.imageElement) {
        this.imageElement.src = item.src;
        this.imageElement.alt = item.alt || '';
      }
      if (this.captionElement) {
      const item = this.items[this.currentIndex];
      const counterText = `${this.currentIndex + 1} / ${this.items.length}`;

      if (item.link) {
        this.captionElement.innerHTML = `<a href="${item.link}" target="_blank" rel="noopener">${counterText} – ${item.title}</a>`;
        } else {
          this.captionElement.textContent = counterText + (item.alt ? ' – ' + item.alt : '');
        }
      }
    }
  }
}

/* ------------------------------------------------------------
   2. TIMELINE REVEAL
   ------------------------------------------------------------ */
const initTimeline = () => {
  const timelineBlocks = document.querySelectorAll('.cd-timeline-block');

  if (!timelineBlocks.length) return;

  const revealTimelineBlocks = () => {
    const triggerBottom = window.innerHeight * 0.85;
    const triggerTop = window.innerHeight * 0.15;

    timelineBlocks.forEach((block) => {
      const rect = block.getBoundingClientRect();
      if (rect.top < triggerBottom && rect.bottom > triggerTop) {
        block.classList.add('is-visible');
      } else {
        block.classList.remove('is-visible');
      }
    });
  };

  revealTimelineBlocks();
  window.addEventListener('scroll', revealTimelineBlocks, { passive: true });
};

/* ------------------------------------------------------------
   3. MAIN DOMCONTENTLOADED INITIALIZATION
   ------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  // ===== BEE ARROW SVG =====
  const arrowSVG = `<svg class="arrow-icon" viewBox="0 0 4000 4000" preserveAspectRatio="xMidYMid meet">
<path fill="currentColor" d="M1965.63 3741.41 c-19.53 -10.16 -119.14 -87.89 -187.11 -145.70 -47.27 -41.02 -77.34 -72.66 -74.61 -79.69 1.95 -6.25 62.11 -55.08 96.88 -78.52 86.72 -58.59 162.11 -81.25 237.89 -71.09 80.47 10.94 161.33 47.27 241.41 108.20 l16.41 12.50 -12.50 20.31 c-23.83 37.11 -72.66 82.03 -199.22 181.64 -58.20 45.70 -82.42 60.94 -95.31 60.94 -3.91 0 -14.45 -3.91 -23.83 -8.59z"/><path fill="currentColor" d="M1602.34 3273.44 l-20.70 -78.13 31.64 -34.77 c66.02 -71.88 165.23 -155.47 223.83 -187.89 57.42 -31.64 120.31 -50.78 168.75 -50.78 73.44 0 164.45 33.98 251.95 94.14 33.98 23.05 111.72 88.28 137.50 115.23 l14.45 15.23 -22.66 85.94 c-12.50 47.27 -24.22 85.94 -26.17 85.94 -1.95 0 -16.80 -8.59 -32.81 -19.53 -70.31 -46.09 -160.94 -83.59 -236.33 -97.66 -69.14 -12.89 -162.89 -7.03 -228.52 14.06 -63.28 20.70 -160.94 75.39 -215.23 121.09 -10.16 8.59 -19.92 15.23 -21.88 15.23 -1.56 0 -12.50 -35.16 -23.83 -78.13z"/><path fill="currentColor" d="M564.45 3146.48 c-11.33 -10.94 -11.72 -11.72 -3.91 -33.59 7.81 -22.27 30.08 -57.81 100.78 -161.72 81.25 -119.14 78.91 -116.41 112.89 -126.95 87.11 -26.56 178.91 -94.92 257.03 -192.19 56.25 -69.92 171.48 -235.55 239.06 -344.53 17.19 -27.73 59.77 -101.56 94.53 -164.06 73.44 -131.64 117.58 -203.52 165.23 -268.75 l33.98 -46.48 8.59 14.45 c12.50 20.70 9.38 33.59 -39.45 148.05 -13.67 32.42 -41.80 100.78 -62.11 152.34 -20.31 51.56 -50 123.83 -66.02 160.16 -16.02 36.72 -47.66 114.84 -71.09 173.83 -23.05 58.98 -53.13 135.55 -67.19 169.92 -37.11 91.41 -161.33 337.11 -191.02 377.34 -52.34 71.48 -132.81 104.30 -292.97 120.70 -96.88 9.77 -125.78 14.06 -167.58 23.83 -39.45 9.38 -39.45 9.38 -50.78 -2.34z"/><path fill="currentColor" d="M3359.38 3148.44 c-30.86 -8.20 -80.08 -15.23 -177.73 -25.39 -129.69 -13.67 -203.52 -40.23 -255.47 -91.02 -26.95 -26.56 -35.55 -41.02 -110.55 -185.55 -78.91 -152.34 -80.08 -155.08 -180.86 -410.94 -13.67 -34.38 -42.58 -104.69 -64.45 -156.25 -21.88 -51.56 -51.95 -124.61 -66.41 -162.11 -14.45 -37.50 -42.58 -106.64 -61.72 -153.13 -19.53 -46.48 -38.28 -94.53 -41.02 -106.25 -5.47 -20.70 -5.47 -21.88 3.91 -35.55 l9.77 -14.45 29.69 40.63 c58.98 80.08 86.33 124.61 178.52 289.84 72.27 130.08 169.53 283.59 259.38 408.59 115.23 160.94 213.28 246.09 321.48 278.91 27.34 8.59 29.30 9.77 51.17 37.89 28.52 36.33 139.06 201.56 155.08 231.64 26.17 50 8.59 68.36 -50.78 53.13z"/><path fill="currentColor" d="M1523.83 2950.39 c-4.69 -25.39 -10.94 -63.67 -13.67 -85.16 l-5.47 -38.67 23.83 -25.78 c162.89 -174.61 260.55 -251.56 364.06 -285.94 23.44 -7.81 35.16 -8.98 83.98 -8.98 61.33 0 78.91 3.13 135.94 25.39 42.19 16.41 108.20 56.25 159.38 96.88 23.44 18.36 78.52 69.53 122.27 113.28 l79.30 79.69 -2.73 28.13 c-1.56 15.23 -5.47 44.92 -8.98 65.63 l-6.64 37.89 -39.06 -31.25 c-108.98 -87.50 -216.41 -141.41 -322.27 -161.72 -50.39 -9.38 -136.72 -8.59 -185.55 2.34 -108.59 23.44 -213.28 85.55 -340.23 201.56 l-35.94 32.42 -8.20 -45.70z"/><path fill="currentColor" d="M102.73 2883.98 c-8.59 -3.13 -5.47 -15.63 18.75 -72.27 32.42 -76.17 42.97 -95.31 73.83 -132.42 48.83 -58.98 118.75 -118.75 287.11 -245.70 49.61 -37.11 110.16 -83.98 134.77 -103.52 69.14 -54.69 224.61 -174.22 304.69 -234.38 201.95 -151.56 395.31 -303.52 492.58 -387.11 38.28 -33.20 71.48 -56.25 80.08 -56.25 2.34 0 7.81 13.67 12.89 30.47 4.69 16.41 16.41 46.48 25.78 66.02 l17.19 36.33 -30.86 40.63 c-59.77 79.30 -102.34 148.44 -181.64 293.36 -65.63 119.92 -128.52 219.53 -235.55 373.05 -128.52 183.98 -206.25 259.38 -313.67 302.34 -55.47 22.66 -103.91 30.08 -316.02 49.22 -167.97 15.23 -193.36 17.97 -261.33 31.64 -51.17 10.16 -96.09 14.06 -108.59 8.59z"/><path fill="currentColor" d="M3773.44 2876.95 c-66.41 -14.06 -112.50 -19.92 -263.67 -33.20 -226.56 -19.92 -282.03 -30.08 -352.34 -64.45 -67.19 -32.81 -138.28 -95.31 -202.73 -178.13 -99.61 -127.34 -241.80 -344.92 -317.97 -485.94 -65.23 -120.70 -125.39 -218.36 -177.73 -287.11 -16.02 -21.09 -29.30 -40.23 -29.30 -42.19 0 -1.95 7.03 -18.36 15.23 -36.33 8.59 -17.97 19.14 -46.09 23.83 -62.11 4.69 -16.02 8.98 -31.64 10.16 -34.38 2.73 -8.59 30.08 8.59 80.08 51.17 104.30 87.89 304.69 245.70 503.13 396.48 80.86 61.33 186.33 142.58 234.77 180.47 48.44 37.89 135.55 104.69 193.36 148.44 149.61 112.50 192.19 147.27 250.39 205.08 58.59 58.20 76.56 84.77 109.38 160.55 33.20 76.56 34.38 80.47 26.17 86.33 -10.16 7.81 -52.73 5.47 -102.73 -4.69z"/><path fill="currentColor" d="M1505.47 2556.64 c1.56 -12.89 7.42 -43.36 12.50 -67.97 22.66 -101.56 49.61 -157.81 99.22 -207.81 66.02 -66.02 160.55 -117.58 311.72 -169.92 l59.77 -20.70 63.28 21.88 c153.91 52.73 248.83 105.08 316.41 174.22 33.98 34.77 62.89 92.19 82.42 162.89 12.11 45.31 27.73 124.22 25 126.95 -0.78 0.78 -18.75 -14.45 -40.23 -33.98 -207.03 -186.33 -414.45 -250.39 -605.08 -186.33 -95.70 32.03 -195.31 97.27 -294.92 192.58 l-32.42 31.64 2.34 -23.44z"/><path fill="currentColor" d="M1900.39 2035.16 c-73.44 -13.28 -108.20 -28.52 -166.02 -71.88 -105.86 -79.30 -194.14 -219.14 -215.23 -340.63 -6.25 -36.72 -2.34 -116.80 7.81 -155.86 19.14 -73.83 70.70 -153.52 154.30 -238.28 41.80 -42.97 51.17 -50 80.47 -64.06 18.36 -8.98 51.17 -20.70 73.05 -26.17 39.84 -9.77 40.63 -9.77 76.17 -3.91 44.92 7.81 112.50 7.81 155.47 0.39 46.88 -8.20 62.11 -7.42 98.05 5.86 50.78 18.36 80.08 37.11 122.27 77.73 91.41 89.06 144.92 172.66 167.58 262.11 12.11 49.61 11.33 125.39 -1.95 175.78 -28.52 106.25 -103.13 223.05 -185.16 289.06 -88.28 71.09 -148.44 92.58 -267.19 96.09 -44.92 1.17 -65.63 0 -99.61 -6.25z"/><path fill="currentColor" d="M1692.58 1115.63 c-49.22 -12.11 -89.45 -41.41 -110.55 -81.25 -12.11 -21.88 -13.67 -28.52 -14.84 -62.50 -1.56 -32.03 0 -42.97 8.59 -73.44 17.97 -62.11 41.02 -99.61 103.13 -166.80 67.19 -73.05 139.84 -121.48 213.67 -142.58 27.34 -7.81 39.84 -8.98 97.66 -8.59 60.55 0 69.53 1.17 100.78 10.55 71.88 22.27 129.69 60.16 196.88 128.91 73.05 75 101.95 121.88 118.75 192.97 15.23 63.67 4.69 112.11 -33.20 152.73 -31.25 33.59 -84.77 55.47 -134.77 55.47 -22.66 0 -26.17 -1.17 -53.91 -19.92 -61.33 -41.41 -108.59 -57.42 -180.47 -60.55 -78.52 -3.52 -140.23 13.28 -206.64 57.03 -33.98 22.66 -36.33 23.44 -60.16 23.05 -13.67 0 -33.59 -2.34 -44.92 -5.08z"/><path fill="currentColor" d="M1714.84 583.59 c-94.14 -59.77 -110.94 -76.17 -116.80 -113.67 -3.91 -26.56 0.39 -49.22 23.05 -120.31 25 -79.30 31.25 -95.70 36.33 -95.70 7.42 0 -1.17 43.75 -17.19 85.55 -27.73 72.66 -34.77 94.92 -34.77 112.50 0 38.28 16.02 55.86 108.20 118.36 34.77 23.83 63.67 44.14 63.67 45.31 0 5.86 -16.02 -2.34 -62.50 -32.03z"/><path fill="currentColor" d="M2199.22 615.23 c0 -1.17 23.05 -17.19 50.78 -35.55 73.44 -48.05 106.64 -75.39 116.80 -96.09 13.67 -28.13 10.55 -44.92 -20.70 -123.44 -14.45 -35.94 -29.69 -88.28 -29.69 -101.95 0 -8.98 7.03 -3.52 13.28 10.55 15.63 34.77 50 152.73 51.95 176.95 3.91 50 -15.23 72.66 -114.45 135.16 -51.95 32.42 -67.97 40.63 -67.97 34.38z"/>
</svg>`;

document.querySelectorAll('.carousel-btn').forEach(btn => {
  btn.innerHTML = arrowSVG;
});
  
  // ===== NAVBAR / MOBILE MENU =====
  const navbar = document.getElementById('navbar');
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenuButton.classList.toggle('active');
      if (mobileMenu.classList.contains('open')) {
        mobileMenu.style.height = '0';
        mobileMenu.classList.remove('open');
      } else {
        mobileMenu.classList.add('open');
        mobileMenu.style.height = `${mobileMenu.scrollHeight}px`;
      }
    });
  }

  if (mobileNavLinks.length) {
    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (mobileMenuButton) mobileMenuButton.classList.remove('active');
        if (mobileMenu) {
          mobileMenu.style.height = '0';
          mobileMenu.classList.remove('open');
        }
      });
    });
  }

  // NAVBAR SCROLL EFFECT
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // ===== SMOOTH SCROLL FOR NAV LINKS =====
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return;

      e.preventDefault();
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 70; // navbar height
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });

        targetSection.classList.add('section-highlight');
        setTimeout(() => targetSection.classList.remove('section-highlight'), 1000);
      }
    });
  });

  // ===== DROPDOWN =====
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach((dropdown) => {
    const select = dropdown.querySelector('.select');
    const caret = dropdown.querySelector('.caret');
    const menu = dropdown.querySelector('.menu');
    const options = dropdown.querySelectorAll('.menu li');
    const selected = dropdown.querySelector('.selected');

    if (!select || !menu) return;

    select.addEventListener('click', () => {
      select.classList.toggle('select-clicked');
      if (caret) caret.classList.toggle('caret-rotate');
      menu.classList.toggle('menu-open');
    });

    options.forEach((option) => {
      option.addEventListener('click', () => {
        if (selected) selected.innerText = option.innerText;
        select.classList.remove('select-clicked');
        if (caret) caret.classList.remove('caret-rotate');
        menu.classList.remove('menu-open');
        options.forEach((opt) => opt.classList.remove('active'));
        option.classList.add('active');
      });
    });
  });

  // ===== INLINE PAGE CAROUSEL =====
  const inlineCarousel = document.querySelector('.carousel');
  if (inlineCarousel) {
    new Carousel(inlineCarousel, { type: 'slides' });
  }

  // ===== LIGHTBOX =====
  const lightboxEl = document.getElementById('lightbox');
  if (lightboxEl) {
    const groups = {};
    const triggers = document.querySelectorAll('[data-lightbox-group]');

    triggers.forEach((trigger) => {
      const groupName = trigger.getAttribute('data-lightbox-group');
      const img = trigger.querySelector('img');
      if (!groupName || !img) return;

      const link = trigger.getAttribute('data-link') || '';
      const title = trigger.getAttribute('data-title') || 'View Game';
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push({ src: img.src/*, alt: img.alt*/ || '', link, title });
    });

    // LIGHTBOX CAROUSEL
    const lightboxCarousel = new Carousel(lightboxEl, {
      type: 'lightbox',
      items: [],
    });

    // OPEN LIGHTBOX
    triggers.forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const groupName = trigger.getAttribute('data-lightbox-group');
        const img = trigger.querySelector('img');
        if (!groupName || !img || !groups[groupName]) return;

        const index = groups[groupName].findIndex((item) => item.src === img.src);
        lightboxCarousel.items = groups[groupName];
        lightboxCarousel.goTo(index >= 0 ? index : 0);
        lightboxEl.classList.add('active');
      });
    });

    // CLOSE LIGHTBOX
    const lightboxClose = document.getElementById('lightbox-close');
    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => {
        lightboxEl.classList.remove('active');
      });
    }

    lightboxEl.addEventListener('click', (e) => {
      if (e.target === lightboxEl) {
        lightboxEl.classList.remove('active');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxEl.classList.contains('active')) {
        lightboxEl.classList.remove('active');
      }
    });

    // SWIPE FOR LIGHTBOX
    let touchStartX = 0;
    let touchEndX = 0;

    lightboxEl.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    lightboxEl.addEventListener(
      'touchend',
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            lightboxCarousel.next();
          } else {
            lightboxCarousel.prev();
          }
        }
      },
      { passive: true }
    );
  }

  // ===== INIT TIMELINE =====
  initTimeline();
});