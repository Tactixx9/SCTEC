// Client script: mobile nav toggle + contact form POST to /api/contact
document.addEventListener('DOMContentLoaded', () => {
  // Nav toggle for small screens
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      siteNav.classList.toggle('open');
    });
  }

  // Contact form submission
  const form = document.getElementById('contactForm');
  const status = document.getElementById('contact-status');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (status) status.textContent = 'Sending...';
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          if (status) status.textContent = 'Thanks — your message was sent.';
          form.reset();
          try { gtagEvent('contact_form_submit', { event_category: 'conversion', event_label: payload.email || payload.name || 'contact' }); } catch (e) {}
          // redirect to a thank-you page (non-blocking)
          setTimeout(() => { window.location.href = 'contact-thanks.html'; }, 800);
        } else {
          const text = await res.text();
          if (status) status.textContent = 'Error: ' + (text || res.statusText);
        }
      } catch (err) {
        if (status) status.textContent = 'Network error — message not sent.';
      }
    });
  }
});

// Cookie consent banner (simple localStorage-based)
function ensureCookieConsent() {
  try {
    if (localStorage.getItem('sctec_cookie_consent') === 'yes') return;
  } catch (e) {
    return;
  }
  const banner = document.createElement('div');
  banner.id = 'cookie-consent';
  banner.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;background:#111;color:#fff;padding:12px 16px;border-radius:8px;z-index:9999;display:flex;align-items:center;gap:12px;box-shadow:0 6px 18px rgba(0,0,0,0.3)';
  banner.innerHTML = '<div style="flex:1">We use cookies and analytics to improve the site. By continuing you agree to our use of cookies. See <a href="privacy.html" style="color:#f3c14d;text-decoration:underline">Privacy</a>.</div>' +
    '<div><button id="acceptCookies" style="background:#f3c14d;border:none;padding:8px 12px;border-radius:6px;cursor:pointer">Accept</button></div>';
  document.body.appendChild(banner);
  document.getElementById('acceptCookies').addEventListener('click', () => {
    try { localStorage.setItem('sctec_cookie_consent', 'yes'); } catch (e) {}
    banner.remove();
  });
}
document.addEventListener('DOMContentLoaded', ensureCookieConsent);

// Lightweight GA event wiring: listens for `data-ga-event` on links and sends events if gtag is present.
function gtagEvent(name, params = {}) {
  try {
    if (window.gtag) {
      window.gtag('event', name, params);
    } else {
      console.debug('gtag not available — event:', name, params);
    }
  } catch (e) {
    console.warn('gtagEvent error', e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[data-ga-event]').forEach(a => {
    a.addEventListener('click', (e) => {
      const ev = a.getAttribute('data-ga-event') || 'link_click';
      const label = a.getAttribute('data-ga-label') || a.textContent.trim() || a.href;
      const val = a.getAttribute('data-ga-value');
      const params = { event_category: 'engagement', event_label: label };
      if (val) params.value = Number(val);
      // send event (non-blocking)
      try { gtagEvent(ev, params); } catch (_) {}
    });
  });
});

