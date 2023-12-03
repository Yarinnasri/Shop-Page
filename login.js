const newUserBtn = document
  .getElementById("new-account")
  .addEventListener("click", registerPage);
const loginForm = document.getElementById("form-login");
const registerForm = document.getElementById("form-register");
const h1Html = document.getElementsByTagName("h1")[0];
const users = getUsers();

function registerPage() {
  loginForm.style.display = "none";
  registerForm.style.display = "flex";
  h1Html.innerText = "Register";

  const usernameInput = document.getElementById("register-username");
  const emailInput = document.getElementById("register-email");
  const fullnameInput = document.getElementById("register-fullname");
  const passwordInput = document.getElementById("register-password");

  registerForm.addEventListener("submit", registerFormSubmitHandler);

  function registerFormSubmitHandler(event) {
    event.preventDefault();
    if (isUserExist(emailInput.value)) {
      console.log("email exist");
      alert("User has been created with this email already.");
    } else if (
      validate1(emailInput.value, passwordInput.value) &&
      validate2(fullnameInput.value, usernameInput.value)
    ) {
      console.log("new user has been created");
      createUser();
      loginForm.style.display = "flex";
      registerForm.style.display = "none";
      h1Html.innerText = "Login";

      usernameInput.value = "";
      emailInput.value = "";
      fullnameInput.value = "";
      passwordInput.value = "";
      registerForm.removeEventListener("submit", registerFormSubmitHandler);
    } else {
      console.log("invalid information");
      alert("Account information is invalid!");
    }
  }

  function createUser() {
    const userNew = new User(
      `${usernameInput.value}`,
      `${emailInput.value}`,
      `${fullnameInput.value}`,
      `${passwordInput.value}`,
      null
    );

    const existingUsers = JSON.parse(sessionStorage.getItem("users")) || [];
    existingUsers.push([emailInput.value, userNew]);
    sessionStorage.setItem("users", JSON.stringify(existingUsers));
  }
}

function User(username, email, fullname, password, lastLoginDate) {
  this.username = username;
  this.email = email;
  this.fullname = fullname;
  this.password = password;
  this.lastLoginDate = lastLoginDate;
}

function getUsers() {
  if (!!sessionStorage.getItem("users")) {
    const usersArray = JSON.parse(sessionStorage.getItem("users"));

    return new Map(usersArray);
  } else {
    const user1 = new User(
      "Guest1",
      "guest111@gmail.com",
      "Guest Guest",
      "G123456",
      null
    );
    const user2 = new User(
      "Admin1",
      "admin123@gmail.com",
      "Admin Admin",
      "A123456",
      null
    );

    const users = [
      [user1.email, user1],
      [user2.email, user2],
    ];

    sessionStorage.setItem("users", JSON.stringify(users));
    return new Map(users);
  }
}

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!validate1(email, password)) {
      alert("Email or password are invalid!");
    } else if (!isUserExist(email)) {
      alert("User was not found");
    } else {
      updateUserLastLoginDate(email);
      sessionStorage.setItem("loggedInUserEmail", email);
      window.location.href = "index.html";
    }
  });
}

function validate1(email, password) {
  const emailRegex = /^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

  return (
    emailRegex.test(email) &&
    password.length >= 6 &&
    password.toLowerCase() !== password &&
    !/\s/.test(password)
  );
}

function validate2(fullname, username) {
  const fullnamePattern = /^[A-Z][a-z]{2,8} [A-Z][a-z]{2,8}$/;
  const usernamePattern = /^[a-zA-Z0-9]{3,16}$/;

  return fullnamePattern.test(fullname) && usernamePattern.test(username);
}

function isUserExist(email) {
  return users.has(email);
}

// "DD-MM-YYYY HH:mm"
function updateUserLastLoginDate(email) {
  const now = new Date();
  const day = now.getDate() < 10 ? "0" + now.getDate() : "" + now.getDate();
  const month =
    now.getMonth() + 1 < 10
      ? "0" + (now.getMonth() + 1)
      : "" + (now.getMonth() + 1);

  const year = "" + now.getFullYear();

  const hours =
    now.getHours() < 10 ? "0" + now.getHours() : "" + now.getHours();
  const minutes =
    now.getMinutes() < 10 ? "0" + now.getMinutes() : "" + now.getMinutes();

  let datetime = `${day}-${month}-${year} ${hours}:${minutes}`;

  users.get(email).lastLoginDate = datetime;
}
