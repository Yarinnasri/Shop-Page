const permissionSet = new Set(["CHANGE_STOCK", "DISCOUNT_20_OFF"]);

const loggedInUserEmail = sessionStorage.getItem("loggedInUserEmail");
const usersFromSession = JSON.parse(sessionStorage.getItem("users"));
const loggedInUser = usersFromSession.find(
  (user) => user[0] === loggedInUserEmail
)[1];

console.log("loggedInUser " + loggedInUser);
console.log("loggedInUser[1] " + loggedInUser[1]);
console.log("loggedInUser.permissions " + loggedInUser.permissions);

userPermissions = new Set(loggedInUser.permissions);

console.log(userPermissions);
