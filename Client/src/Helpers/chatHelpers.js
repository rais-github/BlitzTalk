function getSender(loggedInUser, users) {
  // console.log(loggedInUser._id);
  if (loggedInUser._id === users[0]._id) {
    return users[1].name;
  } else {
    return users[0].name;
  }
}

function getSenderFull(loggedInUser, users) {
  if (loggedInUser._id === users[0]._id) {
    return users[1];
  } else {
    return users[0];
  }
}

export { getSender, getSenderFull };