// Load testimonials from JSON and render on pages
const DEFAULT_TESTIMONIALS = [
  {
    id: "jheslip",
    name: "James Heslip",
    title: "Senior Manager, Field Safety",
    full: "It is with great enthusiasm that I recommend Sylvester Collins, Jr. as an exceptional leader and team player. Sylvester consistently demonstrates a rare combination of efficiency, confidence, and integrity that sets him apart in any professional setting. His ability to lead with clarity and purpose has resulted in remarkable achievements. These accomplishments are a testament to his strategic mindset and hands-on leadership style. Sylvester’s customer service skills are equally impressive. He brings a thoughtful, solutions-oriented approach to every interaction, ensuring that both internal and external stakeholders feel heard and supported. His communication style fosters collaboration, and his commitment to excellence inspires those around him. What truly distinguishes Sylvester is his integrity. He leads by example, consistently aligning his actions with the values of transparency, accountability, and respect. Whether guiding cross-functional teams, Sylvester brings a level of professionalism and dedication that elevates the projects he touches. Sylvester continues to invest in his growth as a leader. His passion for data-driven decision-making and continuous improvement makes him an invaluable asset to any organization. I wholeheartedly recommend Sylvester Collins for any leadership role that demands operational excellence, analytical acumen, and unwavering integrity.",
    short: "Efficient, strategic leadership that produces measurable results and inspires teams."
  },
  {
    id: "lshaw",
    name: "Lorita Shaw, MBA",
    title: "Analytics Manager & Tech Founder",
    full: "I am honored to recommend Sylvester, who demonstrated exceptional professionalism, attention to detail, and a strong analytical mindset during my data analytics training program. Throughout the sessions, he seamlessly connected the concepts taught to his extensive experience in warehousing and logistics, showcasing his ability to apply data-driven decision-making in real-world scenarios. His proficiency in SQL, data manipulation, and business intelligence tools allowed him to optimize workflows and enhance operational efficiency within his domain. Beyond his technical skills, Sylvester's professionalism, problem-solving abilities, and eagerness to learn make him a valuable asset to any organization. I have no doubt that his expertise and commitment will drive meaningful contributions to any team he joins. I highly recommend him for any opportunity aligned with his skills and experience.",
    short: "Analytical, detail-oriented, and skilled at applying data to improve operations."
  },
  {
    id: "sflores",
    name: "Sean Flores, MSIOP",
    title: "SAP SuccessFactors Expert",
    full: "I can't say there are many individuals more driven or more thorough with their professional approach than Sylvester Collins. While working closely together on numerous data maintenance projects, Sylvester not only expressed a great comprehension of the different languages, he also displayed a great knack for project deliverables and management of the project schedules. His communication style, clear direction, and motivation to produce exemplary work was maintained from the start to completion in each project. I would fully recommend Sylvester for any project-based role, especially within the information-based consultative and solutioning spaces.",
    short: "Driven and thorough — consistently delivers on project schedules and quality."
  },
  {
    id: "jsadler",
    name: "J.Thomas Sadler",
    title: "CEO, Ibis Compliance & Financial Services",
    full: "I have worked with Mr. Collins on a handful of projects and found him to be a highly skilled and dedicated professional. His expertise and problem solution oriented skills have been invaluable to our company. I highly recommend him.",
    short: "Dependable problem-solver with deep expertise and commitment to results."
  },
  {
    id: "aweaver",
    name: "Andrew Weaver",
    title: "CEO @ Xavier Digital",
    full: "I had the privilege of collaborating with Sylvester as he served as a Project Manager and I am thrilled to recommend him without hesitation. Sylvester exemplifies the qualities of a trusted and professional individual that any business owner would value. Sylvester's exceptional communication skills are truly impressive. He consistently responds in a timely manner, ensuring that all lines of communication remain open and efficient. This level of responsiveness is a testament to his dedication to delivering the highest level of service. Sylvester goes above and beyond to ensure the success of everyone involved. He consistently provided me with everything I needed to excel in my role, demonstrating his commitment to our collaborative success. His punctuality is also worth noting; he was on time for every meeting and ensured that our projects stayed on track by checking in and providing value wherever he could. One of Sylvester's standout strengths is his ability to act as a skilled mediator between clients and contractors. His expertise in client relations and management is nothing short of remarkable. He knows how to navigate challenging situations effectively, resulting in positive outcomes for all parties involved. Furthermore, Sylvester possesses a keen understanding of project management, which he uses to keep team members accountable and ensure that projects progress within established timelines. His attention to detail and commitment to maintaining project integrity is truly commendable. In conclusion, Sylvester is an invaluable asset to any business endeavor. His professionalism, reliability, and exceptional skills make him a standout choice for any project management role. I have no doubt that he will continue to excel and be a trusted partner for any business owner fortunate enough to work with him.",
    short: "Clear communicator and reliable project manager who keeps teams aligned."
  }
];
async function loadTestimonialsData() {
  try {
    const res = await fetch('data/testimonials.json');
    if (!res.ok) return DEFAULT_TESTIMONIALS;
    const json = await res.json();
    if (!json || !json.length) return DEFAULT_TESTIMONIALS;
    return json;
  } catch (err) {
    return DEFAULT_TESTIMONIALS;
  }
}

