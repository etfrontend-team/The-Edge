import Swiper from '../../node_modules/swiper/swiper-bundle.min.mjs';
import { gsap } from '../../node_modules/gsap/index.js';
import Lenis from '../../node_modules/lenis/dist/lenis.mjs';

/* ========================
   LENIS SMOOTH SCROLL
   ======================== */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

var lenisScrollY = 0;
lenis.on('scroll', function (e) {
  lenisScrollY = e.scroll;
});

const ctaParallax = (function () {
  var img = document.getElementById('ctaSectionParallax');
  var section = img ? img.closest('.cta-section') : null;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!img || !section) {
    return {
      update: function () {},
    };
  }

  function update() {
    if (reduceMotion.matches) {
      img.style.transform = 'none';
      return;
    }

    var rect = section.getBoundingClientRect();
    var viewH = window.innerHeight || document.documentElement.clientHeight;
    var progress = (viewH - rect.top) / (viewH + rect.height);
    var clamped = Math.min(1, Math.max(0, progress));
    var offset = (clamped - 0.5) * 110;
    img.style.transform = 'translate3d(0, ' + offset.toFixed(2) + 'px, 0) scale(1.18)';
  }

  return {
    update: update,
  };
}());

const innerBannerParallax = (function () {
  var img = document.getElementById('innerBannerParallax');
  var section = img ? img.closest('.inner-banner') : null;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!img || !section) {
    return { update: function () {} };
  }

  img.style.transformOrigin = 'top center';

  function update() {
    if (reduceMotion.matches) {
      img.style.transform = '';
      return;
    }
    var scrollY = lenisScrollY;
    if (scrollY > section.offsetTop + section.offsetHeight) return;
    var offset = scrollY * 0.5;
    img.style.transform = 'translate3d(0, ' + offset.toFixed(2) + 'px, 0) scale(1.6)';
  }

  return { update: update };
}());

function makeSectionParallax(imgEl) {
  var section = imgEl.closest('section');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!section) return { update: function () {} };
  return {
    update: function () {
      if (reduceMotion.matches) {
        imgEl.style.transform = '';
        return;
      }
      var rect = section.getBoundingClientRect();
      var viewH = window.innerHeight || document.documentElement.clientHeight;
      var progress = (viewH - rect.top) / (viewH + rect.height);
      var clamped = Math.min(1, Math.max(0, progress));
      var offset = (clamped - 0.5) * 100;
      imgEl.style.transform = 'translate3d(0, ' + offset.toFixed(2) + 'px, 0) scale(1.2)';
    },
  };
}

var sectionParallaxes = Array.prototype.slice
  .call(document.querySelectorAll('.edge-img, .twocol-nb-img, .twocol-dark-media-photo, .podcast-single-parallax-img'))
  .map(makeSectionParallax);

function rafLoop(time) {
  lenis.raf(time);
  ctaParallax.update();
  innerBannerParallax.update();
  for (var i = 0; i < sectionParallaxes.length; i++) {
    sectionParallaxes[i].update();
  }
  requestAnimationFrame(rafLoop);
}
requestAnimationFrame(rafLoop);

window.addEventListener('resize', ctaParallax.update, { passive: true });
window.addEventListener('resize', innerBannerParallax.update, { passive: true });
window.addEventListener('resize', function () {
  for (var i = 0; i < sectionParallaxes.length; i++) {
    sectionParallaxes[i].update();
  }
}, { passive: true });
ctaParallax.update();
innerBannerParallax.update();
for (var i = 0; i < sectionParallaxes.length; i++) {
  sectionParallaxes[i].update();
}

const $ = window.jQuery;

/* ========================
   BANNER SWIPER
   ======================== */
if (document.querySelector('.banner-swiper')) {
  new Swiper('.banner-swiper', {
    loop: true,
    // autoplay: {
    //   delay: 5000,
    //   disableOnInteraction: false,
    // },
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
    pagination: {
      el: '.banner-pagination',
      clickable: true,
    },
    speed: 800,
  });
}

/* ========================
   THREE COL SWIPER
   ======================== */
if (document.querySelector('.three-col-swiper')) {
  new Swiper('.three-col-swiper', {
    slidesPerView: 3,
    spaceBetween: 40,
    breakpoints: {
      0: {
        slidesPerView: 1.15,
        spaceBetween: 20,
      },
      576: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1025: {
        slidesPerView: 3,
        spaceBetween: 40,
      },
    },
  });
}

/* ========================
   PATHS SWIPER
   ======================== */
