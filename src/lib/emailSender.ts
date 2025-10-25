import nodemailer from 'nodemailer';
import { UAParser } from 'ua-parser-js';

// Create a transporter using Gmail with app password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASSWORD || 'your-app-password'
  }
});

// Get device info from user agent
export const getDeviceInfo = (userAgent: string) => {
  const parser = new UAParser(userAgent);
  const browser = parser.getBrowser();
  const os = parser.getOS();
  const device = parser.getDevice();
  
  const deviceType = device.type ? `${device.type} ` : '';
  const deviceName = device.vendor ? `${device.vendor} ${device.model || ''}` : '';
  const deviceInfo = deviceType || deviceName ? `${deviceType}${deviceName}` : 'Unknown device';
  
  return {
    browser: `${browser.name || 'Unknown'} ${browser.version || ''}`,
    os: `${os.name || 'Unknown'} ${os.version || ''}`,
    device: deviceInfo.trim(),
  };
};

// Send login notification email
export const sendLoginNotificationEmail = async (
  email: string, 
  firstName: string,
  ipAddress: string,
  userAgent: string,
  loginTime: Date
) => {
  const deviceInfo = getDeviceInfo(userAgent);
  const formattedTime = loginTime.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const mailOptions = {
    from: `"VelTrust Security" <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: 'New Login to Your VelTrust Account',
    text: `
Hello ${firstName},

We detected a new login to your VelTrust account.

Login Details:
- Date and Time: ${formattedTime}
- IP Address: ${ipAddress}
- Device: ${deviceInfo.device}
- Browser: ${deviceInfo.browser}
- Operating System: ${deviceInfo.os}

If this was you, you can ignore this email. If you didn't log in recently, please secure your account by changing your password immediately.

For security reasons, never share your password with anyone. VelTrust will never ask for your password via email.

Thank you,
The VelTrust Security Team
    `,
    html: `
<p>Hello ${firstName},</p>

<p>We detected a new login to your VelTrust account.</p>

<p><strong>Login Details:</strong></p>
<ul>
  <li>Date and Time: ${formattedTime}</li>
  <li>IP Address: ${ipAddress}</li>
  <li>Device: ${deviceInfo.device}</li>
  <li>Browser: ${deviceInfo.browser}</li>
  <li>Operating System: ${deviceInfo.os}</li>
</ul>

<p>If this was you, you can ignore this email. If you didn't log in recently, please secure your account by changing your password immediately.</p>

<p>For security reasons, never share your password with anyone. VelTrust will never ask for your password via email.</p>

<p>Thank you,<br>
The VelTrust Security Team</p>
    `
  };

  return transporter.sendMail(mailOptions);
};

// Send welcome email after registration
export const sendWelcomeEmail = async (email: string, firstName: string) => {
  const mailOptions = {
    from: `"VelTrust" <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: 'Welcome to VelTrust',
    text: `
Hello ${firstName},

Welcome to VelTrust! We're excited to have you on board.

Your account has been successfully created. You can now log in and start using our services to send money internationally with competitive rates and fast transfers.

Here are some things you can do with your new account:
- Set up your profile
- Add payment methods
- Start sending money internationally
- Track your transactions

If you have any questions or need assistance, our support team is here to help.

Thank you for choosing VelTrust!

Best regards,
The VelTrust Team
    `,
    html: `
<p>Hello ${firstName},</p>

<p>Welcome to VelTrust! We're excited to have you on board.</p>

<p>Your account has been successfully created. You can now log in and start using our services to send money internationally with competitive rates and fast transfers.</p>

<p><strong>Here are some things you can do with your new account:</strong></p>
<ul>
  <li>Set up your profile</li>
  <li>Add payment methods</li>
  <li>Start sending money internationally</li>
  <li>Track your transactions</li>
</ul>

<p>If you have any questions or need assistance, our support team is here to help.</p>

<p>Thank you for choosing VelTrust!</p>

<p>Best regards,<br>
The VelTrust Team</p>
    `
  };

  return transporter.sendMail(mailOptions);
};

