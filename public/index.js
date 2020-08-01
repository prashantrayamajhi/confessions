const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const passowrd = document.getElementById("password");
const passowrd2 = document.getElementById("confirm-password");

function showError(input, message) {
  let formControl = input.parentElement;
  formControl.className = "form-control error";
  let small = formControl.querySelector("small");

  small.innerText = message;
}
function showSuccess(input) {
  let formControl = input.parentElement;
  formControl.className = "form-control success";
}
function validator(inputArr) {
  inputArr.forEach(function (input) {
    if (input.value.trim() == "") {
      showError(input, input.id + " is required");
    } else {
      showSuccess(input);
    }
  });
}
function checkLength(input, min, max) {
  if (input.value.length < min) {
    console.log(input.value.length);
    showError(input, input.id + " too short");
  } else if (input.value.length > max) {
    showError(input, input.id + " too long");
  } else {
    showSuccess(input);
  }
}
function checkPass(pass1, pass2) {
  if (pass1.value !== pass2.value) {
    showError(passowrd2, "Passwords Don't Match");
    showError(passowrd, "Passwords Don't Match");
  } else {
    showSuccess(passowrd2);
  }
}
form.addEventListener("submit", function (e) {
  e.preventDefault();
  validator([username, email, passowrd, passowrd2]);
  checkLength(username, 5, 12);
  checkLength(passowrd, 7, 15);
  checkPass(passowrd, passowrd2);
});
