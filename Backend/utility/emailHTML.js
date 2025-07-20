// HTML for email verification
const verificationEmailHTML = (code) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f4f4f4;
        padding: 20px;
        margin: 0;
      }
      .container {
        max-width: 600px;
        background-color: #ffffff;
        margin: 0 auto;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        text-align: center;
      }
      .logo {
        font-size: 24px;
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 20px;
      }
      .highlight {
        font-size: 20px;
        font-weight: bold;
        color: #3498db;
      }
      .code-box {
        font-size: 28px;
        letter-spacing: 6px;
        background: #f0f0f0;
        padding: 15px;
        border-radius: 8px;
        display: inline-block;
        margin: 20px 0;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #999999;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">JobPortal Pro</div>
      <h2>Verify Your Email Address</h2>
      <p>Thank you for registering with <strong>JobPortal Pro</strong>.<br>
      To complete your registration, please use the verification code below:</p>
      <div class="code-box">${code}</div>
      <p class="highlight">This code is valid for the next 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
      <div class="footer">
        &copy; ${new Date().getFullYear()} JobPortal Pro. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};

// html for reset password
const changePasswordEmail = (link) => {
  return `
        <h3>Password Reset Requested</h3>
      <p>Click the button below to reset your password:</p>
      <a href="${link}" style="display:inline-block;padding:10px 20px;background:#007BFF;color:#fff;
      text-decoration:none;border-radius:5px;">Reset Password</a>
      <p>If you did not request this, you can ignore this email.</p>
    `
}

// html for application
const applicationStatusEmailHTML = ({emailData}) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Application Status Update</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f4f4f4;
        padding: 20px;
        margin: 0;
      }
      .container {
        max-width: 600px;
        background-color: #ffffff;
        margin: 0 auto;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        text-align: center;
      }
      .company-logo {
        width: 80px;
        height: 80px;
        object-fit: contain;
        border-radius: 10px;
        margin-bottom: 20px;
      }
      .company-name {
        font-size: 22px;
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 5px;
      }
      .job-title {
        font-size: 18px;
        font-weight: 500;
        color: #7f8c8d;
        margin-bottom: 20px;
      }
      .status-badge {
        display: inline-block;
        padding: 10px 20px;
        font-size: 16px;
        border-radius: 25px;
        color: #fff;
        margin-bottom: 20px;
      }
      .shortlisted {
        background-color: #f39c12;
      }
      .rejected {
        background-color: #e74c3c;
      }
      .hired {
        background-color: #2ecc71;
      }
      .message {
        font-size: 16px;
        color: #444444;
        margin-top: 10px;
      }
      .footer {
        margin-top: 40px;
        font-size: 12px;
        color: #999999;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <img class="company-logo" src="${emailData.companyLogo}" alt="Company Logo" />
      <div class="company-name">${emailData.companyName}</div>
      <div class="job-title">${emailData.jobTitle}</div>
      <div class="status-badge ${emailData.status.toLowerCase()}">${emailData.status}</div>
      <div class="message">
        ${emailData.status === 'Shortlisted' ? `
          Hi ${emailData.name},<br/><br/>
          Congratulations! You've been <strong>shortlisted</strong> for the position of <strong>${emailData.jobTitle}</strong> at <strong>${emailData.companyName}</strong>. We’ll contact you soon for the next steps.
        ` : emailData.status === 'Rejected' ? `
          Hi ${emailData.name},<br/><br/>
          Thank you for applying for the <strong>${emailData.jobTitle}</strong> position at <strong>${emailData.companyName}</strong>.<br/>
          We appreciate your effort, but unfortunately, you were not selected at this time.
        ` : `
          Hi ${emailData.name},<br/><br/>
          🎉 Great news! You've been <strong>hired</strong> for the position of <strong>${emailData.jobTitle}</strong> at <strong>${emailData.companyName}</strong>!<br/>
          The company will reach out to you shortly with onboarding details.
        `}
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} JobPortal Pro. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};

export { verificationEmailHTML, changePasswordEmail, applicationStatusEmailHTML }