if (document.querySelector('.paths-swiper')) {
  var pathsSwiper = new Swiper('.paths-swiper', {
    slidesPerView: 3,
    spaceBetween: 20,
    breakpoints: {
      0: {
        slidesPerView: 1.25,
        spaceBetween: 20,
      },
        576: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1025: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1250: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
    },
    on: {
      init: function (swiper) {
        updatePathsProgress(swiper);
      },
      slideChange: function (swiper) {
        updatePathsProgress(swiper);
      },
    },
  });

  function updatePathsProgress(swiper) {
    var fill = document.querySelector('.paths-progress-fill');
    if (!fill) return;
    var total = swiper.slides.length;
    var perView = Math.round(swiper.params.slidesPerView);
    var pct;
    if (perView >= total) {
      pct = (swiper.activeIndex + 1) / total;
    } else {
      var maxIndex = total - perView;
      pct = swiper.activeIndex / Math.max(maxIndex, 1);
    }
    fill.style.width = Math.round(Math.min(Math.max(pct, 0), 1) * 100) + '%';
  }
}

/* ========================
   PROGRAM CARD SWIPER
   ======================== */
if (document.querySelector('.program-card-swiper')) {
  new Swiper('.program-card-swiper', {
    slidesPerView: 6,
    spaceBetween: 20,
    breakpoints: {
      0: {
        slidesPerView: 1.2,
        spaceBetween: 16,
      },
      576: {
        slidesPerView: 2.2,
        spaceBetween: 16,
      },
      1025: {
        slidesPerView: 3.5,
        spaceBetween: 20,
      },
      1200: {
        slidesPerView: 4.5,
        spaceBetween: 20,
      },
      1440: {
        slidesPerView: 6,
        spaceBetween: 20,
      },
    },
  });
}

/* ========================
   STORIES SWIPER
   ======================== */
if (document.querySelector('.stories-swiper')) {
  new Swiper('.stories-swiper', {
    slidesPerView: 4,
    spaceBetween: 20,
    breakpoints: {
      0: {
        slidesPerView: 1.15,
        spaceBetween: 16,
      },
      1025: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
    },
  });
}

/* ========================
   EXPLORE JOURNEYS SWIPER
   ======================== */
if (document.querySelector('.explore-section-swiper')) {
  new Swiper('.explore-section-swiper', {
    slidesPerView: 4,
    spaceBetween: 20,
    breakpoints: {
      0: {
        slidesPerView: 1.2,
        spaceBetween: 16,
      },
      576: {
        slidesPerView: 2.2,
        spaceBetween: 16,
      },
      1025: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      1440: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
    },
  });
}

/* ========================
   BRANDS MARQUEE SWIPER
   ======================== */
if (document.querySelector('.as-featured-swiper')) {
  var asFeaturedSwiper = new Swiper('.as-featured-swiper', {
    slidesPerView: 5,
    spaceBetween: 60,
    loop: true,
    allowTouchMove: false,
    speed: 4000,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
      pauseOnMouseEnter: false,
    },
    breakpoints: {
      0: {
        slidesPerView: 2.2,
        spaceBetween: 30,
      },
      576: {
        slidesPerView: 3,
        spaceBetween: 40,
      },
      768: {
        slidesPerView: 4,
        spaceBetween: 50,
      },
      1025: {
        slidesPerView: 5,
        spaceBetween: 60,
      },
    },
    on: {
      transitionEnd: function () {
        asFeaturedSwiper.autoplay.start();
      },
    },
  });
}

/* ========================
   PRESS FILES SWIPER
   ======================== */
