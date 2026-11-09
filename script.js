'use strict';

/* ===== ELEMENT TOGGLE HELPER ===== */
const elementToggleFunc = (elem) => elem.classList.toggle('active');

/* ===== SIDEBAR TOGGLE (mobile) ===== */
const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');

if (sidebarBtn) {
  sidebarBtn.addEventListener('click', () => elementToggleFunc(sidebar));
}

/* ===== TESTIMONIALS MODAL (simple version) ===== */
// (Optional: agar modal chahiye to add karein)

/* ===== NAVIGATION TABS ===== */
const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

navigationLinks.forEach((link) => {
  link.addEventListener('click', function () {
    const targetPage = this.dataset.page || this.textContent.toLowerCase().trim();

    pages.forEach((page) => {
      if (page.dataset.page === targetPage) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });

    navigationLinks.forEach((nav) => nav.classList.remove('active'));
    this.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

/* ===== PORTFOLIO FILTER ===== */
const filterBtns = document.querySelectorAll('[data-filter-btn]');
const filterItems = document.querySelectorAll('[data-filter-item]');

const filterFunc = (selectedValue) => {
  filterItems.forEach((item) => {
    if (selectedValue === 'all' || selectedValue === item.dataset.category) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
};

filterBtns.forEach((btn) => {
  btn.addEventListener('click', function () {
    const selectedValue = this.innerHTML.toLowerCase().trim();

    // desktop buttons active state
    filterBtns.forEach((b) => b.classList.remove('active'));
    this.classList.add('active');

    // select box value update
    const selectValue = document.querySelector('[data-selecct-value]');
    if (selectValue) selectValue.innerHTML = this.innerHTML;

    // select list active state
    selectItems.forEach((item) => {
      item.classList.remove('active');
      if (item.innerHTML.toLowerCase().trim() === selectedValue) {
        item.classList.add('active');
      }
    });

    filterFunc(selectedValue);
  });
});

/* ===== CUSTOM SELECT BOX ===== */
const select = document.querySelector('[data-select]');
const selectItems = document.querySelectorAll('[data-select-item]');
const selectValue = document.querySelector('[data-selecct-value]');

if (select) {
  select.addEventListener('click', function () {
    this.classList.toggle('active');
  });
}

selectItems.forEach((item) => {
  item.addEventListener('click', function () {
    const selectedValue = this.innerHTML.toLowerCase().trim();

    if (selectValue) selectValue.innerHTML = this.innerHTML;

    if (select) select.classList.remove('active');

    filterBtns.forEach((btn) => {
      btn.classList.remove('active');
      if (btn.innerHTML.toLowerCase().trim() === selectedValue) {
        btn.classList.add('active');
      }
    });

    filterFunc(selectedValue);
  });
});

/* ===== CONTACT FORM VALIDATION ===== */
const form = document.querySelector('[data-form]');
const formInputs = form ? form.querySelectorAll('[data-form-input]') : [];
const formBtn = form ? form.querySelector('[data-form-btn]') : null;
const formBtnText = form ? form.querySelector('[data-form-btn-text]') : null;
const formStatus = form ? form.querySelector('[data-form-status]') : null;

if (form) {
  formInputs.forEach((input) => {
    input.addEventListener('input', () => {
      if (form.checkValidity() && formBtn) {
        formBtn.removeAttribute('disabled');
      } else if (formBtn) {
        formBtn.setAttribute('disabled', '');
      }
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.checkValidity() || !formBtn || !window.emailjs) {
      if (formStatus) {
        formStatus.textContent = 'Please complete the form and try again.';
        formStatus.classList.add('error');
      }
      return;
    }

    const publicKey = form.dataset.emailjsPublicKey;
    const serviceId = form.dataset.emailjsServiceId;
    const templateId = form.dataset.emailjsTemplateId;

    if (
      !publicKey ||
      !serviceId ||
      !templateId ||
      publicKey === 'YOUR_PUBLIC_KEY' ||
      serviceId === 'YOUR_SERVICE_ID' ||
      templateId === 'YOUR_TEMPLATE_ID'
    ) {
      if (formStatus) {
        formStatus.textContent = 'Email service is not configured yet.';
        formStatus.classList.add('error');
      }
      return;
    }

    formBtn.setAttribute('disabled', '');
    if (formBtnText) formBtnText.textContent = 'Sending...';
    if (formStatus) {
      formStatus.textContent = '';
      formStatus.classList.remove('error', 'success');
    }

    window.emailjs.init({ publicKey });
    window.emailjs
      .sendForm(serviceId, templateId, form)
      .then(() => {
        form.reset();
        if (formStatus) {
          formStatus.textContent = 'Message sent successfully.';
          formStatus.classList.add('success');
        }
      })
      .catch((error) => {
        console.error('EmailJS failed to send the message:', error);
        if (formStatus) {
          formStatus.textContent = 'Message could not be sent. Please try again.';
          formStatus.classList.add('error');
        }
      })
      .finally(() => {
        if (formBtnText) formBtnText.textContent = 'Send Message';
        if (form.checkValidity()) {
          formBtn.removeAttribute('disabled');
        }
      });
  });
}

/* ===== SKILL BAR ANIMATION ON SCROLL ===== */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.skill-progress-fill');
        fills.forEach((fill) => {
          const width = fill.style.width;
          fill.style.width = '0';
          setTimeout(() => (fill.style.width = width), 100);
        });
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll('.skills-list').forEach((el) => observer.observe(el));