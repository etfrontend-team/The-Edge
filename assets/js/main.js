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

function rafLoop(time) {
  lenis.raf(time);
  ctaParallax.update();
  requestAnimationFrame(rafLoop);
}
requestAnimationFrame(rafLoop);

window.addEventListener('resize', ctaParallax.update, { passive: true });
ctaParallax.update();

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

  function onScroll() {
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

  $(document).on('click', '.is-expandable .mobile-accordion-trigger', function () {
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
