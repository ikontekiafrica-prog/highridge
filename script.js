document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-list a');
  const menuToggle = document.querySelector('.burger');
  const header = document.querySelector('.header');
  const modalOverlay = document.querySelector('.modal-overlay');
  const modalTitle = document.querySelector('.modal-title');
  const modalForm = document.querySelector('.modal-form');
  const modalTypeInput = document.querySelector('#modalType');
  const faqButtons = document.querySelectorAll('.accordion-trigger');
  const galleryFilterButtons = document.querySelectorAll('.gallery-filter button');
  const galleryCards = document.querySelectorAll('.gallery-card');
  const donationButtons = document.querySelectorAll('[data-modal-type="donation"]');
  const volunteerButtons = document.querySelectorAll('[data-modal-type="volunteer"]');
  const contactForm = document.querySelector('#contactForm');
  const volunteerForm = document.querySelector('#volunteerForm');
  const newsletterForms = document.querySelectorAll('.newsletter-form');

  // Mobile Drawer Menu Toggle
  function toggleMenu() {
    if (header) {
      header.classList.toggle('nav-open');
    }
  }

  function closeMenu() {
    if (header) {
      header.classList.remove('nav-open');
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close nav on click outside
  document.addEventListener('click', (e) => {
    if (header && header.classList.contains('nav-open') && !header.contains(e.target)) {
      closeMenu();
    }
  });

  // Modal logic
  function openModal(type) {
    if (!modalOverlay) return;
    const title = type === 'volunteer'
      ? 'Volunteer at High Ridge'
      : 'Support High Ridge Today';

    if (modalTitle) modalTitle.textContent = title;
    if (modalTypeInput) modalTypeInput.value = type;
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
    if (modalForm) {
      modalForm.reset();
      const alert = modalForm.querySelector('.form-alert');
      if (alert) alert.remove();
    }
  }

  donationButtons.forEach((button) => {
    button.addEventListener('click', () => openModal('donation'));
  });

  volunteerButtons.forEach((button) => {
    button.addEventListener('click', () => openModal('volunteer'));
  });

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (event) => {
      if (event.target === modalOverlay) closeModal();
    });
  }

  const modalCloseBtn = document.querySelector('.modal-close');
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  // Form Validation & Feedback Alert
  function showFormMessage(form, message, isSuccess = true) {
    let alert = form.querySelector('.form-alert');
    if (!alert) {
      alert = document.createElement('div');
      alert.className = 'form-alert';
      form.prepend(alert);
    }
    alert.style.background = isSuccess ? 'var(--emerald-100)' : '#FDF2F2';
    alert.style.color = isSuccess ? 'var(--emerald-900)' : '#9B1C1C';
    alert.style.borderColor = isSuccess ? 'var(--emerald-600)' : '#F87171';
    alert.textContent = message;
  }

  function validateForm(form) {
    const fields = [...form.querySelectorAll('[required]')];
    let valid = true;

    fields.forEach((field) => {
      field.style.borderColor = 'rgba(11, 60, 38, 0.18)';
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = '#F87171';
      }
    });

    const email = form.querySelector('input[type="email"]');
    if (email && email.value) {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!pattern.test(email.value.trim())) {
        valid = false;
        email.style.borderColor = '#F87171';
      }
    }

    return valid;
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;

    if (validateForm(form)) {
      form.reset();
      showFormMessage(form, 'Thank you! Your message has been received. Our team will contact you shortly.', true);
    } else {
      showFormMessage(form, 'Please fill out all required fields correctly before submitting.', false);
    }
  }

  if (contactForm) contactForm.addEventListener('submit', handleFormSubmit);
  if (volunteerForm) volunteerForm.addEventListener('submit', handleFormSubmit);
  if (modalForm) modalForm.addEventListener('submit', handleFormSubmit);

  newsletterForms.forEach((form) => {
    form.addEventListener('submit', handleFormSubmit);
  });

  // Accordion FAQs
  faqButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const btn = event.currentTarget;
      const panel = btn.nextElementSibling;
      const expanded = btn.getAttribute('aria-expanded') === 'true';

      btn.setAttribute('aria-expanded', String(!expanded));
      if (panel) {
        panel.classList.toggle('open', !expanded);
      }
    });
  });

  // Filterable Gallery
  function filterGallery(category) {
    galleryFilterButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.filter === category);
    });

    galleryCards.forEach((card) => {
      const categories = card.dataset.category ? card.dataset.category.split(' ') : [];
      if (category === 'all' || categories.includes(category)) {
        card.style.display = 'grid';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      } else {
        card.style.display = 'none';
      }
    });
  }

  galleryFilterButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      filterGallery(e.currentTarget.dataset.filter);
    });
  });

  if (galleryFilterButtons.length) {
    filterGallery('all');
  }

  // Animated Number Stats Counter
  function initStats() {
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach((counter) => {
      const target = Number(counter.dataset.count);
      if (isNaN(target)) return;
      
      let current = 0;
      const step = Math.max(1, Math.floor(target / 30));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = current;
        }
      }, 30);
    });
  }

  initStats();
});
