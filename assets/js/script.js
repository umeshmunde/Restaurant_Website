'use strict';



/**
 * navbar toggle
 */

const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const menuToggleBtn = document.querySelector("[data-menu-toggle-btn]");

menuToggleBtn.addEventListener("click", function () {
  navbar.classList.toggle("active");
  this.classList.toggle("active");
});

for (let i = 0; i < navbarLinks.length; i++) {
  navbarLinks[i].addEventListener("click", function () {
    navbar.classList.toggle("active");
    menuToggleBtn.classList.toggle("active");
  });
}



/**
 * header sticky & back to top
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});



/**
 * search box toggle
 */

const searchBtn = document.querySelector("[data-search-btn]");
const searchContainer = document.querySelector("[data-search-container]");
const searchSubmitBtn = document.querySelector("[data-search-submit-btn]");
const searchCloseBtn = document.querySelector("[data-search-close-btn]");

const searchBoxElems = [searchBtn, searchSubmitBtn, searchCloseBtn].filter(Boolean);

if (searchContainer && searchBoxElems.length) {
  for (let i = 0; i < searchBoxElems.length; i++) {
    searchBoxElems[i].addEventListener("click", function () {
      searchContainer.classList.toggle("active");
      document.body.classList.toggle("active");
    });
  }
}



/**
 * move cycle on scroll
 */

const deliveryBoy = document.querySelector("[data-delivery-boy]");

let deliveryBoyMove = -80;
let lastScrollPos = 0;

if (deliveryBoy) {
  window.addEventListener("scroll", function () {
    let deliveryBoyTopPos = deliveryBoy.getBoundingClientRect().top;

    if (deliveryBoyTopPos < 500 && deliveryBoyTopPos > -250) {
      let activeScrollPos = window.scrollY;

      if (lastScrollPos < activeScrollPos) {
        deliveryBoyMove += 1;
      } else {
        deliveryBoyMove -= 1;
      }

      lastScrollPos = activeScrollPos;
      deliveryBoy.style.transform = `translateX(${deliveryBoyMove}px)`;
    }
  });
}

/**
 * smooth scroll helpers for reservation / contact
 */

function scrollToSelector(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Header "Reservation" button -> footer booking form
const reservationBtn = document.querySelector(".header-btn-group .btn.btn-hover");
if (reservationBtn) {
  reservationBtn.addEventListener("click", () => scrollToSelector("#book-table"));
}

// Hero "Book A Table" button
const heroBookBtn = document.querySelector(".hero .btn");
if (heroBookBtn) {
  heroBookBtn.addEventListener("click", () => scrollToSelector("#book-table"));
}

// Non-menu "Order Now" buttons (about, cta, delivery, banner) -> booking form
const reservationOrderButtons = document.querySelectorAll(
  ".about .btn, .cta .btn, .delivery .btn, .banner .btn"
);
reservationOrderButtons.forEach((btn) => {
  btn.addEventListener("click", () => scrollToSelector("#book-table"));
});

/**
 * Food order modal open from food-menu cards
 */

const orderContainer = document.querySelector("[data-order-container]");
const orderForm = document.querySelector("[data-order-form]");
const orderItemSummary = document.querySelector("[data-order-item-summary]");
const orderItemNameInput = document.querySelector("[data-order-item-name]");
const orderItemPriceInput = document.querySelector("[data-order-item-price]");
const orderCloseBtn = document.querySelector("[data-order-close-btn]");
const orderCancelBtn = document.querySelector("[data-order-cancel-btn]");

function openOrderModal(itemName, priceText) {
  if (!orderContainer || !orderItemSummary || !orderItemNameInput || !orderItemPriceInput) return;

  orderItemSummary.textContent = `${itemName} - ${priceText}`;
  orderItemNameInput.value = itemName;
  orderItemPriceInput.value = priceText.replace(/[^0-9.]/g, "");

  orderContainer.classList.add("active");
  document.body.classList.add("active");
}

function closeOrderModal() {
  if (!orderContainer) return;
  orderContainer.classList.remove("active");
  document.body.classList.remove("active");
  if (orderForm) orderForm.reset();
}

if (orderCloseBtn) {
  orderCloseBtn.addEventListener("click", closeOrderModal);
}
if (orderCancelBtn) {
  orderCancelBtn.addEventListener("click", closeOrderModal);
}

// Attach to each food-menu "Order Now" button
const foodOrderButtons = document.querySelectorAll(".food-menu-btn");
foodOrderButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".food-menu-card");
    if (!card) return;

    const titleEl = card.querySelector(".card-title");
    const priceEl = card.querySelector(".price");

    const itemName = titleEl ? titleEl.textContent.trim() : "Food Item";
    const priceText = priceEl ? priceEl.textContent.trim() : "";

    openOrderModal(itemName, priceText || "");
  });
});

