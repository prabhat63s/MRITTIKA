// Welcome template
export const welcomeTemplate = (userEmail, appName = "MRITTIKA") => {
    return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Welcome to ${appName}</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <table width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
        <tr>
          <td style="background: #4f46e5; padding: 20px; text-align: center; color: white; font-size: 22px; font-weight: bold;">
            Welcome to ${appName} 🎉
          </td>
        </tr>
        <tr>
          <td style="padding: 30px; text-align: center; color: #333;">
            <h2 style="margin: 0 0 10px;">Hello ${userEmail},</h2>
            <p style="font-size: 16px; margin: 0 0 20px;">
              We’re excited to have you join our community! 🚀
            </p>
            <p style="font-size: 15px; color: #555;">
              You can now log in and start exploring. If you need any assistance, our support team is always here to help.
            </p>
            <a href="https://yourapp.com/login" style="display: inline-block; margin-top: 20px; padding: 12px 20px; background: #4f46e5; color: white; text-decoration: none; border-radius: 6px; font-size: 16px;">
              Go to Dashboard
            </a>
          </td>
        </tr>
        <tr>
          <td style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #777;">
            &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};

// OTP template
export const otpTemplate = (otp, appName = "MRITTIKA") => {
    return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>${appName} - OTP Verification</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <table width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
        <tr>
          <td style="background: #4f46e5; padding: 20px; text-align: center; color: white; font-size: 20px; font-weight: bold;">
            ${appName} Security
          </td>
        </tr>
        <tr>
          <td style="padding: 30px; text-align: center; color: #333;">
            <h2 style="margin: 0 0 10px;">Your OTP Code</h2>
            <p style="font-size: 16px; margin: 0 0 20px;">Use the following code to reset your password:</p>
            <p style="font-size: 28px; letter-spacing: 4px; font-weight: bold; color: #4f46e5; margin: 0 0 20px;">
              ${otp}
            </p>
            <p style="font-size: 14px; color: #777;">
              This OTP will expire in <b>10 minutes</b>. If you didn’t request this, please ignore this email.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #777;">
            &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};

// Admin - New user notification template 
export const adminNotificationTemplate = (userEmail, appName = "MyApp") => {
    return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>New User Registration - ${appName}</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <table width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
        <tr>
          <td style="background: #dc2626; padding: 20px; text-align: center; color: white; font-size: 20px; font-weight: bold;">
            🚨 New User Alert
          </td>
        </tr>
        <tr>
          <td style="padding: 30px; color: #333;">
            <h2 style="margin: 0 0 10px;">A new user has registered!</h2>
            <p style="font-size: 16px; margin: 0 0 10px;">
              <b>Email:</b> ${userEmail}
            </p>
            <p style="font-size: 14px; color: #555; margin: 0 0 20px;">
              This is an automated notification from <b>${appName}</b>.
            </p>
            <p style="font-size: 14px; color: #777;">
              You can log in to your admin panel to view more details.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #777;">
            &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};

// Order Placed Template
export const orderPlacedTemplate = (userEmail, order, appName = "MRITTIKA") => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>${appName} - Order Placed</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <table width="100%" cellspacing="0" cellpadding="0" 
        style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px;
        overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
        
        <tr>
          <td style="background: #16a34a; padding: 20px; text-align: center; color: white; font-size: 20px; font-weight: bold;">
            Order Confirmation
          </td>
        </tr>

        <tr>
          <td style="padding: 30px; color: #333;">
            <h2 style="margin: 0 0 10px;">Thank you for your order, ${userEmail}!</h2>
            <p style="font-size: 16px; margin: 0 0 10px;">Your order <b>#${order._id}</b> has been successfully placed.</p>

            <p style="margin: 0 0 8px;"><b>Amount:</b> ₹${order.amount}</p>
            <p style="margin: 0 0 8px;"><b>Payment Mode:</b> ${order.paymentMode}</p>
            <p style="margin: 0 0 20px;">We will notify you as your order progresses.</p>

            <p style="font-size: 14px; color: #777;">You can always check your order status in your ${appName} account.</p>
          </td>
        </tr>

        <tr>
          <td style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #777;">
            &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
          </td>
        </tr>
      </table>
    </body>
  </html>
