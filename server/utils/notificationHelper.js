
const Notification = require("../models/Notification");
const User = require("../models/User");

// Create a notification for one user.
const createNotification = async ({
  user,
  title,
  message,
  type = "general",
}) => {
  if (!user) return;

  try {
    await Notification.create({
      user,
      title,
      message,
      type,
    });
  } catch (error) {
    // Notification failure should not break the main operation.
    console.error(
      "Notification creation error:",
      error.message
    );
  }
};

// Notify all users with a particular role.
const notifyUsersByRole = async ({
  role,
  excludeUser,
  title,
  message,
  type = "general",
}) => {
  try {
    const filter = { role };

    if (excludeUser) {
      filter._id = { $ne: excludeUser };
    }

    const users = await User.find(filter).select("_id");

    if (users.length === 0) return;

    await Notification.insertMany(
      users.map((item) => ({
        user: item._id,
        title,
        message,
        type,
      })),
      { ordered: false }
    );
  } catch (error) {
    console.error(
      "Role notification creation error:",
      error.message
    );
  }
};

module.exports = {
  createNotification,
  notifyUsersByRole,
};
