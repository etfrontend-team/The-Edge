import Swiper from '../../node_modules/swiper/swiper-bundle.min.mjs';

/* ========================
   CTA SECTION — PARALLAX BG
   ======================== */
(function () {
  var img = document.getElementById('ctaSectionParallax');
  if (!img) return;

  function tick() {
    var section = img.closest('.cta-section');
    var rect = section.getBoundingClientRect();
    var viewH = window.innerHeight;
    var progress = (viewH - rect.top) / (viewH + rect.height);
    var clamped = Math.min(1, Math.max(0, progress));
    var offset = (0.5 - clamped) * 60;
    img.style.transform = 'scale(1.15) translateY(' + offset + 'px)';
  }

  window.addEventListener('scroll', tick, { passive: true });
  window.addEventListener('resize', tick, { passive: true });
  tick();
}());

const $ = window.jQuery;
const gsap = window.gsap;

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
        slidesPerView: 1.15,
        spaceBetween: 16,
      },
      1025: {
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
if (typeof gsap !== 'undefined' && document.getElementById('bannerBadgeRing')) {
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

  $(document).on('click', '.cart-btn', function (e) {
    e.preventDefault();
    e.stopPropagation();
    var isOpen = $('#cartPanel').hasClass('is-open');
    $('.nav-item.has-dropdown').removeClass('is-open');
    $('#searchPopup').removeClass('is-open');
    $('#cartPanel').toggleClass('is-open', !isOpen);
    $('.cart-btn').toggleClass('is-active', !isOpen);
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
      $('#cartPanel').removeClass('is-open');
      $('.cart-btn').removeClass('is-active');
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

});
