/* ===================================================================
   MACSOFT AI ASSISTANT — LANDING PAGE SCRIPTS
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Header scroll effect ---
  const header = document.querySelector('.header');
  const scrollThreshold = 60;

  const handleScroll = () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // initial check

  // --- Mobile menu toggle ---
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // --- Scroll reveal animations ---
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));

  // --- Active nav link based on scroll ---
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a[href^="#"]');

  const activateNavOnScroll = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinksAll.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', activateNavOnScroll, { passive: true });

  // --- Animated counter for hero stats ---
  const counters = document.querySelectorAll('[data-count]');
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated) return;
    countersAnimated = true;

    counters.forEach(counter => {
      const target = parseInt(counter.dataset.count, 10);
      const suffix = counter.dataset.suffix || '';
      const prefix = counter.dataset.prefix || '';
      const duration = 2000;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // ease out quad
        const eased = 1 - (1 - progress) * (1 - progress);
        const current = Math.floor(eased * target);

        counter.innerHTML = prefix + current + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.innerHTML = prefix + target + suffix;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  // Observe the hero stats area
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        statsObserver.unobserve(heroStats);
      }
    }, { threshold: 0.5 });
    statsObserver.observe(heroStats);
  }

  // --- Contact form handling ---
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const btn = form.querySelector('.btn-primary');
      const originalText = btn.textContent;

      // Simulate submission
      btn.textContent = 'Submitting...';
      btn.disabled = true;
      btn.style.opacity = '0.7';

      setTimeout(() => {
        btn.textContent = '✓ Inquiry Submitted!';
        btn.style.background = '#10b981';
        btn.style.opacity = '1';
        form.reset();

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }, 1200);
    });
  }

  // --- WhatsApp link opens in new tab ---
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });

  // --- FAQ Accordion Toggles ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionButton = item.querySelector('.faq-question');
    if (questionButton) {
      questionButton.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        
        // Close all other items (accordion behavior)
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherIcon = otherItem.querySelector('.faq-icon');
          if (otherIcon) otherIcon.textContent = '+';
        });

        if (!isOpen) {
          item.classList.add('active');
          const icon = item.querySelector('.faq-icon');
          if (icon) icon.textContent = '−';
        }
      });
    }
  });

  // ===================================================================
  // --- AI ASSISTANT SIMULATION INTERACTIVE PREVIEW LOOP ---
  // ===================================================================
  const runLiveSimulation = () => {
    const laser = document.querySelector('.scanner-laser');
    const rawFields = {
      vendor: document.getElementById('raw-vendor'),
      invNo: document.getElementById('raw-inv-no'),
      date: document.getElementById('raw-date'),
      item1: document.getElementById('raw-item-1'),
      item2: document.getElementById('raw-item-2'),
      total: document.getElementById('raw-total')
    };

    const statusText = document.getElementById('engine-status-text');
    const progressBar = document.getElementById('engine-progress');

    const acFields = {
      vendor: document.getElementById('ac-vendor'),
      invNo: document.getElementById('ac-inv-no'),
      date: document.getElementById('ac-date'),
      total: document.getElementById('ac-total')
    };

    const acCard = document.querySelector('.autocount-mock');
    const syncStatus = document.getElementById('ac-sync-status');
    const syncStatusDot = syncStatus.querySelector('.sync-dot');
    const syncStatusText = syncStatus.querySelector('span');

    // Sequence timelines
    const reset = () => {
      // Clear elements
      if (laser) laser.classList.remove('active');
      if (progressBar) progressBar.style.width = '0%';
      if (statusText) statusText.textContent = 'System Ready';
      if (acCard) acCard.classList.remove('sync-success');

      // Reset raw field highlights
      Object.values(rawFields).forEach(field => {
        if (field) field.classList.remove('scanning-active');
      });

      // Reset AutoCount input text and filled classes
      Object.values(acFields).forEach(field => {
        if (field) {
          field.textContent = '-';
          field.classList.remove('filled');
        }
      });

      // Reset Sync block
      if (syncStatusDot) syncStatusDot.className = 'sync-dot';
      if (syncStatusText) syncStatusText.textContent = 'Waiting for input';
    };

    const startCycle = () => {
      reset();

      // Step 1: Laser Scan begins (0.5s)
      setTimeout(() => {
        if (laser) laser.classList.add('active');
        if (statusText) statusText.textContent = 'Scanning elements...';
      }, 500);

      // Step 2: Highlight OCR sections sequentially (1.0s - 2.6s)
      setTimeout(() => { if(rawFields.vendor) rawFields.vendor.classList.add('scanning-active'); }, 1000);
      setTimeout(() => { if(rawFields.invNo) rawFields.invNo.classList.add('scanning-active'); }, 1400);
      setTimeout(() => { if(rawFields.date) rawFields.date.classList.add('scanning-active'); }, 1800);
      setTimeout(() => {
        if(rawFields.item1) rawFields.item1.classList.add('scanning-active');
        if(rawFields.item2) rawFields.item2.classList.add('scanning-active');
      }, 2200);
      setTimeout(() => { if(rawFields.total) rawFields.total.classList.add('scanning-active'); }, 2600);

      // Step 3: AI Assistant Processing (3.5s)
      setTimeout(() => {
        if (laser) laser.classList.remove('active');
        if (statusText) statusText.textContent = 'AI Assistant parsing fields...';
        if (progressBar) progressBar.style.width = '100%';
        if (syncStatusDot) syncStatusDot.className = 'sync-dot processing';
        if (syncStatusText) syncStatusText.textContent = 'Parsing invoice...';
      }, 3500);

      // Step 4: Populate AutoCount fields one by one (5.2s - 6.7s)
      setTimeout(() => {
        if (statusText) statusText.textContent = 'Syncing data to AutoCount...';
        if (syncStatusText) syncStatusText.textContent = 'Writing to database...';

        if(acFields.vendor) {
          acFields.vendor.textContent = 'SYNERGY HOLDINGS SDN BHD';
          acFields.vendor.classList.add('filled');
        }
      }, 5200);

      setTimeout(() => {
        if(acFields.invNo) {
          acFields.invNo.textContent = 'INV-2026-8891';
          acFields.invNo.classList.add('filled');
        }
      }, 5700);

      setTimeout(() => {
        if(acFields.date) {
          acFields.date.textContent = '25/06/2026';
          acFields.date.classList.add('filled');
        }
      }, 6200);

      setTimeout(() => {
        if(acFields.total) {
          acFields.total.textContent = 'RM 12,250.00';
          acFields.total.classList.add('filled');
        }
      }, 6700);

      // Step 5: Complete Database Sync Success (7.5s)
      setTimeout(() => {
        if (statusText) statusText.textContent = 'Data Entry Completed!';
        if (acCard) acCard.classList.add('sync-success');
        if (syncStatusDot) syncStatusDot.className = 'sync-dot success';
        if (syncStatusText) syncStatusText.textContent = '✓ AutoCount Updated';
      }, 7500);
    };

    // Run the animation loop
    startCycle();
    setInterval(startCycle, 12000); // repeats every 12s (8s animation + 4s pause)
  };

  // Run the live simulation preview if components exist on page
  if (document.querySelector('.live-simulation')) {
    runLiveSimulation();
  }

});