/**
 * Place order form submit -> backend API
 */

if (orderForm) {
  orderForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(orderForm);
    // Normalize phone to digits-only before sending to server
    const rawPhone = (formData.get("customer_phone") || '').toString();
    const normalizedPhone = rawPhone.replace(/\D/g, '');

    const payload = {
      customer_name: formData.get("customer_name"),
      customer_email: formData.get("customer_email"),
      customer_phone: normalizedPhone,
      customer_address: formData.get("customer_address"),
      item_name: formData.get("item_name"),
      item_price: formData.get("item_price"),
      quantity: formData.get("quantity"),
    };

    const submitButton = orderForm.querySelector(".order-submit-btn");
    const originalText = submitButton ? submitButton.textContent : "";
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Placing...";
    }

    try {
      const response = await fetch("/api/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Could not place order. Please try again.");
      } else {
        alert(data.message || "Your order has been placed successfully!");
        closeOrderModal();
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Unable to connect to the server. Please try again later.");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalText || "Confirm Order";
      }
    }
  });
}

/**
 * Book a Table form submit -> backend API
 */

const bookingForm = document.querySelector("[data-booking-form]");
if (bookingForm) {
  bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(bookingForm);
    
    // Convert total_person to integer
    const totalPerson = parseInt(formData.get("total_person"));
    if (!totalPerson || totalPerson < 1) {
      alert("Please select the number of persons.");
      return;
    }
    
    // Get booking date and convert to proper datetime format
    const bookingDate = formData.get("booking_date");
    if (!bookingDate) {
      alert("Please select a date and time for your reservation.");
      return;
    }
    
    const payload = {
      full_name: formData.get("full_name"),
      email_address: formData.get("email_address"),
      total_person: totalPerson,
      booking_date: bookingDate,
      message: formData.get("message"),
    };

    const submitButton = bookingForm.querySelector("button[type='submit']");
    const originalText = submitButton ? submitButton.textContent : "";
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Booking...";
    }

    try {
      const response = await fetch("/api/book-table", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Something went wrong. Please try again.");
      } else {
        alert(data.message || "Your table has been booked successfully!");
        bookingForm.reset();
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Unable to connect to the server. Please try again later.");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalText || "Book a Table";
      }
    }
  });
}

/**
 * "My Orders" viewer on main website
 */

const myOrdersForm = document.querySelector("[data-my-orders-form]");
const myOrdersBody = document.querySelector("[data-my-orders-body]");

if (myOrdersForm && myOrdersBody) {
  myOrdersForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(myOrdersForm);
    // Normalize lookup phone to digits-only to match stored values
    const phone = (formData.get("customer_phone") || "").toString().replace(/\D/g, '').trim();
    if (!phone) return;

    myOrdersBody.innerHTML = `
      <tr>
        <td colspan="5" style="padding:8px; border:1px solid #eee; text-align:center;">
          Loading your orders...
        </td>
      </tr>
    `;

    try {
      const response = await fetch("/api/admin/orders");
      const data = await response.json();

      if (!response.ok || !data.success) {
        myOrdersBody.innerHTML = `
          <tr>
            <td colspan="5" style="padding:8px; border:1px solid #eee; text-align:center;">
              Could not load orders. Please try again later.
            </td>
          </tr>
        `;
        return;
      }

      // Compare by last-10-digits (server now normalizes to last 10 on insert)
      const last10 = (s) => {
        const d = (s || '').toString().replace(/\D/g, '').trim();
        return d.length > 10 ? d.slice(-10) : d;
      };

      const lookupLast10 = last10(phone);
      const orders = (data.orders || []).filter((o) => {
        const storedLast10 = last10(o.customer_phone);
        return storedLast10 && lookupLast10 && storedLast10 === lookupLast10;
      });

      if (!orders.length) {
        myOrdersBody.innerHTML = `
          <tr>
            <td colspan="5">
              No orders found for this phone number.
            </td>
          </tr>
        `;
        return;
      }

      myOrdersBody.innerHTML = orders
        .map(
          (o) => `
          <tr>
            <td>${o.id}</td>
            <td>${o.item_name || ""}</td>
            <td>${o.quantity}</td>
            <td>${o.item_price}</td>
            <td>${o.created_at || ""}</td>
          </tr>
        `
        )
        .join("");
    } catch (error) {
      console.error("My Orders error:", error);
      myOrdersBody.innerHTML = `
        <tr>
          <td colspan="5">
            Unable to connect to the server. Please try again later.
          </td>
        </tr>
      `;
    }
  });
}
