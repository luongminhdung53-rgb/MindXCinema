let emailInput = document.querySelector('input[type="email"]');
let passwordInput = document.querySelector('input[type="password"]');
let signInButton = document.getElementById('button');

signInButton.addEventListener('click', function (event) {
  let emailValue = emailInput.value.trim();
  let passwordValue = passwordInput.value.trim();

  if (emailValue === "") {
    alert("Please enter your email address!"); 
    event.preventDefault();                   
    emailInput.focus();                       
    return;                                   
  }

  if (passwordValue === "") {
    alert("Please enter your password!");     
    event.preventDefault();                   
    passwordInput.focus();                    
    return;                                   
  }

  if (passwordValue.length < 8 || passwordValue.length > 20) {
    alert("Password must be between 8 and 20 characters long!"); 
    event.preventDefault();                   
    passwordInput.focus();                    
    return;                                   
  }

  alert("Sign in successfully! Redirecting you now...");
});