if (document.querySelector('.press-files-swiper')) {
  new Swiper('.press-files-swiper', {
    slidesPerView: 4,
    spaceBetween: 20,
    loop: false,
    breakpoints: {
      0: {
        slidesPerView: 1.2,
        spaceBetween: 16,
      },
      576: {
        slidesPerView: 2,
        spaceBetween: 16,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      1025: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
    },
  });
}

/* ========================
   COACHING DESC SWIPER
   ======================== */
if (document.querySelector('.coaching-desc-main-swiper')) {
  var coachingDescThumbs = new Swiper('.coaching-desc-thumbs', {
    slidesPerView: 4,
    spaceBetween: 20,
    watchSlidesProgress: true,
    breakpoints: {
      0: { slidesPerView: 3, spaceBetween: 12 },
      576: { slidesPerView: 4, spaceBetween: 16 },
      1025: { slidesPerView: 4, spaceBetween: 20 },
    },
  });

  var coachingDescSwiper = new Swiper('.coaching-desc-main-swiper', {
    slidesPerView: 1,
    spaceBetween: 0,
    navigation: {
      nextEl: '.coaching-desc-next',
      prevEl: '.coaching-desc-prev',
    },
    thumbs: {
      swiper: coachingDescThumbs,
    },
  });

  // Quantity stepper
  var qtyEl = document.getElementById('coachingDescQty');
  if (qtyEl) {
    var qty = 1;
    document.querySelector('.coaching-desc-qty-minus')?.addEventListener('click', function () {
      if (qty > 1) { qty--; qtyEl.textContent = qty; }
    });
    document.querySelector('.coaching-desc-qty-plus')?.addEventListener('click', function () {
      qty++; qtyEl.textContent = qty;
    });
  }

  // Radio option visual toggle
  document.querySelectorAll('input[name="coachingPart"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      document.querySelectorAll('.coaching-desc-option').forEach(function (el) {
        el.classList.remove('coaching-desc-option-active');
        el.classList.add('coaching-desc-option-inactive');
      });
      radio.closest('.coaching-desc-option').classList.remove('coaching-desc-option-inactive');
      radio.closest('.coaching-desc-option').classList.add('coaching-desc-option-active');
    });
  });
}

/* ========================
   BANNER BADGE — continuous rotation via GSAP
   ======================== */
if (document.getElementById('bannerBadgeRing')) {
  gsap.to('#bannerBadgeRing', {
    rotation: 360,
    duration: 15,
    repeat: -1,
    ease: 'none',
    transformOrigin: '50% 50%',
  });
}