// Send transaction notification email
export const sendTransactionEmail = async (
  email: string,
  firstName: string,
  transactionType: 'sent' | 'received' | 'international',
  amount: number,
  currency: string,
  otherPartyName: string,
  transactionHash: string,
  additionalDetails?: {
    country?: string;
    convertedAmount?: number;
    targetCurrency?: string;
    status?: string;
  }
) => {
  let subject = '';
  let actionText = '';
  
  switch (transactionType) {
    case 'sent':
      subject = 'Money Sent Successfully';
      actionText = `sent ${currency} ${amount.toFixed(2)} to`;
      break;
    case 'received':
      subject = 'Money Received';
      actionText = `pending a deposit of  ${currency} ${amount.toFixed(2)} from`;
      break;
    case 'international':
      subject = 'International Transfer Initiated';
      actionText = `initiated a transfer of ${currency} ${amount.toFixed(2)} to`;
      break;
  }

  const mailOptions = {
    from: `"VelTrust Transactions" <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject,
    text: `
Hello ${firstName},

This email confirms that you have ${actionText} ${otherPartyName}.

Transaction Details:
- Amount: ${currency} ${amount.toFixed(2)}
${additionalDetails?.convertedAmount ? `- Converted Amount: ${additionalDetails.targetCurrency} ${additionalDetails.convertedAmount.toFixed(2)}` : ''}
${additionalDetails?.country ? `- Destination Country: ${additionalDetails.country}` : ''}
- Transaction ID: ${transactionHash}
- Status: ${additionalDetails?.status || 'Paid'}

You can view the full transaction details in your VelTrust dashboard.

If you did not authorize this transaction, please contact our support team immediately.

Thank you for using VelTrust!

Best regards,
The VelTrust Team
    `,
    html: `
<p>Hello ${firstName},</p>

<p>This email confirms that you have ${actionText} ${otherPartyName}.</p>

<p><strong>Transaction Details:</strong></p>
<ul>
  <li>Amount: ${currency} ${amount.toFixed(2)}</li>
  ${additionalDetails?.convertedAmount ? `<li>Converted Amount: ${additionalDetails.targetCurrency} ${additionalDetails.convertedAmount.toFixed(2)}</li>` : ''}
  ${additionalDetails?.country ? `<li>Destination Country: ${additionalDetails.country}</li>` : ''}
  <li>Transaction ID: ${transactionHash}</li>
  <li>Status: ${additionalDetails?.status || 'Paid'}</li>
</ul>

<p>You can view the full transaction details in your VelTrust dashboard.</p>

<p>If you did not authorize this transaction, please contact our support team immediately.</p>

<p>Thank you for using VelTrust!</p>

<p>Best regards,<br>
The VelTrust Team</p>
    `
  };

  return transporter.sendMail(mailOptions);
};

export const sendProfileUpdateEmail = async (
  email: string,
  firstName: string,
  userAgent: string
) => {
  const deviceInfo = getDeviceInfo(userAgent);

  const mailOptions = {
    from: `"VelTrust Security" <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: "Profile Updated Successfully",
    text: `
Hello ${firstName},

Your VelTrust profile has been successfully updated.

Device Details:
- Browser: ${deviceInfo.browser}
- Operating System: ${deviceInfo.os}
- Device: ${deviceInfo.device}

If you did not make these changes, please contact our support team immediately.

Best regards,
The VelTrust Team
    `,
    html: `
<p>Hello ${firstName},</p>

<p>Your VelTrust profile has been successfully updated.</p>

<h3>Device Details:</h3>
<ul>
  <li>Browser: ${deviceInfo.browser}</li>
  <li>Operating System: ${deviceInfo.os}</li>
  <li>Device: ${deviceInfo.device}</li>
</ul>

<p>If you did not make these changes, please contact our support team immediately.</p>

<p>Best regards,<br>
The VelTrust Team</p>
    `
  };

  return transporter.sendMail(mailOptions);
};