// Services loader & renderer
const DEFAULT_SERVICES = [
  {
    id: "bronze",
    name: "Bronze – Process Boost",
    description: "Initial Process Assessment, streamlined solutions and documented workflows.",
    features: ["Initial Process Assessment", "Recommendations for quick wins", "Process documentation"],
    price: null,
    cta: "https://calendar.app.google/j3eEQV98WT3T4BV18"
  },
  {
    id: "silver",
    name: "Silver – Data Insights",
    description: "Everything in Bronze plus analytics, KPI setup and monthly reporting.",
    features: ["Includes Bronze package", "Basic data analytics & KPI setup", "Monthly performance report", "Change management guidance"],
    price: null,
    cta: "https://calendar.app.google/j3eEQV98WT3T4BV18"
  },
  {
    id: "gold",
    name: "Gold – Project Excellence",
    description: "Everything in Silver plus full project planning and risk mitigation.",
    features: ["Includes Silver package", "Full project planning & coordination", "Risk assessment & mitigation", "Bi-weekly progress meetings"],
    price: null,
    cta: "https://calendar.app.google/j3eEQV98WT3T4BV18"
  },
  {
    id: "platinum",
    name: "Platinum – Enterprise Transformation",
    description: "Everything in Gold plus leadership coaching and advanced analytics.",
    features: ["Includes Gold package", "Leadership coaching & team alignment", "Advanced analytics dashboards", "Post-project performance review & improvement plan"],
    price: null,
    cta: "https://calendar.app.google/j3eEQV98WT3T4BV18"
  }
  ,
  {
    id: "apple-screen-repair",
    name: "Apple Screen Repair",
    description: "Screen Replacement – Genuine or high-quality compatible screens for iPhone, iPad, and Mac. Diagnostic Check – Full device inspection to ensure no hidden issues. Touch & Display Calibration – Ensures smooth touch response and accurate color. Protective Screen Guard – Complimentary tempered glass for extra protection. Warranty Coverage – 30 days on parts. Same-Day Service – Fast turnaround for most models.",
    features: ["Screen replacement for iPhone, iPad & Mac","Genuine or high-quality compatible parts","Diagnostic device inspection","Touch & display calibration","Complimentary tempered glass","30-day parts warranty","Same-day service where available"],
    price: null,
    cta: null
  },
  {
    id: "certified-sign-seal",
    name: "Certified Sign & Seal – Base Package",
    description: "Need documents notarized quickly and professionally? Our Certified Sign & Seal Package ensures your paperwork is legally compliant and properly authenticated.",
    features: ["Document verification to meet legal requirements","Identity confirmation (valid ID check)","Official notarization with seal and signature","Support for multiple documents (charged per document)"],
    price: "$20",
    cta: null,
    purchase_url: "https://link.waveapps.com/mjk63f-3t6m39"
  }
];


async function loadServicesData() {
  try {
    const res = await fetch('data/services.json');
    if (!res.ok) return DEFAULT_SERVICES;
    const json = await res.json();
    if (!json || !json.length) return DEFAULT_SERVICES;
    return json;
  } catch (err) {
    return DEFAULT_SERVICES;
  }
}

// Global contact form URL used for 'Contact for Quote' links
const CONTACT_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSe-JIuhJVVGnvpdrk6aFXX9uKu_EEQznNwrMNp1p65Q_mNUNg/viewform?usp=header';

