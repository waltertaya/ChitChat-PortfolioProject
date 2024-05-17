const passwordInput = document.getElementById('password');
const passwordStrengthText = document.getElementById('password-strength');
const submitButton = document.getElementById('submit-btn');

passwordInput.addEventListener('input', function() {
  const password = passwordInput.value;
  const strength = getPasswordStrength(password);
  updatePasswordStrengthUI(strength);
  if (strength === 'strong' && password.length >= 8) {
    submitButton.removeAttribute('disabled');
  } else {
    submitButton.setAttribute('disabled', true);
  }
});

function getPasswordStrength(password) {
  if (password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*()_+[\]{};':"\\|,.<>/?~`]/.test(password)) {
    return 'strong';
  } else if (password.length >= 8 && ((/[a-z]/.test(password) && /[A-Z]/.test(password)) || (/[a-z]/.test(password) && /\d/.test(password)) || (/[A-Z]/.test(password) && /\d/.test(password)))) {
    return 'medium';
  } else {
    return 'weak';
  }
}

function updatePasswordStrengthUI(strength) {
  passwordStrengthText.textContent = 'Password Strength: ';
  if (strength === 'weak') {
    passwordStrengthText.textContent += 'Weak';
    passwordStrengthText.className = 'weak';
  } else if (strength === 'medium') {
    passwordStrengthText.textContent += 'Medium';
    passwordStrengthText.className = 'medium';
  } else {
    passwordStrengthText.textContent += 'Strong';
    passwordStrengthText.className = 'strong';
  }
}

const toggleCheckbox = document.getElementById('toggle-password');

toggleCheckbox.addEventListener('change', function() {
  if (toggleCheckbox.checked) {
    // If checked, show password
    passwordInput.type = 'text';
  } else {
    // If unchecked, hide password
    passwordInput.type = 'password';
  }
});
