let registerForm = document.querySelector('form');
    let usernameInput = document.getElementById('username');
    let passwordInput = document.getElementById('password');
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
let listAccounts = JSON.parse(localStorage.getItem('accounts')) || [];
let ifUserExist = listAccounts.some(account => account.username === username);
if (isUserExist) {
  alert("Account existed, try again")
} else {
  let newUser ={
    username: username,
    password: password
  };
listAccounts.push(newUser);
localStorage.setItem('accounts', JSON.stringify(listAccounts));
  alert("Account created successfully! Redirecting to login page...");
  registerForm.reset();
  window.location.href = "signin.html";
}
});