$(function () {

  /* ========================
     SCROLL — is-scrolled state
     ======================== */

  var alwaysScrolledPages = [
    'single-coaching',
    'single-podcast',
    'single-event',
    // 'event-listing',
  ];
  var isAlwaysScrolled = alwaysScrolledPages.some(function (name) {
    return window.location.pathname.indexOf(name) !== -1;
  });

  if (isAlwaysScrolled) {
    $('header').addClass('is-scrolled');
  }

  function onScroll() {
    if (isAlwaysScrolled) return;
    $('header').toggleClass('is-scrolled', $(window).scrollTop() > 10);
  }

  $(window).on('scroll', onScroll);
  onScroll();

  /* ========================
     DESKTOP DROPDOWN
     ======================== */

  // Toggle on nav-link click (button or a)
  $(document).on('click', '.nav-item.has-dropdown > .nav-link', function (e) {
    e.stopPropagation();
    var $item = $(this).closest('.nav-item');
    var isOpen = $item.hasClass('is-open');

    // Close all
    $('.nav-item.has-dropdown').removeClass('is-open');

    // Open this one if it was closed
    if (!isOpen) {
      $item.addClass('is-open');
    }
  });

  // Close dropdown on outside click
  $(document).on('click', function () {
    $('.nav-item.has-dropdown').removeClass('is-open');
    $('#searchPopup').removeClass('is-open');
        $('#cartPanel').removeClass('is-open');
    $('.cart-btn').removeClass('is-active');
  });

  // Prevent dropdown panel click from closing
  $(document).on('click', '.nav-dropdown', function (e) {
    e.stopPropagation();
  });

  /* ========================
     CART PANEL
     ======================== */

  function updateHeaderHeight() {
    var h = document.querySelector('header');
    if (h) {
      document.documentElement.style.setProperty('--header-h', h.offsetHeight + 'px');
    }
  }

  updateHeaderHeight();
  $(window).on('resize', updateHeaderHeight);

  function openCart() {
    $('#cartPanel').addClass('is-open');
    $('.cart-btn').addClass('is-active');
    $('body').addClass('overflow-hidden');
  }

  function closeCart() {
    $('#cartPanel').removeClass('is-open');
    $('.cart-btn').removeClass('is-active');
    $('body').removeClass('overflow-hidden');
  }

  $(document).on('click', '.cart-btn', function (e) {
    e.preventDefault();
    e.stopPropagation();
    var isOpen = $('#cartPanel').hasClass('is-open');
    $('.nav-item.has-dropdown').removeClass('is-open');
    $('#searchPopup').removeClass('is-open');
    if (isOpen) { closeCart(); } else { openCart(); }
  });

  $(document).on('click', '#cartPanel', function (e) {
    e.stopPropagation();
  });

  /* ========================
     SEARCH POPUP
     ======================== */

  $(document).on('click', '.search-btn', function (e) {
    e.preventDefault();
    e.stopPropagation();
    var isOpen = $('#searchPopup').hasClass('is-open');
    $('.nav-item.has-dropdown').removeClass('is-open');
    $('#searchPopup').toggleClass('is-open', !isOpen);
    if (!isOpen) {
      setTimeout(function () { $('#searchInput').focus(); }, 50);
    }
  });

  // Prevent popup itself from closing on click inside
  $(document).on('click', '#searchPopup', function (e) {
    e.stopPropagation();
  });

  // ESC key closes popup / cart
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') {
      $('#searchPopup').removeClass('is-open');
      closeCart();
    }
  });

  /* ========================
     OUR STORY — PLAY VIDEO
     ======================== */

  $(document).on('click', '#ourStoryPlayBtn', function () {
    var $wrap = $('#ourStoryVideoWrap');
    if (!$wrap.hasClass('is-playing')) {
      var videoEl = $wrap.find('.our-story-video')[0];
      $wrap.addClass('is-playing');
      $wrap.find('.our-story-video-player').addClass('is-playing');
      videoEl.src = '../assets/images/video1.mp4';
      videoEl.load();
      videoEl.addEventListener('canplay', function onReady() {
        videoEl.removeEventListener('canplay', onReady);
        videoEl.play().catch(function () {});
      });
    }
  });

  /* ========================
     STORY CARD — PLAY VIDEO
     ======================== */

  $(document).on('click', '.story-play-btn', function (e) {
    e.stopPropagation();
    var $card = $(this).closest('.story-card');
    var videoSrc = $card.data('video');
    if (videoSrc && !$card.hasClass('is-playing')) {
      var videoEl = $card.find('.story-video')[0];
      $card.addClass('is-playing');
      $card.find('.story-video-wrap').addClass('is-playing');
      videoEl.src = videoSrc;
      videoEl.load();
      videoEl.addEventListener('canplay', function onReady() {
        videoEl.removeEventListener('canplay', onReady);
        videoEl.play().catch(function () {});
      });
    }
  });

  /* ========================
     MOBILE — HAMBURGER
     ======================== */

  $('#hamburgerBtn').on('click', function () {
    $('#mobileMenu').toggleClass('is-open');
  });

  /* ========================
     MOBILE — ACCORDION
     ======================== */

  $(document).on('click', '.is-expandable button.mobile-accordion-trigger, .is-expandable .mobile-accordion-chevron-btn', function () {
    var $accordion = $(this).closest('.mobile-accordion');
    var isActive = $accordion.hasClass('is-active');

    // Close all
    $('.mobile-accordion.is-expandable').removeClass('is-active');
    $('.mobile-accordion-content').removeClass('is-open');

    // Open this one if it was closed
    if (!isActive) {
      $accordion.addClass('is-active');
      $accordion.find('.mobile-accordion-content').addClass('is-open');
    }
  });

  /* ========================
     SECTION ACCORDION
     ======================== */

  $(document).on('click', '.accordion-trigger', function () {
    var $trigger = $(this);
    var $item = $trigger.closest('.accordion-item');
    var $list = $item.closest('.accordion-list');

    if ($item.hasClass('is-active')) return;

    $list.find('.accordion-item').removeClass('is-active');
    $list.find('.accordion-trigger').attr('aria-expanded', 'false');

    $item.addClass('is-active');
    $trigger.attr('aria-expanded', 'true');
  });

  /* ========================
     FOOTER NAV ACCORDION (MOBILE)
     ======================== */

  $(document).on('click', '.footer-nav-col-header', function () {
    var $col = $(this).closest('.footer-nav-col');
    $col.toggleClass('is-open');
  });

  /* ========================
     BANNERWRAP — TAB SWITCHING
     ======================== */

  $(document).on('click', '.bannerwrap-tab-btn', function () {
    var $tab = $(this).closest('.bannerwrap-tab');
    var $inner = $tab.closest('.bannerwrap-inner');
    var idx = $tab.data('tab');
    var body = $tab.data('body');

    // Reset playing videos
    $inner.find('.bannerwrap-media-wrap.is-playing, .bannerwrap-media.is-playing').each(function () {
      var $w = $(this);
      var v = $w.find('.bannerwrap-media-video')[0];
      $w.removeClass('is-playing');
      if (v) { v.pause(); v.currentTime = 0; v.removeAttribute('src'); v.load(); }
    });

    // Update tabs
    $inner.find('.bannerwrap-tab').removeClass('is-active');
    $inner.find('.bannerwrap-tab-btn').attr('aria-pressed', 'false');
    $tab.addClass('is-active');
    $(this).attr('aria-pressed', 'true');

    // Update body copy
    $inner.find('.bannerwrap-body .content p').text(body);

    // Update right-side desktop media
    $inner.find('.bannerwrap-right .bannerwrap-media').removeClass('is-active');
    $inner.find('.bannerwrap-right .bannerwrap-media[data-media="' + idx + '"]').addClass('is-active');
  });

  /* ========================
     EVENTS LISTING — TAB FILTER
     ======================== */

  $(document).on('click', '.events-tab', function () {
    var $btn = $(this);
    var category = $btn.data('category');
    $btn.closest('.events-listing-tabs').find('.events-tab').removeClass('events-tab--active');
    $btn.addClass('events-tab--active');
    var $cards = $btn.closest('.events-listing-inner').find('.events-listing-card');
    if (category === 'all') {
      $cards.show();
    } else {
      $cards.each(function () {
        $(this).data('category') === category ? $(this).show() : $(this).hide();
      });
    }
  });

  /* ========================
     BANNERWRAP — PLAY VIDEO
     ======================== */

  $(document).on('click', '.bannerwrap-play-btn', function () {
    var $wrap = $(this).closest('.bannerwrap-media-wrap, .bannerwrap-media');
    if ($wrap.hasClass('is-playing')) return;
    var $vid = $wrap.find('.bannerwrap-media-video');
    var src = $vid.find('source').attr('src');
    var v = $vid[0];
    $wrap.addClass('is-playing');
    v.src = src;
    v.load();
    v.addEventListener('canplay', function onReady() {
      v.removeEventListener('canplay', onReady);
      v.play().catch(function () {});
    });
  });

});

