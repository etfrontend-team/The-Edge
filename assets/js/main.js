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
  });

  // Prevent dropdown panel click from closing
  $(document).on('click', '.nav-dropdown', function (e) {
    e.stopPropagation();
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
