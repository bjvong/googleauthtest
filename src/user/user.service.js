const addGoogleUser =
  (User) =>
  ({ id, email, firstName, lastName, profilePhoto }) => {
    const user = new User({
      id,
      email,
      firstName,
      lastName,
      balance: 100,
      profilePhoto,
      source: "google",
    });
    return user.save();
  };

const getUsers = (User) => () => {
  return User.find({});
};

const getUserByEmail =
  (User) =>
  async ({ email }) => {
    return await User.findOne({
      email,
    });
  };

  const addLocalUser = (User) => ({ id, email, firstName, lastName, password }) => {
    const user = new User({
      id, email, firstName, lastName, password, balance: 100, source: "local"
    })
    return user.save()
  }

module.exports = (User) => {
  return {
    addGoogleUser: addGoogleUser(User),
    addLocalUser: addLocalUser(User),
    getUsers: getUsers(User),
    getUserByEmail: getUserByEmail(User),
  };
};
