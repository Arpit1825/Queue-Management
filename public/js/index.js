document.addEventListener('DOMContentLoaded', () => {
  // Theme Manager
  initTheme();

  // Navigation and Mobile Menu
  initNavigation();

  // Modals Controller
  initModals();

  // Scroll Animations & Counters
  initScrollAnimations();

  // Pricing Switcher
  initPricing();

  // Testimonials Slider
  initTestimonials();

  // FAQ Accordion
  initFaq();

  // Contact Form
  initContactForm();

  // Live Queue Simulator
  initQueueSimulator();
});

/* ==========================================
   THEME MANAGER
   ========================================== */
function initTheme() {
  const themeToggleBtn = document.querySelector('.theme-toggle-btn');
  if (!themeToggleBtn) return;

  // Check cached preference or system default
  const savedTheme = localStorage.getItem('theme');
  const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (userPrefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

/* ==========================================
   NAVIGATION & MOBILE MENU
   ========================================== */
function initNavigation() {
  const header = document.querySelector('header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Change header height/background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Update active nav link based on scroll position
    let current = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - varHeaderHeight() - 100)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  function varHeaderHeight() {
    return header ? header.clientHeight : 80;
  }

  // Toggle mobile menu
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('open')) {
          icon.className = 'fas fa-times';
        } else {
          icon.className = 'fas fa-bars';
        }
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      }
    });
  }

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) icon.className = 'fas fa-bars';
    });
  });
}

/* ==========================================
   MODALS CONTROLLER
   ========================================== */
function initModals() {
  const modalOverlays = document.querySelectorAll('.modal-overlay');
  const modalCloses = document.querySelectorAll('.modal-close');
  const openLoginBtns = document.querySelectorAll('.btn-login');
  const openSignupBtns = document.querySelectorAll('.btn-signup');
  const openDemoBtns = document.querySelectorAll('.btn-demo');

  const loginModal = document.getElementById('login-modal');
  const signupModal = document.getElementById('signup-modal');
  const demoModal = document.getElementById('demo-modal');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = ''; // Unlock background scroll
  }

  // Bind Open Buttons
  openLoginBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    closeAllModals();
    openModal(loginModal);
  }));

  openSignupBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    closeAllModals();
    openModal(signupModal);
  }));

  openDemoBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    closeAllModals();
    openModal(demoModal);
  }));

  // Bind Close Buttons
  modalCloses.forEach(close => {
    close.addEventListener('click', () => {
      closeModal(close.closest('.modal-overlay'));
    });
  });

  // Bind Overlay Clicks
  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  function closeAllModals() {
    modalOverlays.forEach(overlay => closeModal(overlay));
  }

  // Handle Switch Links Inside Modals
  const gotoSignup = document.getElementById('goto-signup');
  const gotoLogin = document.getElementById('goto-login');

  if (gotoSignup) {
    gotoSignup.addEventListener('click', () => {
      closeModal(loginModal);
      openModal(signupModal);
    });
  }
  if (gotoLogin) {
    gotoLogin.addEventListener('click', () => {
      closeModal(signupModal);
      openModal(loginModal);
    });
  }
}

