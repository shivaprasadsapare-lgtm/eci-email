const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
//cors to all

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Replace with your Gmail credentials and target email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'eci.responses@gmail.com', // Your Gmail address
        pass: 'ryqp qepq gete jgoo'      // App password (not your Gmail password)
    }
});

// HTML Email Template
const createHTMLTemplate = (data) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact Form Submission</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: #fff;
                color: #222;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                padding: 24px 0 0 0;
            }
            .field-label {
                font-size: 15px;
                font-weight: bold;
                text-transform: lowercase;
                margin-top: 18px;
                margin-bottom: 2px;
            }
            .field-value {
                font-size: 16px;
                color: #333;
                line-height: 1.5;
            }
            .suggestions-section {
                background-color: #fafafa;
                border: 1px solid #e0e0e0;
                padding: 20px;
                margin-top: 24px;
                border-radius: 4px;
            }
            .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
                text-align: center;
                color: #999;
                font-size: 12px;
            }
            .timestamp {
                color: #999;
                font-size: 12px;
                margin-top: 16px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>Contact Form Submission</h1>
            </div>
            
            <div class="content">
                <div class="field-group">
                    <div class="field-label">Name</div>
                    <div class="field-value">${data.name}</div>
                </div>
                
                <div class="field-group">
                    <div class="field-label">Organization</div>
                    <div class="field-value">${data.organization}</div>
                </div>
                
                <div class="field-group">
                    <div class="field-label">Phone</div>
                    <div class="field-value">${data.phone}</div>
                </div>
                
                <div class="field-group">
                    <div class="field-label">Email</div>
                    <div class="field-value">${data.email}</div>
                </div>
                
                <div class="field-group">
                    <div class="field-label">Subject</div>
                    <div class="field-value">${data.subject}</div>
                </div>
                
                <div class="suggestions-section">
                    <div class="field-label">Additional Suggestions</div>
                    <div class="field-value">${data.additional}</div>
                </div>
                
                <div class="timestamp">
                    Submitted on ${new Date().toLocaleDateString()}
                </div>
            </div>
            
            <div class="footer">
                <p>This email was sent from your contact form</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Plain Text Template
const createTextTemplate = (data) => {
    return `
CONTACT FORM SUBMISSION
=======================

📋 SUBMISSION DETAILS:
Name: ${data.name}
Organization: ${data.organization}
Phone: ${data.phone}
Email: ${data.email}
Subject: ${data.subject}

💡 ADDITIONAL SUGGESTIONS:
${data.additional}

---
📅 Submitted: ${new Date().toLocaleString()}
📧 Sent from: Contact Form System
    `;
};

app.post('/send', (req, res) => {
    const { name, organization, phone, email, subject, additional } = req.body;

    const mailOptions = {
        from: `"Contact Form" <${email}>`,
        to: 'nominations@eci.co.in',
        subject: `New submission from https://eci.co.in/`,
        text: createTextTemplate({ name, organization, phone, email, subject, additional }),
        html: createHTMLTemplate({ name, organization, phone, email, subject, additional })
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Email Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Error sending email. Please try again.'
            });
        }
        
        console.log('Email sent successfully:', info.messageId);
        res.json({
            success: true,
            message: 'Email sent successfully! We will get back to you soon.'
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 