/* ========================
   REGISTER MODAL + CALENDAR
   ======================== */

(function () {
  var $modal = $('#registerModal');
  if (!$modal.length) return;

  var calState = {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    selected: null,
  };

  var MONTHS = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];

  function buildCalendar() {
    var y = calState.year;
    var m = calState.month;
    $('#regCalMonth').text(MONTHS[m]);

    var firstDay = new Date(y, m, 1).getDay();
    var daysInMonth = new Date(y, m + 1, 0).getDate();
    var daysInPrev = new Date(y, m, 0).getDate();

    var $days = $('#regCalDays').empty();
    var cells = [];

    for (var i = firstDay - 1; i >= 0; i--) {
      cells.push({ day: daysInPrev - i, outside: true });
    }
    for (var d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, outside: false });
    }
    var remaining = 7 - (cells.length % 7);
    if (remaining < 7) {
      for (var n = 1; n <= remaining; n++) {
        cells.push({ day: n, outside: true });
      }
    }

    for (var w = 0; w < cells.length / 7; w++) {
      var $week = $('<div class="reg-cal-week"></div>');
      for (var c = 0; c < 7; c++) {
        var cell = cells[w * 7 + c];
        var isSelected = !cell.outside && calState.selected && calState.selected.year === y && calState.selected.month === m && calState.selected.day === cell.day;
        var cls = 'reg-cal-day' + (cell.outside ? ' is-outside' : '') + (isSelected ? ' is-selected' : '');
        var $day = $('<span class="' + cls + '">' + cell.day + '</span>');
        if (!cell.outside) {
          (function (day) {
            $day.on('click', function () {
              calState.selected = { year: y, month: m, day: day };
              buildCalendar();
            });
          })(cell.day);
        }
        $week.append($day);
      }
      $days.append($week);
    }
  }

  function openModal() {
    $modal.addClass('is-open').attr('aria-hidden', 'false');
    $('body').addClass('overflow-hidden');
    buildCalendar();
  }

  function closeModal() {
    $modal.removeClass('is-open').attr('aria-hidden', 'true');
    $('body').removeClass('overflow-hidden');
  }

  $('#openRegisterModal').on('click', openModal);
  $('#registerModalClose, #registerModalBackdrop').on('click', closeModal);
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  $('#regCalPrev').on('click', function () {
    calState.month--;
    if (calState.month < 0) { calState.month = 11; calState.year--; }
    buildCalendar();
  });

  $('#regCalNext').on('click', function () {
    calState.month++;
    if (calState.month > 11) { calState.month = 0; calState.year++; }
    buildCalendar();
  });

  var regQty = 1;
  $('#regQtyMinus').on('click', function () {
    if (regQty > 1) { regQty--; $('#regQtyCount').text(regQty); }
  });
  $('#regQtyPlus').on('click', function () {
    regQty++;
    $('#regQtyCount').text(regQty);
  });
}());