function renderServicesCards(list) {
  const container = document.getElementById('services-list');
  if (!container) return;
  container.innerHTML = '';
  list.forEach(s => {
    const card = document.createElement('div');
    card.className = 'feature';
    const title = document.createElement('h3');
    if (s.price) {
      title.textContent = `${s.name} — ${s.price}`;
    } else {
      title.textContent = s.name;
    }
    const desc = document.createElement('p');
    desc.textContent = s.description || '';
    const ul = document.createElement('ul');
    s.features && s.features.forEach(f => {
      const li = document.createElement('li');
      li.textContent = f;
      ul.appendChild(li);
    });
    const note = document.createElement('p');
    note.className = 'price-note';
    note.textContent = 'Contact for Quote';

    card.appendChild(title);
    if (desc.textContent) card.appendChild(desc);
    if (ul.children.length) card.appendChild(ul);

    // If a purchase URL is provided, show a buy button; otherwise show contact note
    if (s.purchase_url) {
      const ctaWrap = document.createElement('p');
      const a = document.createElement('a');
      a.className = 'cta';
      a.href = s.purchase_url;
      a.target = '_blank';
      a.rel = 'noopener';
      const btnText = `Buy ${s.name}${s.price ? ' — ' + s.price : ''}`;
      a.textContent = btnText;
      a.setAttribute('aria-label', btnText);
      ctaWrap.appendChild(a);
      card.appendChild(ctaWrap);
    } else {
      // Prefer a centralized contact form for quote requests
      if (CONTACT_FORM_URL) {
        const fP = document.createElement('p');
        fP.className = 'price-note';
        const fA = document.createElement('a');
        fA.href = CONTACT_FORM_URL;
        fA.target = '_blank';
        fA.rel = 'noopener';
        fA.textContent = 'Contact for Quote';
        fP.appendChild(fA);
        card.appendChild(fP);
      } else if (s.contact_email) {
        const mailP = document.createElement('p');
        mailP.className = 'price-note';
        const mailA = document.createElement('a');
        const subject = encodeURIComponent(s.contact_subject || s.name || 'Inquiry');
        mailA.href = `mailto:${s.contact_email}?subject=${subject}`;
        mailA.textContent = 'Contact for Quote';
        mailP.appendChild(mailA);
        card.appendChild(mailP);
      } else {
        card.appendChild(note);
      }
    }
    container.appendChild(card);
  });
}

function renderTestimonialsList(list) {
  const container = document.querySelector('.test-list');
  if (!container) return;
  container.innerHTML = '';
  list.forEach(item => {
    const card = document.createElement('article');
    card.className = 'testimonial-card';
    const p = document.createElement('p');
    p.textContent = item.full;
    const f = document.createElement('footer');
    f.textContent = `— ${item.name}${item.title ? ', ' + item.title : ''}`;
    card.appendChild(p);
    card.appendChild(f);
    container.appendChild(card);
  });
}

function renderShortCarousel(list) {
  const tracks = document.querySelectorAll('.carousel.short .carousel-track');
  tracks.forEach(track => {
    track.innerHTML = '';
    list.forEach(item => {
      const slide = document.createElement('div');
      slide.className = 'slide';
      slide.innerHTML = `<blockquote><p>${item.short}</p><footer>— ${item.name.split(' ')[0]}</footer></blockquote>`;
      track.appendChild(slide);
    });
  });
}

function renderFullCarousel(list) {
  const tracks = document.querySelectorAll('.carousel.full .carousel-track, .carousel.slider .carousel-track');
  tracks.forEach(track => {
    track.innerHTML = '';
    list.forEach(item => {
      const slide = document.createElement('div');
      slide.className = 'slide';
      // richer markup: optional photo/logo, full quote, name and title
      slide.innerHTML = `
        <article class="testimonial-card full-card">
          <div class="testimonial-body">
            ${item.photo ? `<img class="testimonial-photo" src="${item.photo}" alt="${item.name} photo">` : ''}
            <div class="testimonial-text">
              <p class="quote">${item.full}</p>
              <div class="testimonial-meta"><strong class="name">${item.name}</strong>${item.title ? `<span class="title">, ${item.title}</span>` : ''}</div>
            </div>
          </div>
        </article>
      `;
      track.appendChild(slide);
    });
  });
}

