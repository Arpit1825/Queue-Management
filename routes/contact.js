require("dotenv").config();

const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const { Resend } = require("resend");

console.log("RESEND KEY =", process.env.RESEND_API_KEY ? "Loaded Successfully" : "MISSING KEY");

// Safely initializes using the process.env.RESEND_API_KEY automatically
const resend = new Resend();

router.post("/", async (req, res) => {
  console.log("Request received:", req.body);
  
  // Destructure values with fallbacks to avoid crashes if req.body is empty
  const { fullname = "N/A", email = "N/A", subject = "No Subject", message: userMessage = "No Message" } = req.body || {};

  try {
    // 1. Save to Database
    const databaseMessage = await Message.create({
      fullname,
      email,
      subject,
      message: userMessage
    });

    // 2. Send via Resend
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "av6821246@gmail.com",
      subject: `New Message Received Doctor : ${subject}`,
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px">
          <h2>📩 New Contact Message</h2>
          <table style="border-collapse:collapse; width: 100%; max-width: 600px;">
            <tr>
              <td style="padding: 8px 0;"><strong>Name:</strong></td>
              <td style="padding: 8px 0;">${fullname}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Email:</strong></td>
              <td style="padding: 8px 0;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Subject:</strong></td>
              <td style="padding: 8px 0;">${subject}</td>
            </tr>
          </table>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <h3>Message</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${userMessage}</p>
        </div>
      `,
    });

    // Handle potential Resend-specific API errors
    if (response.error) {
      throw new Error(`Resend Error: ${response.error.message}`);
    }

    console.log("Mail sent successfully. ID:", response.data?.id);

    res.status(201).json({
      success: true,
      data: databaseMessage,
    });

  } catch (err) {
    console.error("SERVER ROUTE ERROR :", err);

    res.status(500).json({
      success: false,
      error: err.message || "Internal Server Error",
    });
  }
});

module.exports = router;