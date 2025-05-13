
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const inputs = form.querySelectorAll("input[type='text'], input[type='email']");
  const fileInput = form.querySelector("input[type='file']");
  const checkbox = form.querySelector("input[type='checkbox']");
  const counsellingRadios = form.querySelectorAll("input[name='counselling']");
  const stateSelect = document.getElementById("state");
  const dobInput = document.getElementById("dob");
  const dobError = document.getElementById("dob-error");
  const today = new Date();

  // Set max and min dates for DOB field
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    .toISOString().split("T")[0];
  const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate())
    .toISOString().split("T")[0];
  dobInput.max = maxDate;
  dobInput.min = minDate;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    // Clear previous errors
    form.querySelectorAll(".error").forEach(el => el.remove());

    // Validate required fields
    inputs.forEach(input => {
      if (!input.value.trim()) {
        showError(input, "*Required");
        isValid = false;
      }
    });

    // Phone number validation
    const phoneInput = Array.from(inputs).find(i => i.previousElementSibling.innerText === "Phone number");
    const phoneRegex = /^[0-9]{10}$/;
    if (phoneInput && !phoneRegex.test(phoneInput.value.trim())) {
      showError(phoneInput, "Enter a valid 10-digit number");
      isValid = false;
    }

    // Email validation
    const emailInput = Array.from(inputs).find(i => i.type === "email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput && !emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, "Enter a valid email address");
      isValid = false;
    }

    // DOB validation
    if (!dobInput.value) {
      dobError.innerText = "*Required";
      dobError.classList.remove("hidden");
      isValid = false;
    } else {
      const dob = new Date(dobInput.value);
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      const dayDiff = today.getDate() - dob.getDate();
      const isBirthdayPassed = monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0);
      const actualAge = isBirthdayPassed ? age : age - 1;

      if (dob > today) {
        dobError.innerText = "Date of birth cannot be in the future.";
        dobError.classList.remove("hidden");
        isValid = false;
      } else if (actualAge < 18) {
        dobError.innerText = "You must be at least 18 years old.";
        dobError.classList.remove("hidden");
        isValid = false;
      } else if (actualAge > 100) {
        dobError.innerText = "Age must not exceed 100 years.";
        dobError.classList.remove("hidden");
        isValid = false;
      } else {
        dobError.classList.add("hidden");
      }
    }

    // Address length check
    const addressInput = Array.from(inputs).find(i => i.previousElementSibling.innerText === "Address");
    if (addressInput && addressInput.value.length > 120) {
      showError(addressInput, "Max 120 characters allowed");
      isValid = false;
    }

    // State validation
    const stateError = document.getElementById("state-error");
    if (!stateSelect.value) {
      stateError.classList.remove("hidden");
      isValid = false;
    } else {
      stateError.classList.add("hidden");
    }

    const genderSelect = document.getElementById("gender");

    if (!genderSelect.value) {
      document.getElementById("gender-error").classList.remove("hidden");
      isValid = false;
    } else {
      document.getElementById("gender-error").classList.add("hidden");
    }


    // CV upload validation
    if (fileInput.files.length === 0) {
      showError(fileInput.parentElement, "*Upload required");
      isValid = false;
    }

    // Counselling radio validation
    const counsellingError = document.getElementById("counselling-error");
    if (![...counsellingRadios].some(r => r.checked)) {
      counsellingError.classList.remove("hidden");
      isValid = false;
    } else {
      counsellingError.classList.add("hidden");
    }

    // Terms checkbox validation
    const termsError = document.getElementById("terms-error");
    if (!checkbox.checked) {
      termsError.classList.remove("hidden");
      isValid = false;
    } else {
      termsError.classList.add("hidden");
    }

    if (isValid) {
      document.getElementById("success-popup").classList.remove("hidden");
    }
  });

  function showError(element, message) {
    const error = document.createElement("p");
    error.innerText = message;
    error.className = "error text-red-500 text-xs mt-1";
    element.parentElement.appendChild(error);
  }

  document.getElementById("popup-ok").addEventListener("click", () => {
    document.getElementById("success-popup").classList.add("hidden");
    form.reset();
    form.querySelectorAll(".error").forEach(el => el.remove());
  });
});