function getSender(loggedInUser, users) {
  if (loggedInUser._id === users[0]._id) {
    return users[1].name;
  } else {
    return users[0].name;
  }
}

export { getSender };
