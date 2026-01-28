import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer"
import { UserRole } from "../enum";


// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASS,
    },
});



export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins: [process.env.APP_URL!],
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: UserRole.USER,
                required: false
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            try {
                const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`
                const info = await transporter.sendMail({
                    from: '"Food Hub" <foodhub@gmail.com>',
                    to: user.email,
                    subject: "Verify your Food Hub account 🍔",
                    html: `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your Account</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f7f7f7; font-family: Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding: 30px 15px;">
          
          <!-- Card -->
          <table width="100%" max-width="600" cellpadding="0" cellspacing="0" 
            style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden;">

            <!-- Header -->
            <tr>
              <td align="center" style="background:#e21b70; padding:25px;">
                <h1 style="margin:0; color:#ffffff; font-size:28px;">
                  🍽️ Food Hub
                </h1>
                <p style="margin:8px 0 0; color:#ffdbe9; font-size:14px;">
                  Your favorite food, delivered fast
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px; color:#333333;">
                <h2 style="margin-top:0;">Welcome to Food Hub! 🎉</h2>

                <p style="font-size:15px; line-height:1.6;">
                  Hi <strong>${user.name || "Food Lover"}</strong>, <br/><br/>
                  Thanks for joining <strong>Food Hub</strong>!  
                  Please verify your email address to activate your account and start ordering delicious food from your favorite restaurants 🍕🍔🍜
                </p>

                <!-- Button -->
                <div style="text-align:center; margin:35px 0;">
                  <a href="${verificationUrl}"
                     style="
                       background:#e21b70;
                       color:#ffffff;
                       text-decoration:none;
                       padding:14px 30px;
                       border-radius:30px;
                       font-size:16px;
                       font-weight:bold;
                       display:inline-block;
                     ">
                    Verify My Account
                  </a>
                </div>

                <p>
                    If the button doesn’t work, copy and paste the link below into your browser:
                    </p>

                    <p class="link">
                        ${verificationUrl}
                </p>

                <p style="font-size:14px; color:#666;">
                  If you didn’t create a Food Hub account, you can safely ignore this email.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="background:#fafafa; padding:20px; font-size:13px; color:#999;">
                © ${new Date().getFullYear()} Food Hub  
                <br/>
                Made with ❤️ for food lovers
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `
                });
                console.log("Message sent:", info.messageId);
            }
            catch (err) {
                console.error(err)
                throw err;
            }
        }
    }
});