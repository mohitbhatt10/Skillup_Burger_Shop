const ContactMessage = require("../models/ContactMessage");

const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Name, email, and message are required",
        });
    }

    await ContactMessage.create({ name, email, message });
    res.status(201).json({
      success: true,
      message:
        "Your message has been sent successfully! We'll get back to you soon.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to submit contact form" });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: messages.length, messages });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch messages" });
  }
};

module.exports = { submitContact, getMessages };
