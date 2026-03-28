function emailTemplate(name, clientURL) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Messenger</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0B0E14; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0B0E14; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 550px; background-color: #161B22; border-radius: 24px; overflow: hidden; border: 1px solid #30363D;">
          
          <tr>
            <td height="6" style="background: linear-gradient(90deg, #7F00FF, #E100FF);"></td>
          </tr>

          <tr>
            <td align="center" style="padding: 50px 40px 30px 40px;">
              <div style="margin-bottom: 25px;">
                <img src="https://img.freepik.com/free-vector/hand-drawn-message-element-vector-cute-sticker_53876-118344.jpg" alt="Logo" style="width: 70px; height: 70px; border-radius: 20px; border: 2px solid #E100FF; padding: 5px; background: #ffffff;">
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 30px; font-weight: 800; letter-spacing: -0.5px;">Welcome, ${name}!</h1>
              <p style="color: #8B949E; font-size: 16px; margin-top: 10px;">Your new digital home for connection.</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 45px 40px 45px;">
              <div style="background-color: #0D1117; border-radius: 16px; padding: 25px; border: 1px solid #30363D;">
                <p style="color: #C9D1D9; font-size: 15px; line-height: 1.6; margin-top: 0;">
                  Ready to start chatting? We've built a space that's fast, private, and entirely yours.
                </p>
                
                <table width="100%" cellspacing="0" cellpadding="0" style="margin-top: 20px;">
                  <tr>
                    <td style="padding: 10px 0;">
                      <span style="color: #E100FF; font-weight: bold; font-size: 18px;">&bull;</span> 
                      <span style="color: #C9D1D9; font-size: 14px; margin-left: 10px;">Ultra-fast real-time messaging</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;">
                      <span style="color: #7F00FF; font-weight: bold; font-size: 18px;">&bull;</span> 
                      <span style="color: #C9D1D9; font-size: 14px; margin-left: 10px;">End-to-end encrypted calls</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;">
                      <span style="color: #E100FF; font-weight: bold; font-size: 18px;">&bull;</span> 
                      <span style="color: #C9D1D9; font-size: 14px; margin-left: 10px;">Seamless file & media sharing</span>
                    </td>
                  </tr>
                </table>
              </div>

              <div style="text-align: center; margin-top: 40px;">
                <a href="${clientURL}" style="background: #ffffff; color: #0D1117; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 700; font-size: 16px; display: inline-block; transition: all 0.3s ease;">
                  Enter the App
                </a>
                <p style="margin-top: 25px; color: #8B949E; font-size: 13px;">
                  Need help? <a href="#" style="color: #E100FF; text-decoration: none;">Visit our docs</a>
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-bottom: 40px;">
               <p style="color: #484F58; font-size: 12px; margin: 0;">Sent with ❤️ from the Messenger Team</p>
            </td>
          </tr>
        </table>

        <table width="100%" style="max-width: 550px; margin-top: 20px;">
          <tr>
            <td align="center" style="color: #484F58; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">
              © 2026 Messenger Global | <a href="#" style="color: #484F58; text-decoration: underline;">Privacy</a> | <a href="#" style="color: #484F58; text-decoration: underline;">Unsubscribe</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}


export default emailTemplate