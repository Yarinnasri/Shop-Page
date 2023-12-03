function User(username, email, fullname, password, lastLoginDate) {
    this.username = username;
    this.email = email;
    this.fullname = fullname;
    this.password = password;
    this.lastLoginDate = lastLoginDate;
}

const user1 = new User("user1", "user1@gmail.com", "User 1", "A123456", null);
const user2 = new User("user2", "user2@gmail.com", "User 2", "A123456", null);
const user3 = new User("user3", "user3@gmail.com", "User 3", "A123456", null);
const user4 = new User("user4", "user4@gmail.com", "User 4", "A123456", null);
const user5 = new User("user5", "user5@gmail.com", "User 5", "A123456", null);

const users = new Map([
    [user1.email, user1],
    [user2.email, user2],
    [user3.email, user3],
    [user4.email, user4],
    [user5.email, user5],
]);

const loginForm = document.querySelector(".form-login");

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!validate(email, password)) {
        alert("Email or password are invalid!");
    } else if (!isUserExist(email, password)) {
        alert("User was not found for the given credentials");
    } else {
        window.location.href = "index.html";
    }
});

function validate(email, password) {
    const emailRegex = /^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    return (
        emailRegex.test(email) &&
        password.length >= 6 &&
        password.toLowerCase() !== password
    );
}

function isUserExist(email, password) {
    if (users.has(email)) {
        return users.get(email).password === password;
    }
    return false;
}