function initAllCarousels() {
  const carousels = Array.from(document.querySelectorAll('.carousel'));
  carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    if (!track) return;
    const prev = carousel.querySelector('.carousel-btn.prev');
    const next = carousel.querySelector('.carousel-btn.next');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    const slides = Array.from(track.querySelectorAll('.slide'));
    if (!dotsContainer) return;

    let index = 0;
    let intervalId = null;

    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Show testimonial ${i+1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
    const dots = Array.from(dotsContainer.children);

    function update() {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      update();
      restartAutoplay();
    }

    if (prev) prev.addEventListener('click', () => goTo(index - 1));
    if (next) next.addEventListener('click', () => goTo(index + 1));

    function startAutoplay() { intervalId = setInterval(() => goTo(index + 1), 6000); }
    function stopAutoplay() { clearInterval(intervalId); }
    function restartAutoplay() { stopAutoplay(); startAutoplay(); }

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') goTo(index - 1);
      if (e.key === 'ArrowRight') goTo(index + 1);
    });

    update();
    startAutoplay();
  });
}

// On DOM ready: load testimonials and render where needed
document.addEventListener('DOMContentLoaded', async () => {
  const data = await loadTestimonialsData();
  if (data.length) {
    // render short paraphrased carousel (homepage) and full carousel (testimonials page)
    renderShortCarousel(data);
    renderFullCarousel(data);
    renderTestimonialsList(data);
    // initialize any carousels present on the page
    initAllCarousels();
  }
  const services = await loadServicesData();
  if (services && services.length) renderServicesCards(services);
});

// set the current year in any footer elements with class .site-year
document.addEventListener('DOMContentLoaded', () => {
  const y = new Date().getFullYear();
  document.querySelectorAll('.site-year').forEach(el => { el.textContent = String(y); });
});

// Move header social icons into the mobile nav on small screens, and back on larger screens
function syncHeaderSocial() {
  document.querySelectorAll('.header-social').forEach(el => {
    const header = el.closest('.site-header');
    if (!header) return;
    const siteNav = header.querySelector('#siteNav') || document.getElementById('siteNav');
    if (!siteNav) return;
    if (window.innerWidth < 820) {
      if (!siteNav.contains(el)) {
        siteNav.appendChild(el);
        el.style.display = 'flex';
      }
    } else {
      // move back to header before the nav
      if (!header.contains(el) || el.parentElement !== header) {
        header.insertBefore(el, siteNav);
        el.style.display = '';
      }
    }
  });
}

let _resizeTimer = null;
document.addEventListener('DOMContentLoaded', () => { syncHeaderSocial(); });
window.addEventListener('resize', () => { clearTimeout(_resizeTimer); _resizeTimer = setTimeout(syncHeaderSocial, 150); });

// Debug helper: only run on the services page; if services didn't render, show a visible notice
document.addEventListener('DOMContentLoaded', () => {
  // only run debug on pages that include the services section
  if (!document.querySelector('section.features') && !document.getElementById('services')) return;
  setTimeout(() => {
    const container = document.getElementById('services-list');
    if (!container) {
      const warn = document.createElement('div');
      warn.style.background = '#ffefef';
      warn.style.color = '#900';
      warn.style.padding = '12px';
      warn.style.border = '2px solid #900';
      warn.style.margin = '12px';
      warn.textContent = 'DEBUG: services container not found (id=services-list)';
      document.body.insertBefore(warn, document.body.firstChild);
      return;
    }
    if (container.children.length === 0) {
      const warn = document.createElement('div');
      warn.style.background = '#fff7e6';
      warn.style.color = '#a65a00';
      warn.style.padding = '12px';
      warn.style.border = '2px solid #a65a00';
      warn.style.margin = '12px';
      warn.textContent = 'DEBUG: services-list is present but empty — scripts may have failed.';
      document.body.insertBefore(warn, document.body.firstChild);
    }
  }, 700);
});