`;

// Admin - New Order Notification template
export const adminOrderNotificationTemplate = (order, appName = "MRITTIKA") => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>${appName} - New Order Alert</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <table width="100%" cellspacing="0" cellpadding="0" 
        style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px;
        overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
        
        <tr>
          <td style="background: #dc2626; padding: 20px; text-align: center; color: white; font-size: 20px; font-weight: bold;">
            🚨 New Order Received
          </td>
        </tr>

        <tr>
          <td style="padding: 30px; color: #333;">
            <h2 style="margin: 0 0 10px;">A new order has been placed!</h2>

            <p style="margin: 0 8px;"><b>Order ID:</b> ${order._id}</p>
            <p style="margin: 0 8px;"><b>User ID:</b> ${order.userId}</p>
            <p style="margin: 0 8px;"><b>Amount:</b> ₹${order.amount}</p>
            <p style="margin: 0 8px;"><b>Payment Mode:</b> ${order.paymentMode}</p>
            <p style="margin: 0 20px;"><b>Status:</b> ${order.orderStatus}</p>

            <h3 style="margin-top:20px;">Items:</h3>
            <ul style="font-size: 14px; color: #555; padding-left: 20px;">
              ${order.items.map(item => `
                <li>${item.productName} - ${item.quantity} × ₹${item.price} = ₹${item.total}</li>
              `).join("")}
            </ul>

            <h3 style="margin-top:20px;">Delivery Address:</h3>
            <p style="font-size: 14px; color: #555;">
              ${order.address.name}, ${order.address.street}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}<br>
              <b>Phone:</b> ${order.address.phone_number}
            </p>
          </td>
        </tr>

        <tr>
          <td style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #777;">
            &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
          </td>
        </tr>
      </table>
    </body>
  </html>
`;

// Order Status Update template
export const orderStatusTemplate = (orderId, status, appName = "MRITTIKA") => {
    return `
  <!DOCTYPE html>
  <html>
    <head><meta charset="utf-8" /></head>
    <body style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
      <table style="max-width:600px;margin:auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,0.1);">
        <tr>
          <td style="background:#4f46e5;padding:20px;text-align:center;color:#fff;font-size:20px;font-weight:bold;">
            ${appName} Order Update
          </td>
        </tr>
        <tr>
          <td style="padding:30px;color:#333;text-align:center;">
            <h2>Order #${orderId}</h2>
            <p>Your order status has been updated to:</p>
            <p style="font-size:20px;font-weight:bold;color:#4f46e5;">${status}</p>
            <p>Thank you for shopping with ${appName}!</p>
          </td>
        </tr>
        <tr>
          <td style="background:#f3f4f6;padding:15px;text-align:center;font-size:12px;color:#777;">
            &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};

// Payment Status Update template
export const paymentStatusTemplate = (orderId, paymentStatus, appName = "MRITTIKA") => {
    return `
  <!DOCTYPE html>
  <html>
    <head><meta charset="utf-8" /></head>
    <body style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
      <table style="max-width:600px;margin:auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,0.1);">
        <tr>
          <td style="background:#16a34a;padding:20px;text-align:center;color:#fff;font-size:20px;font-weight:bold;">
            ${appName} Payment Update
          </td>
        </tr>
        <tr>
          <td style="padding:30px;color:#333;text-align:center;">
            <h2>Order #${orderId}</h2>
            <p>Your payment status is now:</p>
            <p style="font-size:20px;font-weight:bold;color:#16a34a;">${paymentStatus}</p>
            <p>If you didn’t make this payment, please contact support immediately.</p>
          </td>
        </tr>
        <tr>
          <td style="background:#f3f4f6;padding:15px;text-align:center;font-size:12px;color:#777;">
            &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};