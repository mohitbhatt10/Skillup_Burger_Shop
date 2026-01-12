const User = require("../models/User");

const getProfile = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

const updateProfile = async (req, res) => {
  try {
    const updates = { name: req.body.name, email: req.body.email };

    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (updates.name) user.name = updates.name;
    if (updates.email) user.email = updates.email;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Profile update failed" });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please provide current and new passwords",
        });
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Password update failed" });
  }
};

module.exports = { getProfile, updateProfile, updatePassword };
