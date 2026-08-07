let fullNameInput = document.querySelector('input[placeholder="Enter your full name"]');
let emailInput = document.querySelector('input[type="email"]');
let passwordInput = document.querySelector('input[placeholder="Enter your password"]');
let confirmPasswordInput = document.querySelector('input[placeholder="Confirm your password"]');
let termsCheckbox = document.querySelector('.terms input[type="checkbox"]');
let signUpButton = document.getElementById('button');

signUpButton.addEventListener('click', function (event) {
  event.preventDefault();

  let fullNameValue = fullNameInput.value.trim();
  let emailValue = emailInput.value.trim();
  let passwordValue = passwordInput.value.trim();
  let confirmPasswordValue = confirmPasswordInput.value.trim();

  if (fullNameValue === "") {
    alert("Please enter your full name!");
    fullNameInput.focus();
    return;
  }
  if (fullNameValue.length < 6 || fullNameValue.length > 18) {
    alert("Username must be between 6 and 18 characters!");
    fullNameInput.focus();
    return;
  }

  if (emailValue === "") {
    alert("Please enter your email address!");
    emailInput.focus();
    return;
  }

  if (passwordValue === "") {
    alert("Please enter your password!");
    passwordInput.focus();
    return;
  }
  if (passwordValue.length < 8 || passwordValue.length > 20) {
    alert("Password must be between 8 and 20 characters!");
    passwordInput.focus();
    return;
  }

  if (confirmPasswordValue === "") {
    alert("Please confirm your password!");
    confirmPasswordInput.focus();
    return;
  }
  if (passwordValue !== confirmPasswordValue) {
    alert("Passwords do not match! Please check again.");
    confirmPasswordInput.focus();
    return;
  }

  if (termsCheckbox.checked === false) {
    alert("You must agree to the Terms & Conditions to proceed!");
    return;
  }

  alert("Account created successfully! Redirecting to login page...");
  window.location.href = "11.html";
});