/* ==========================================
   SCROLL ANIMATIONS & COUNTERS
   ========================================== */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  
  const revealOnScroll = () => {
    reveals.forEach(reveal => {
      const windowHeight = window.innerHeight;
      const elementTop = reveal.getBoundingClientRect().top;
      const elementVisible = 100;
      
      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add('active');
        
        // If this element contains counter statistics, trigger count-up
        if (reveal.classList.contains('benefits') || reveal.querySelector('.benefit-stat')) {
          triggerCounters(reveal);
        }
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  // Run once initially to show elements already in viewport
  setTimeout(revealOnScroll, 100);

  // Stats Counter Animation
  let countersStarted = false;
  function triggerCounters(container) {
    if (countersStarted) return;
    countersStarted = true;
    
    const stats = container.querySelectorAll('.benefit-stat');
    stats.forEach(stat => {
      const target = parseFloat(stat.getAttribute('data-target'));
      const suffix = stat.getAttribute('data-suffix') || '';
      const duration = 2000; // 2 seconds
      const startTime = performance.now();
      const isInteger = Number.isInteger(target);

      const updateCounter = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Easing function (easeOutQuad)
        const easeProgress = progress * (2 - progress);
        
        const currentValue = easeProgress * target;
        
        if (isInteger) {
          stat.textContent = Math.floor(currentValue) + suffix;
        } else {
          stat.textContent = currentValue.toFixed(1) + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          stat.textContent = target + suffix;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  }
}

/* ==========================================
   PRICING SWITCHER
   ========================================== */
function initPricing() {
  const toggleWrapper = document.querySelector('.toggle-switch-wrapper');
  const priceElements = document.querySelectorAll('.plan-price');
  const periodElements = document.querySelectorAll('.plan-period');
  const labelMonthly = document.getElementById('label-monthly');
  const labelYearly = document.getElementById('label-yearly');

  if (!toggleWrapper) return;

  // Plans: Starter, Professional, Enterprise
  const pricingData = {
    monthly: [19, 49, 129],
    yearly: [15, 39, 99]
  };

  toggleWrapper.addEventListener('click', () => {
    toggleWrapper.classList.toggle('yearly');
    const isYearly = toggleWrapper.classList.contains('yearly');

    if (isYearly) {
      labelYearly.classList.add('active');
      labelMonthly.classList.remove('active');
    } else {
      labelMonthly.classList.add('active');
      labelYearly.classList.remove('active');
    }

    priceElements.forEach((el, index) => {
      const targetPrice = isYearly ? pricingData.yearly[index] : pricingData.monthly[index];
      // Animate price change
      animatePriceValue(el, targetPrice);
    });

    periodElements.forEach(el => {
      el.textContent = isYearly ? '/mo, billed annually' : '/month';
    });
  });

  function animatePriceValue(el, targetValue) {
    let currentVal = parseInt(el.textContent);
    const difference = targetValue - currentVal;
    if (difference === 0) return;
    
    const steps = 15;
    const stepVal = difference / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      currentVal += stepVal;
      el.textContent = Math.round(currentVal);
      
      if (currentStep >= steps) {
        el.textContent = targetValue;
        clearInterval(timer);
      }
    }, 20);
  }
}

/* ==========================================
   TESTIMONIALS SLIDER
   ========================================== */
function initTestimonials() {
  const track = document.querySelector('.testimonials-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const btnPrev = document.querySelector('.slider-nav-btn.prev');
  const btnNext = document.querySelector('.slider-nav-btn.next');
  const dotsContainer = document.querySelector('.slider-dots');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;

  // Create dot indicators
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => {
      goToSlide(index);
    });
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.slider-dot');

  function updateDots() {
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function goToSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    
    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();
  }

  btnPrev.addEventListener('click', () => {
    goToSlide(currentIndex - 1);
  });

  btnNext.addEventListener('click', () => {
    goToSlide(currentIndex + 1);
  });

  // Auto-play
  let autoPlayInterval = setInterval(() => {
    goToSlide(currentIndex + 1);
  }, 6000);

  // Pause autoplay on mouse enter
  const container = document.querySelector('.testimonials-slider-container');
  if (container) {
    container.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    container.addEventListener('mouseleave', () => {
      autoPlayInterval = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 6000);
    });
  }
}

/* ==========================================
   FAQ ACCORDION
   ========================================== */
function initFaq() {
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all other FAQs
      document.querySelectorAll('.faq-item').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        const answer = item.querySelector('.faq-answer');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================
   CONTACT FORM
   ========================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Grab all 4 elements using your exact HTML IDs
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const subjectInput = document.getElementById('form-subject');
    const messageInput = document.getElementById('form-message');

    let isValid = true;

    // 1. Full Name Validation
    if (!nameInput.value.trim()) {
      showError(nameInput, 'Name is required');
      isValid = false;
    } else {
      clearError(nameInput);
    }

    // 2. Email Validation
    if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
      showError(emailInput, 'Enter a valid email');
      isValid = false;
    } else {
      clearError(emailInput);
    }

    // 3. Subject Validation
    if (!subjectInput.value.trim()) {
      showError(subjectInput, 'Subject is required');
      isValid = false;
    } else {
      clearError(subjectInput);
    }

    // 4. Message Validation
    if (!messageInput.value.trim()) {
      showError(messageInput, 'Message is required');
      isValid = false;
    } else {
      clearError(messageInput);
    }

    if (isValid) {
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      // Clean payload structure matching your 4 things exactly
      const formData = {
        fullname: nameInput.value.trim(),
        email: emailInput.value.trim(),
        subject: subjectInput.value.trim(),
        message: messageInput.value.trim()
      };

      try {
        const response = await fetch('/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          alert('Thank you! Your message has been received. Our team will contact you shortly.');
          form.reset();
        } else {
          const errorData = await response.json();
          alert(`Failed to send message: ${errorData.error || 'Server error'}`);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred. Please try again later.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  });

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(input, message) {
    const group = input.closest('.form-group');
    group.classList.add('has-error');
    let errorSpan = group.querySelector('.error-msg');
    
    if (!errorSpan) {
      errorSpan = document.createElement('span');
      errorSpan.className = 'error-msg';
      errorSpan.style.color = '#EF4444';
      errorSpan.style.fontSize = '0.8rem';
      errorSpan.style.marginTop = '4px';
      errorSpan.style.display = 'block';
      group.appendChild(errorSpan);
    }
    errorSpan.textContent = message;
    input.style.borderColor = '#EF4444';
  }

  function clearError(input) {
    const group = input.closest('.form-group');
    group.classList.remove('has-error');
    const errorSpan = group.querySelector('.error-msg');
    if (errorSpan) {
      errorSpan.remove();
    }
    input.style.borderColor = '';
  }
}

/* ==========================================
   LIVE QUEUE SIMULATOR ENGINE
   ========================================== */
function initQueueSimulator() {
  const btnGenerate = document.getElementById('sim-btn-generate');
  const btnServe = document.getElementById('sim-btn-serve');
  const btnReset = document.getElementById('sim-btn-reset');
  const checkboxAuto = document.getElementById('sim-auto');
  const selectService = document.getElementById('sim-service');
  const completeBtn = document.getElementById("sim-btn-complete");
  
  const metricActive = document.getElementById('sim-metric-active');
  const metricWait = document.getElementById('sim-metric-wait');
  const metricCounters = document.getElementById('sim-metric-counters');
  const metricStaff = document.getElementById('sim-metric-staff');
  
  const queueContainer = document.getElementById('sim-queue-list');
  const countersContainer = document.getElementById('sim-counters-list');
  const chartCanvas = document.getElementById('sim-chart-canvas');
  let chartCtx = null;

  if (!btnGenerate) return;
async function loadQueueData() {
console.log("LOAD QUEUE CALLED");
    try {

        const res = await fetch("/queue/dashboard");

        const data = await res.json();

        console.log("Waiting Count:", data.waiting.length);
console.log("Queue Container:", queueContainer);

   metricActive.textContent =
data.waiting.length;

metricWait.textContent = "4m";

metricCounters.textContent =
`${data.serving.length}/4`;
countersContainer.innerHTML = "";

console.log(metricActive);
console.log(metricWait);
console.log(metricCounters);


if(data.waiting.length === 0){

    queueContainer.innerHTML = `
        <div style="
            text-align:center;
            padding:2rem;
            color:var(--text-muted);
        ">
            No active tickets in queue
        </div>
    `;

}else{
console.log("RENDERING WAITING", data.waiting);
    queueContainer.innerHTML =
    data.waiting.map(customer => {

        return `
            <div class="queue-list-row">

                <div style="
                    display:flex;
                    align-items:center;
                    gap:0.75rem;
                ">

                    <span class="queue-list-token">
                        ${customer.tokenNumber}
                    </span>

                    <span style="
                        font-size:0.75rem;
                        color:var(--text-muted);
                    ">
                        ${customer.serviceType}
                    </span>

                </div>

                <span class="queue-list-time">
                    Waiting
                </span>

            </div>
        `;

    }).join('');

}console.log(queueContainer.innerHTML);
countersContainer.innerHTML = "";

for(let i = 1; i <= 4; i++){

    const servingCustomer = data.serving.find(
        customer => Number(customer.counterId) === i
    );

    countersContainer.innerHTML += `
        <div class="counter-row">

            <div class="counter-info">

                <span class="counter-num">
                    Counter ${i}
                </span>

                <span class="counter-type">
                    ${
                        servingCustomer
                        ? servingCustomer.serviceType
                        : "Available"
                    }
                </span>

            </div>

            <div style="
                display:flex;
                align-items:center;
                gap:1rem;
            ">

                ${
                    servingCustomer
                    ?
                    `
                    <span class="counter-serving-token">
                        ${servingCustomer.tokenNumber}
                    </span>

                    <span class="counter-status-tag status-active">
                        Serving
                    </span>
                    `
                    :
                    `
                    <span class="counter-status-tag status-idle">
                        Idle
                    </span>
                    `
                }

            </div>

        </div>
    `;
}
   

} catch(err) {

        console.error(err);

    }

}
  // Simulator State
  let state = {
    totalTickets: 124,
    processedTickets: 121,
    avgWaitTime: 4.5, // minutes
    categories: {
      'VIP': { prefix: 'VIP', count: 12 },
      'Billing': { prefix: 'BIL', count: 35 },
      'Support': { prefix: 'SUP', count: 48 },
      'General': { prefix: 'GEN', count: 29 }
    },
    waitingQueue: [],
    completedTokens:[],
    counters: [
      { id: 1, name: 'Counter 1', type: 'General Query', status: 'Idle', token: '-', efficiency: 92 },
      { id: 2, name: 'Counter 2', type: 'VIP Services', status: 'Idle', token: '-', efficiency: 98 },
      { id: 3, name: 'Counter 3', type: 'Billing & Support', status: 'Idle', token: '-', efficiency: 89 },
      { id: 4, name: 'Counter 4', type: 'Express Desk', status: 'Idle', token: '-', efficiency: 95 }
    ],servingOrder: [],
    autoInterval: null,
    chartPoints: [18, 24, 32, 28, 35, 42, 30] // historical hourly ticket volume
  };

  // Initialize display
  loadQueueData();
  // renderQueue();
  // console.log("renderCounters called");
  // renderCounters();
  // updateMetrics();
  initAnalyticsChart();

function showToast(message) {
  const toast = document.createElement("div");

  toast.textContent = message;

  toast.style.position = "fixed";
  toast.style.top = "85px";
  toast.style.right = "20px";
  toast.style.padding = "12px 20px";
  toast.style.background = "#ef4444";
  toast.style.color = "white";
  toast.style.borderRadius = "8px";
  toast.style.zIndex = "9999";

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

async function completeService() {

    try {

        const servingCustomer =
        (await (await fetch("/queue/dashboard"))
        .json()).serving[0];

        if(!servingCustomer){

            showToast("No active service");
            return;

        }

        await fetch(
            `/queue/complete/${servingCustomer.counterId}`,
            {
                method:"POST"
            }
        );

        await loadQueueData();

        showToast(
            `Token ${servingCustomer.tokenNumber} completed`
        );

    } catch(err){

        console.error(err);

    }

}
  // Button actions
 btnGenerate.addEventListener('click', async () => {

    try {

        const res = await fetch("/queue/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                serviceType: selectService.value,
                customerName: "Guest"
            })
        });

        const data = await res.json();
const qrContainer =
document.getElementById(
    "qrContainer"
);

if(qrContainer){

    qrContainer.innerHTML =
    `<img src="${data.qrCode}" width="200">`;

}
        console.log(data);

        loadQueueData();

        showToast(
            `Token ${data.token.tokenNumber} Generated`
        );

    } catch(err) {

        console.error(err);

    }

});
  btnServe.addEventListener('click', () => {
    serveNext();
  });

  btnReset.addEventListener('click', () => {resetQueue();});

if (completeBtn) {
    completeBtn.addEventListener("click", completeService);
}
 if (checkboxAuto) {
  checkboxAuto.addEventListener('change', (e) => {
    if (e.target.checked) {
      startAutoSimulation();
    } else {
      stopAutoSimulation();
    }
  });
}


  // Serve Next Customer

async function serveNext() {

    try {

        const res = await fetch("/queue/serve",{
            method:"POST"
        });

        const data = await res.json();

        if(!res.ok){

            showToast(data.message);
            return;

        }

        await loadQueueData();

        showToast(
            `Token ${data.tokenNumber} assigned to Counter ${data.counterId}`
        );

    } catch(err){

        console.error(err);

    }

}

  // Reset simulator
  async function resetQueue(){

    const confirmReset = confirm(
        "Are you sure you want to reset the queue?"
    );

    if(!confirmReset){
        return;
    }

    try{

        const res = await fetch("/queue/reset",{
            method:"POST"
        });

        const data = await res.json();

        showToast(data.message);

        await loadQueueData();

    }catch(err){

        console.error(err);

    }

}





  // Automatic Queue Sim intervals
  // function startAutoSimulation() {
  //   if (state.autoInterval) clearInterval(state.autoInterval);
    
  //   state.autoInterval = setInterval(() => {
  //     // 40% chance of ticket generation, 60% chance of serving next
  //     const roll = Math.random();
  //     if (roll < 0.45) {
  //       const services = ['General', 'VIP', 'Billing', 'Support'];
  //       const randomService = services[Math.floor(Math.random() * services.length)];
  //       generateTicket(randomService);
  //     } else {
  //       serveNext();
  //     }

  //     // Randomly make a serving counter idle to simulate breaks
  //     if (Math.random() < 0.15) {
  //       const busyCounters = state.counters.filter(c => c.status === 'Serving');
  //       if (busyCounters.length > 1) {
  //         const target = busyCounters[Math.floor(Math.random() * busyCounters.length)];
  //         target.status = 'Idle';
  //         target.token = '-';
  //         renderCounters();
  //         updateMetrics();
  //       }
  //     }
  //   }, 4500);
  // }

  function stopAutoSimulation() {
    if (state.autoInterval) {
      clearInterval(state.autoInterval);
      state.autoInterval = null;
    }
  }

  // Render Queue List
  function renderQueue() {
    if (state.waitingQueue.length === 0) {
      queueContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.9rem;">
          No active tickets in queue
        </div>
      `;
      return;
    }

    // Show reverse chronological order or chronological
    // Let's show waiting queue from newest at the bottom to oldest at the top
    queueContainer.innerHTML = state.waitingQueue.map(t => {
      // Calculate active elapsed time
      const elapsedMin = Math.floor((Date.now() - t.timestamp) / 60000);
      let timeText = 'Just now';
      if (elapsedMin > 0) {
        timeText = `${elapsedMin} min${elapsedMin > 1 ? 's' : ''} ago`;
      }

      return `
        <div class="queue-list-row">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span class="queue-list-token">${t.token}</span>
            <span style="font-size: 0.75rem; color: var(--text-muted);">${t.service}</span>
          </div>
          <span class="queue-list-time">${timeText}</span>
        </div>
      `;
    }).reverse().join('');
  }

  // Render Counters
  // function renderCounters() {
  //   countersContainer.innerHTML = state.counters.map(c => {
  //     const statusClass = c.status === 'Serving' ? 'status-active' : 'status-idle';
  //     return `
  //       <div class="counter-row">
  //         <div class="counter-info">
  //           <span class="counter-num">${c.name}</span>
  //           <span class="counter-type">${c.type}</span>
  //         </div>
  //         <div style="display: flex; align-items: center; gap: 1rem;">
  //           ${c.status === 'Serving' ? `<span class="counter-serving-token">${c.token}</span>` : ''}
  //           <span class="counter-status-tag ${statusClass}">${c.status}</span>
  //         </div>
  //       </div>
  //     `;
  //   }).join('');
  // }

  // Update Metrics
  function updateMetrics() {
    metricActive.textContent = state.waitingQueue.length;
    metricWait.textContent = state.avgWaitTime > 0 ? `${state.avgWaitTime}m` : '0m';
    
    const activeCounters = state.counters.filter(c => c.status === 'Serving').length;
    metricCounters.textContent = `${activeCounters}/4`;
    
    // Average staff efficiency
    const totalEff = state.counters.reduce((acc, c) => acc + c.efficiency, 0);
    const avgEff = Math.round(totalEff / state.counters.length);
    metricStaff.textContent = `${avgEff}%`;
  }

  // Drawing Canvas Chart
  function initAnalyticsChart() {
    if (!chartCanvas) return;
    chartCtx = chartCanvas.getContext('2d');
    
    // Handle Retina displays
    const dpr = window.devicePixelRatio || 1;
    const rect = chartCanvas.getBoundingClientRect();
    chartCanvas.width = rect.width * dpr;
    chartCanvas.height = 120 * dpr;
    chartCtx.scale(dpr, dpr);

    // Redraw on window resize
    window.addEventListener('resize', () => {
      const newRect = chartCanvas.getBoundingClientRect();
      chartCanvas.width = newRect.width * dpr;
      chartCanvas.height = 120 * dpr;
      chartCtx.scale(dpr, dpr);
      drawChart();
    });

    drawChart();
  }

  function drawChart() {
    if (!chartCtx || !chartCanvas) return;
    
    const dpr = window.devicePixelRatio || 1;
    const width = chartCanvas.width / dpr;
    const height = chartCanvas.height / dpr;
    
    chartCtx.clearRect(0, 0, width, height);

    const points = state.chartPoints;
    const maxVal = Math.max(...points, 10);
    
    const padding = 15;
    const chartHeight = height - padding * 2;
    const chartWidth = width - padding * 2;
    const stepX = chartWidth / (points.length - 1);

    // Get primary color from CSS variable or fallback
    const theme = document.documentElement.getAttribute('data-theme');
    const primaryColor = theme === 'dark' ? '#3B82F6' : '#2563EB';

    // Draw background gradient grid lines
    chartCtx.strokeStyle = theme === 'dark' ? '#1F2937' : '#E2E8F0';
    chartCtx.lineWidth = 1;
    chartCtx.beginPath();
    for (let i = 0; i < 4; i++) {
      const y = padding + (chartHeight / 3) * i;
      chartCtx.moveTo(padding, y);
      chartCtx.lineTo(width - padding, y);
    }
    chartCtx.stroke();

    // Create gradient for area under the line
    const gradient = chartCtx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, theme === 'dark' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(37, 99, 235, 0.25)');
    gradient.addColorStop(1, 'transparent');

    // Draw smooth spline
    chartCtx.beginPath();
    const getCoordinates = (index) => {
      const x = padding + index * stepX;
      const val = points[index];
      const y = padding + chartHeight - (val / maxVal) * chartHeight;
      return { x, y };
    };

    const firstPoint = getCoordinates(0);
    chartCtx.moveTo(firstPoint.x, firstPoint.y);

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = getCoordinates(i);
      const p1 = getCoordinates(i + 1);
      
      // Control points for bezier curve
      const cpX1 = p0.x + stepX / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + stepX / 2;
      const cpY2 = p1.y;

      chartCtx.bezierCurveTo(cpX1, cpY1, cpX2, cpY2, p1.x, p1.y);
    }

    // Complete line path
    chartCtx.strokeStyle = primaryColor;
    chartCtx.lineWidth = 3;
    chartCtx.stroke();

    // Complete area path for gradient filling
    chartCtx.lineTo(padding + (points.length - 1) * stepX, height - padding);
    chartCtx.lineTo(padding, height - padding);
    chartCtx.closePath();
    chartCtx.fillStyle = gradient;
    chartCtx.fill();

    // Draw circle points and values
    points.forEach((val, idx) => {
      const { x, y } = getCoordinates(idx);
      
      chartCtx.fillStyle = primaryColor;
      chartCtx.beginPath();
      chartCtx.arc(x, y, 4, 0, Math.PI * 2);
      chartCtx.fill();
      
      chartCtx.strokeStyle = theme === 'dark' ? '#0F172A' : '#FFFFFF';
      chartCtx.lineWidth = 1.5;
      chartCtx.stroke();
      
      // Text values
      chartCtx.fillStyle = theme === 'dark' ? '#94A3B8' : '#64748B';
      chartCtx.font = '10px Inter, sans-serif';
      chartCtx.textAlign = 'center';
      chartCtx.fillText(val, x, y - 10);
    });
  }
  // Periodic time elapsed update
//   setInterval(() => {
//     renderQueue();
//   }, 10000);
}
