require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 5000;
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

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
        color: #333;
        margin: 0;
        padding: 20px;
    }
    .email-container {
        max-width: 600px;
        margin: 0 auto;
    }
    .header h1 {
        margin: 0 0 20px 0;
        font-size: 24px;
        color: #333;
    }
    .field-group {
        margin-bottom: 15px;
    }
    .field-label {
        display: block;
        margin-bottom: 3px;
        font-weight: bold;
        color: #555;
    }
    .field-value {
        font-size: 14px;
        color: #333;
        line-height: 1.4;
        padding: 5px 0;
    }
    .suggestions-section {
        background-color: #f8f8f8;
        border: 1px solid #ddd;
        padding: 15px;
        margin-top: 20px;
        border-radius: 3px;
    }
    .footer {
        margin-top: 30px;
        padding-top: 15px;
        border-top: 1px solid #ddd;
        color: #666;
        font-size: 11px;
    }
    .timestamp {
        color: #666;
        font-size: 11px;
        margin-top: 15px;
    }
    .separator {
        border-top: 1px solid #ddd;
        margin: 20px 0;
    }
</style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>Contact Form Submission</h1>
            </div>

           <div class="separator"></div>
    <div class="content">
        <div class="field-group">
            <div class="field-label">Name</div>
            <div class="field-value">${data.name}</div>
        </div>

        <div class="separator"></div>

        <div class="field-group">
            <div class="field-label">Organization</div>
            <div class="field-value">${data.organization}</div>
        </div>

        <div class="separator"></div>

        <div class="field-group">
            <div class="field-label">Phone</div>
            <div class="field-value">${data.phone}</div>
        </div>

        <div class="separator"></div>

        <div class="field-group">
            <div class="field-label">Email</div>
            <div class="field-value">${data.email}</div>
        </div>

        <div class="separator"></div>

        <div class="field-group">
            <div class="field-label">Subject</div>
            <div class="field-value">${data.subject}</div>
        </div>

        <div class="separator"></div>

        <div class="field-group">
            <div class="field-label">Additional</div>
            <div class="field-value">${data.additional}</div>
        </div>

        <div class="separator"></div>

        <div class="suggestions-section">
            <div class="field-label">Suggestions</div>
            <div class="field-value">${data.suggestion}</div>
        </div>

        <div class="timestamp">
         Submitted on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
        </div>
    </body>
    </html>
    `;
};
const createHTMLEventTemplate = (data) => {
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
        color: #333;
        margin: 0;
        padding: 20px;
    }
    .email-container {
        max-width: 600px;
        margin: 0 auto;
    }
    .header h1 {
        margin: 0 0 20px 0;
        font-size: 24px;
        color: #333;
    }
    .field-group {
        margin-bottom: 15px;
    }
    .field-label {
        display: block;
        margin-bottom: 3px;
        font-weight: bold;
        color: #555;
    }
    .field-value {
        font-size: 14px;
        color: #333;
        line-height: 1.4;
        padding: 5px 0;
    }
    .suggestions-section {
        background-color: #f8f8f8;
        border: 1px solid #ddd;
        padding: 15px;
        margin-top: 20px;
        border-radius: 3px;
    }
    .footer {
        margin-top: 30px;
        padding-top: 15px;
        border-top: 1px solid #ddd;
        color: #666;
        font-size: 11px;
    }
    .timestamp {
        color: #666;
        font-size: 11px;
        margin-top: 15px;
    }
    .separator {
        border-top: 1px solid #ddd;
        margin: 20px 0;
    }
</style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>Event Form Submission</h1>
            </div>

           <div class="separator"></div>
    <div class="content">
        <div class="field-group">
            <div class="field-label">Name of organisation</div>
            <div class="field-value">${data.organization}</div>
        </div>

        <div class="separator"></div>

        <div class="field-group">
            <div class="field-label">Name of person participating</div>
            <div class="field-value">${data.person}</div>
        </div>

        <div class="separator"></div>

        <div class="field-group">
            <div class="field-label">Event name</div>
            <div class="field-value">${data.name}</div>
        </div>

        <div class="separator"></div>
          <div class="field-group">
            <div class="field-label">Designation of person participating</div>
            <div class="field-value">${data.qualification}</div>
        </div>

        <div class="separator"></div>
          <div class="field-group">
            <div class="field-label">Phone number</div>
            <div class="field-value">${data.phone}</div>
        </div>

        <div class="separator"></div>


        <div class="field-group">
            <div class="field-label">Email</div>
            <div class="field-value">${data.email}</div>
        </div>
        <div class="timestamp">
         Submitted on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
        </div>
    </body>
    </html>
    `;
};

app.post('/send', async (req, res) => {
    const { name, organization, phone, email, subject, additional, suggestion } = req.body;

    try {
        const { data, error } = await resend.emails.send({
            from: 'Contact Form <onboarding@resend.dev>',
            to: ['nominations@eci.co.in'],
            subject: `New submission from https://eci.co.in/`,
            html: createHTMLTemplate({ name, organization, phone, email, subject, additional, suggestion })
        });

        if (error) {
            console.error('Email Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Error sending email. Please try again.'
            });
        }

        console.log('Email sent successfully:', data.id);
        res.json({
            success: true,
            message: 'Email sent successfully! We will get back to you soon.'
        });
    } catch (error) {
        console.error('Email Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending email. Please try again.'
        });
    }
});

app.post('/event', async (req, res) => {
    const { organization, person, name, qualification, phone, email } = req.body;

    try {
        const { data, error } = await resend.emails.send({
            from: 'Event Registration <onboarding@resend.dev>',
            to: ['nominations@eci.co.in'],
            subject: `New submission from https://eci.co.in/`,
            html: createHTMLEventTemplate({ organization, person, name, qualification, phone, email })
        });

        if (error) {
            console.error('Email Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Error sending email. Please try again.'
            });
        }

        console.log('Email sent successfully:', data.id);
        res.json({
            success: true,
            message: 'Email sent successfully! We will get back to you soon.'
        });
    } catch (error) {
        console.error('Email Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending email. Please try again.'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
