"use strict";

const submitBtn = document.getElementById("submit-btn");
const nameReplace = document.querySelector(".name-replace");
const emailReplace = document.querySelector(".email-replace");
const formArea = document.querySelector(".form-area");
const successArea = document.querySelector(".success-area");
const userForm = document.querySelector(".user-form");
const main = document.querySelector("main");

userForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const fullName = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const dateOfBirth = document.getElementById("date-of-birth").value;
  //   console.log(fullName);

  const formattedName = fullName
    .split(" ")
    .filter((word) => word.trim() !== "")
    .map((word) => {
      return word[0].toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");

  nameReplace.textContent = formattedName;
  emailReplace.textContent = email;

  formArea.classList.remove("show");
  formArea.classList.add("fade");
  // formArea.classList.add("hidden");

  successArea.classList.remove("hidden");
  successArea.classList.add("show");
  successArea.classList.remove("fade");

  main.classList.remove("sm:max-w-[827px]");
  main.classList.add("sm:max-w-[657px]");
});
