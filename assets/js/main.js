
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Hero carousel indicators
   */
  let heroCarouselIndicators = select("#hero-carousel-indicators")
  let heroCarouselItems = select('#heroCarousel .carousel-item', true)

  heroCarouselItems.forEach((item, index) => {
    (index === 0) ?
    heroCarouselIndicators.innerHTML += "<li data-bs-target='#heroCarousel' data-bs-slide-to='" + index + "' class='active'></li>":
      heroCarouselIndicators.innerHTML += "<li data-bs-target='#heroCarousel' data-bs-slide-to='" + index + "'></li>"
  });

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });

      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();

})()

// form


function showError(id) {
  document.getElementById(id).classList.remove("d-none");
}

function hideError(id) {
  document.getElementById(id).classList.add("d-none");
}

function sendWhatsApp() {

  let valid = true;

  let name = document.getElementById("name").value.trim();
  let checkin = document.getElementById("checkin").value.trim();
  let checkout = document.getElementById("checkout").value.trim();
  let rooms = document.getElementById("rooms").value.trim();
  let adults = document.getElementById("adults").value.trim();
  let kids = document.getElementById("kids").value.trim();

  // Validation
  if (name === "") { showError("nameError"); valid = false; }
  else { hideError("nameError"); }

  if (checkin === "") { showError("checkinError"); valid = false; }
  else { hideError("checkinError"); }

  if (checkout === "") { showError("checkoutError"); valid = false; }
  else { hideError("checkoutError"); }

  if (rooms === "" || rooms == 0) { showError("roomsError"); valid = false; }
  else { hideError("roomsError"); }

  if (adults === "" || adults == 0) { showError("adultsError"); valid = false; }
  else { hideError("adultsError"); }

  // Stay type validation
  let stayTypes = [];
  document.querySelectorAll('input[name="stayType"]:checked').forEach(el => stayTypes.push(el.value));

  if (stayTypes.length === 0) { showError("stayTypeError"); valid = false; }
  else { hideError("stayTypeError"); }

  // ⭐ NEW CONDITION: Kids required ONLY if FAMILY is selected
  if (stayTypes.includes("Family")) {
    if (kids === "") {
      showError("kidsError");
      valid = false;
    } else {
      hideError("kidsError");
    }
  } else {
    hideError("kidsError"); // Kids optional for other stay types
  }

  if (!valid) return;

  // WhatsApp number
  let number = "919095535353";

  let message =
    "New Room Booking Request:%0A%0A" +
    "*Name:* " + name + "%0A" +
    "*Check-in:* " + checkin + "%0A" +
    "*Check-out:* " + checkout + "%0A" +
    "*Rooms:* " + rooms + "%0A" +
    "*Adults:* " + adults + "%0A" +
    "*Kids:* " + kids + "%0A" +
    "*Type of Stay:* " + stayTypes.join(", ") + "%0A";

  let url = "https://wa.me/" + number + "?text=" + message;
  window.open(url, "_blank");
}


// function showError(id) {
//   document.getElementById(id).classList.remove("d-none");
// }

// function hideError(id) {
//   document.getElementById(id).classList.add("d-none");
// }

// function sendWhatsApp() {

//   let valid = true;

//   let name = document.getElementById("name").value.trim();
//   let checkin = document.getElementById("checkin").value.trim();
//   let checkout = document.getElementById("checkout").value.trim();
//   let rooms = document.getElementById("rooms").value.trim();
//   let adults = document.getElementById("adults").value.trim();
//   let kids = document.getElementById("kids").value.trim();

//   // Validation
//   if (name === "") { showError("nameError"); valid = false; } 
//   else { hideError("nameError"); }

//   if (checkin === "") { showError("checkinError"); valid = false; } 
//   else { hideError("checkinError"); }

//   if (checkout === "") { showError("checkoutError"); valid = false; } 
//   else { hideError("checkoutError"); }

//   if (rooms === "" || rooms == 0) { showError("roomsError"); valid = false; } 
//   else { hideError("roomsError"); }

//   if (adults === "" || adults == 0) { showError("adultsError"); valid = false; } 
//   else { hideError("adultsError"); }

//   // Validate stay type
//   let stayTypes = [];
//   document.querySelectorAll('input[name="stayType"]:checked').forEach(el => stayTypes.push(el.value));

//   if (stayTypes.length === 0) { showError("stayTypeError"); valid = false; }
//   else { hideError("stayTypeError"); }

//   if (!valid) return; // STOP if any field is empty

//   // WhatsApp number
//   let number = "919095535353";

//   let message =
//     "New Room Booking Request:%0A%0A" +
//     "*Name:* " + name + "%0A" +
//     "*Check-in:* " + checkin + "%0A" +
//     "*Check-out:* " + checkout + "%0A" +
//     "*Rooms:* " + rooms + "%0A" +
//     "*Adults:* " + adults + "%0A" +
//     "*Kids:* " + kids + "%0A" +
//     "*Type of Stay:* " + stayTypes.join(", ") + "%0A";

//   let url = "https://wa.me/" + number + "?text=" + message;
//   window.open(url, "_blank");
// }