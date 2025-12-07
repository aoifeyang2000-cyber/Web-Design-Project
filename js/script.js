const specials = [
  {
    name: "Gingerbread Latte & Mince Pie",
    description: "Spiced gingerbread latte topped with whipped cream, served with a homemade mince pie.",
    price: "€7.50"
  },
  {
    name: "Cranberry Orange Scone & Flat White",
    description: "Freshly baked cranberry-orange scone with butter and jam, paired with a flat white.",
    price: "€6.90"
  },
  {
    name: "Peppermint Hot Chocolate & Cookie",
    description: "Rich hot chocolate with peppermint, marshmallows and a warm chocolate chip cookie.",
    price: "€6.50"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  initSpecial();
  initMenuFilters();
  initBookingForm();
  initBackToTop();
  updateOpenStatus();
});

// 1. Christmas Specials
function initSpecial() {
  const container = document.getElementById("specials-container");
  if (!container || !specials.length) return;

  container.innerHTML = "";

  specials.forEach((item) => {
    const col = document.createElement("div");
    col.className = "col-md-4";

    col.innerHTML = `
      <div class="card h-100 shadow-sm text-center">
        <div class="card-body">
          <h3 class="h5 mb-3">${item.name}</h3>
          <p>${item.description}</p>
          <p class="fw-bold">${item.price}</p>
        </div>
      </div>
    `;

    container.appendChild(col);
  });
}

// 2. Menu.html
function initMenuFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll(".menu-item");

  if (!buttons.length || !items.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.getAttribute("data-category");

      // Active button styling
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Cards
      items.forEach((item) => {
        const itemCat = item.getAttribute("data-category");
        if (category === "all" || itemCat === category) {
          item.classList.remove("d-none");
        } else {
          item.classList.add("d-none");
        }
      });
    });
  });
}

// 3. Booking form validation (booking.html)
function initBookingForm() {
  const form = document.getElementById("booking-form");
  if (!form) return;

  const dateInput = document.getElementById("date");
  const timeInput = document.getElementById("time");
  const guestsInput = document.getElementById("guests");
  const successMessage = document.getElementById("booking-success");
  const requests = document.getElementById("requests");
  const charCount = document.getElementById("char-count");

  // Character counter for special requests
  if (requests && charCount) {
    charCount.textContent = "0 / 200 characters";
    requests.addEventListener("input", () => {
      charCount.textContent = `${requests.value.length} / 200 characters`;
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    if (!form.checkValidity()) {
      isValid = false;
    }

    if (dateInput) {
      const today = new Date();
      const selectedDate = dateInput.value ? new Date(dateInput.value) : null;
      today.setHours(0, 0, 0, 0);

      if (!selectedDate || selectedDate < today) {
        dateInput.classList.add("is-invalid");
        isValid = false;
      } else {
        dateInput.classList.remove("is-invalid");
      }
    }

    // Guests between 1 and 10
    if (guestsInput) {
      const guests = parseInt(guestsInput.value, 10);
      if (isNaN(guests) || guests < 1 || guests > 10) {
        guestsInput.classList.add("is-invalid");
        isValid = false;
      } else {
        guestsInput.classList.remove("is-invalid");
      }
    }

    // Opening hours
    if (timeInput && timeInput.value) {
      const [hourStr, minuteStr] = timeInput.value.split(":");
      const hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);
      const totalMinutes = hour * 60 + minute;

      const now = new Date();
      const day = now.getDay(); // 0 = Sunday
      let openTime, closeTime;

      if (day >= 1 && day <= 5) {
        openTime = 8 * 60;
        closeTime = 16 * 60;
      } else {
        openTime = 9 * 60;
        closeTime = 17 * 60;
      }

      if (totalMinutes < openTime || totalMinutes > closeTime) {
        timeInput.classList.add("is-invalid");
        isValid = false;
      } else {
        timeInput.classList.remove("is-invalid");
      }
    }

    if (!isValid) {
      form.classList.add("was-validated");
      return;
    }

    // Successful booking
    form.reset();
    form.classList.remove("was-validated");
    if (charCount) charCount.textContent = "0 / 200 characters";

    if (successMessage) {
      successMessage.classList.remove("d-none");
      successMessage.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// 4. Back To Top button behaviour
function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      btn.classList.remove("invisible");
    } else {
      btn.classList.add("invisible");
    }
  });
}

// 5. Open / closed status (booking.html)
function updateOpenStatus() {
  const badge = document.getElementById("open-status");
  if (!badge) return;

  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const hour = now.getHours();
  const minute = now.getMinutes();
  const totalMinutes = hour * 60 + minute;

  let openTime, closeTime;

  // Opening hours:
  if (day >= 1 && day <= 5) {
    openTime = 8 * 60;
    closeTime = 16 * 60;
  } else {
    openTime = 9 * 60;
    closeTime = 17 * 60;
  }

  if (totalMinutes >= openTime && totalMinutes <= closeTime) {
    badge.textContent = "We’re open now!";
    badge.classList.remove("bg-secondary");
    badge.classList.add("bg-success");
  } else {
    badge.textContent = "We’re currently closed";
    badge.classList.remove("bg-success");
    badge.classList.add("bg-secondary");
  }
}
