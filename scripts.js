// Dark mode functionality
document.addEventListener('DOMContentLoaded', function() {
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Set up theme toggle button
  const themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle';
  themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  themeToggle.setAttribute('aria-label', 'Toggle dark mode');
  document.body.appendChild(themeToggle);
  
  themeToggle.addEventListener('click', function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  });

  // FAQ Accordion Functionality
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {
      // Close all other items
      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains("active")) {
          otherItem.classList.remove("active");
          const toggle = otherItem.querySelector(".faq-toggle i");
          toggle.classList.remove("fa-minus");
          toggle.classList.add("fa-plus");
        }
      });

      // Toggle current item
      item.classList.toggle("active");
      const toggle = item.querySelector(".faq-toggle i");
      if (item.classList.contains("active")) {
        toggle.classList.remove("fa-plus");
        toggle.classList.add("fa-minus");
      } else {
        toggle.classList.remove("fa-minus");
        toggle.classList.add("fa-plus");
      }
    });
  });

  // Enhanced Form Submission
  const orderForm = document.getElementById("orderForm");
  if (orderForm) {
    orderForm.addEventListener("submit", async function(e) {
      e.preventDefault();
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      
      // Show loading state
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      try {
        const formData = new FormData(this);
        
        // Add additional hidden fields
        formData.append('_replyto', 'aryasjaiswal@gmail.com');
        formData.append('_cc', 'aryasjaiswal@gmail.com');
        
        const response = await fetch(this.action, {
          method: "POST",
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // Success message
          this.innerHTML = `
            <div class="success-message">
              <i class="fas fa-check-circle"></i>
              <h2>Order Submitted Successfully!</h2>
              <p>We'll contact you within 24 hours with your design draft.</p>
              <p>A confirmation has been sent to your email.</p>
              <a href="index.html" class="cta-btn fun-font">Back to Home</a>
            </div>
          `;
          
          // Track conversion
          if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
              'send_to': 'AW-YOUR_CONVERSION_ID'
            });
          }
        } else {
          throw new Error("Form submission failed");
        }
      } catch (error) {
        console.error('Form submission error:', error);
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        
        // Show error message
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.innerHTML = `
          <i class="fas fa-exclamation-circle"></i>
          <p>There was a problem submitting your order. Please try again or contact us directly at <a href="mailto:aryasjaiswal@gmail.com">aryasjaiswal@gmail.com</a></p>
        `;
        this.insertBefore(errorElement, submitBtn.parentNode);
        
        // Scroll to error
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // Smooth scrolling for navigation
  document.querySelectorAll("nav a").forEach((anchor) => {
    anchor.addEventListener("click", function(e) {
      if (this.getAttribute("href").startsWith("#")) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: "smooth"
          });
        }
      }
    });
  });

  // Add current date/year to pages
  const currentDateElements = document.querySelectorAll("#current-date, #current-year");
  if (currentDateElements.length > 0) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const dateString = new Date().toLocaleDateString("en-US", options);
    const yearString = new Date().getFullYear();

    currentDateElements.forEach((el) => {
      if (el.id === "current-date") {
        el.textContent = dateString;
      } else if (el.id === "current-year") {
        el.textContent = yearString;
      }
    });
  }

  // Initialize tooltips
  const tooltipElements = document.querySelectorAll('[data-tooltip]');
  tooltipElements.forEach(el => {
    el.addEventListener('mouseenter', showTooltip);
    el.addEventListener('mouseleave', hideTooltip);
  });

  function showTooltip(e) {
    const tooltipText = this.getAttribute('data-tooltip');
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipText;
    document.body.appendChild(tooltip);
    
    const rect = this.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width/2 - tooltip.offsetWidth/2}px`;
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
  }

  function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
      tooltip.remove();
    }
  }
});