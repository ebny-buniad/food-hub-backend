// src/app.ts
import express9 from "express";
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel ProviderProfiles {\n  id             String   @id @default(uuid())\n  userId         String   @unique\n  provider       User     @relation(fields: [userId], references: [id])\n  image          String?\n  restaurentName String\n  description    String\n  address        String\n  isOpen         Boolean  @default(true)\n  createdAt      DateTime @default(now())\n  updatedAt      DateTime @updatedAt\n  meals          Meals[]\n  orders         Orders[]\n}\n\nmodel Categories {\n  id         String       @id @default(uuid())\n  cuisine    String       @unique\n  createdAt  DateTime     @default(now())\n  updatedAt  DateTime     @updatedAt\n  meals      Meals[]\n  orderItems OrderItems[]\n}\n\nmodel Meals {\n  id String @id @default(uuid())\n\n  providerId String?\n  provider   ProviderProfiles? @relation(fields: [providerId], references: [id])\n\n  categoryId String?\n  category   Categories?         @relation(fields: [categoryId], references: [id])\n  dietary    DietaryPreferences? @default(HALAL)\n\n  name        String\n  description String\n  price       Decimal @db.Decimal(10, 2)\n  thumbnail   String\n  isAvailable Boolean @default(true)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  orderItems OrderItems[]\n  reviews    Reviews[]\n  cartItems  CartItems[]\n}\n\nmodel Cart {\n  id        String      @id @default(uuid())\n  userId    String\n  user      User        @relation(fields: [userId], references: [id])\n  status    CartStatus  @default(ACTIVE)\n  createdAt DateTime    @default(now())\n  cartItems CartItems[]\n}\n\nmodel CartItems {\n  id        String   @id @default(uuid())\n  cartId    String\n  cart      Cart     @relation(fields: [cartId], references: [id])\n  mealId    String\n  meals     Meals    @relation(fields: [mealId], references: [id])\n  quantity  Int      @default(1)\n  price     Decimal  @db.Decimal(10, 2)\n  createdAt DateTime @default(now())\n\n  @@unique([cartId, mealId])\n}\n\nmodel Orders {\n  id              String           @id @default(uuid())\n  userId          String\n  user            User             @relation(fields: [userId], references: [id])\n  providerId      String\n  provider        ProviderProfiles @relation(fields: [providerId], references: [id])\n  status          OrderStatus?     @default(PLACED)\n  deliveryAddress String\n  paymentMethod   PaymentMethod?   @default(Cash)\n  totalAmount     Decimal          @db.Decimal(10, 2)\n  createdAt       DateTime         @default(now())\n  updatedAt       DateTime         @updatedAt\n  orderItems      OrderItems[]\n}\n\nmodel OrderItems {\n  id         String     @id @default(uuid())\n  orderID    String\n  order      Orders     @relation(fields: [orderID], references: [id])\n  mealId     String\n  meals      Meals      @relation(fields: [mealId], references: [id])\n  categoryId String\n  category   Categories @relation(fields: [categoryId], references: [id])\n  quantity   Int\n  price      Decimal    @db.Decimal(10, 2)\n}\n\nmodel Reviews {\n  id         String   @id @default(uuid())\n  customerId String\n  customer   User     @relation(fields: [customerId], references: [id])\n  mealId     String\n  meal       Meals    @relation(fields: [mealId], references: [id])\n  rating     Int      @db.SmallInt\n  comment    String\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n}\n\nenum CartStatus {\n  ACTIVE\n  ORDERED\n}\n\nenum DietaryPreferences {\n  VEGETARIAN\n  VEGAN\n  NON_VEGETARIAN\n  HALAL\n  GLUTEN_FREE\n  LOW_CALORIE\n}\n\nenum OrderStatus {\n  PLACED\n  DELIVERED\n  CANCELED\n}\n\nenum PaymentMethod {\n  Cash\n}\n\nmodel User {\n  id               String             @id\n  name             String\n  email            String\n  emailVerified    Boolean            @default(true)\n  image            String?\n  createdAt        DateTime           @default(now())\n  updatedAt        DateTime           @updatedAt\n  sessions         Session[]\n  accounts         Account[]\n  providerProfiles ProviderProfiles[]\n  orders           Orders[]\n  reviews          Reviews[]\n\n  role   String? @default("USER")\n  status String? @default("ACTIVE")\n  carts  Cart[]\n\n  @@unique([email])\n  @@map("User")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"ProviderProfiles":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"provider","kind":"object","type":"User","relationName":"ProviderProfilesToUser"},{"name":"image","kind":"scalar","type":"String"},{"name":"restaurentName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"isOpen","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"meals","kind":"object","type":"Meals","relationName":"MealsToProviderProfiles"},{"name":"orders","kind":"object","type":"Orders","relationName":"OrdersToProviderProfiles"}],"dbName":null},"Categories":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cuisine","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"meals","kind":"object","type":"Meals","relationName":"CategoriesToMeals"},{"name":"orderItems","kind":"object","type":"OrderItems","relationName":"CategoriesToOrderItems"}],"dbName":null},"Meals":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"provider","kind":"object","type":"ProviderProfiles","relationName":"MealsToProviderProfiles"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Categories","relationName":"CategoriesToMeals"},{"name":"dietary","kind":"enum","type":"DietaryPreferences"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"thumbnail","kind":"scalar","type":"String"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"orderItems","kind":"object","type":"OrderItems","relationName":"MealsToOrderItems"},{"name":"reviews","kind":"object","type":"Reviews","relationName":"MealsToReviews"},{"name":"cartItems","kind":"object","type":"CartItems","relationName":"CartItemsToMeals"}],"dbName":null},"Cart":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"CartToUser"},{"name":"status","kind":"enum","type":"CartStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"cartItems","kind":"object","type":"CartItems","relationName":"CartToCartItems"}],"dbName":null},"CartItems":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cartId","kind":"scalar","type":"String"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToCartItems"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"meals","kind":"object","type":"Meals","relationName":"CartItemsToMeals"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Orders":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"OrdersToUser"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"provider","kind":"object","type":"ProviderProfiles","relationName":"OrdersToProviderProfiles"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"deliveryAddress","kind":"scalar","type":"String"},{"name":"paymentMethod","kind":"enum","type":"PaymentMethod"},{"name":"totalAmount","kind":"scalar","type":"Decimal"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"orderItems","kind":"object","type":"OrderItems","relationName":"OrderItemsToOrders"}],"dbName":null},"OrderItems":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderID","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Orders","relationName":"OrderItemsToOrders"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"meals","kind":"object","type":"Meals","relationName":"MealsToOrderItems"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Categories","relationName":"CategoriesToOrderItems"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Decimal"}],"dbName":null},"Reviews":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"ReviewsToUser"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"meal","kind":"object","type":"Meals","relationName":"MealsToReviews"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"providerProfiles","kind":"object","type":"ProviderProfiles","relationName":"ProviderProfilesToUser"},{"name":"orders","kind":"object","type":"Orders","relationName":"OrdersToUser"},{"name":"reviews","kind":"object","type":"Reviews","relationName":"ReviewsToUser"},{"name":"role","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"carts","kind":"object","type":"Cart","relationName":"CartToUser"}],"dbName":"User"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS
  }
});
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  trustedOrigins: [process.env.APP_URL],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER" /* USER */,
        required: true
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
    autoSignIn: true,
    requireEmailVerification: false
  },
  // emailVerification: {
  //   sendOnSignUp: true,
  //   autoSignInAfterVerification: true,
  //   sendVerificationEmail: async ({ user, url, token }, request) => {
  //     try {
  //       const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`
  //       const info = await transporter.sendMail({
  //         from: '"Food Hub" <foodhub@gmail.com>',
  //         to: user.email,
  //         subject: "Verify your Food Hub account 🍔",
  //         html: `
  // <!DOCTYPE html>
  // <html>
  // <head>
  //   <meta charset="UTF-8" />
  //   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  //   <title>Verify Your Account</title>
  // </head>
  // <body style="margin:0; padding:0; background-color:#f7f7f7; font-family: Arial, sans-serif;">
  //   <table width="100%" cellpadding="0" cellspacing="0">
  //     <tr>
  //       <td align="center" style="padding: 30px 15px;">
  //         <!-- Card -->
  //         <table width="100%" max-width="600" cellpadding="0" cellspacing="0" 
  //           style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden;">
  //           <!-- Header -->
  //           <tr>
  //             <td align="center" style="background:#e21b70; padding:25px;">
  //               <h1 style="margin:0; color:#ffffff; font-size:28px;">
  //                 🍽️ Food Hub
  //               </h1>
  //               <p style="margin:8px 0 0; color:#ffdbe9; font-size:14px;">
  //                 Your favorite food, delivered fast
  //               </p>
  //             </td>
  //           </tr>
  //           <!-- Body -->
  //           <tr>
  //             <td style="padding:30px; color:#333333;">
  //               <h2 style="margin-top:0;">Welcome to Food Hub! 🎉</h2>
  //               <p style="font-size:15px; line-height:1.6;">
  //                 Hi <strong>${user.name || "Food Lover"}</strong>, <br/><br/>
  //                 Thanks for joining <strong>Food Hub</strong>!  
  //                 Please verify your email address to activate your account and start ordering delicious food from your favorite restaurants 🍕🍔🍜
  //               </p>
  //               <!-- Button -->
  //               <div style="text-align:center; margin:35px 0;">
  //                 <a href="${verificationUrl}"
  //                    style="
  //                      background:#e21b70;
  //                      color:#ffffff;
  //                      text-decoration:none;
  //                      padding:14px 30px;
  //                      border-radius:30px;
  //                      font-size:16px;
  //                      font-weight:bold;
  //                      display:inline-block;
  //                    ">
  //                   Verify My Account
  //                 </a>
  //               </div>
  //               <p>
  //                   If the button doesn’t work, copy and paste the link below into your browser:
  //                   </p>
  //                   <p class="link">
  //                       ${verificationUrl}
  //               </p>
  //               <p style="font-size:14px; color:#666;">
  //                 If you didn’t create a Food Hub account, you can safely ignore this email.
  //               </p>
  //             </td>
  //           </tr>
  //           <!-- Footer -->
  //           <tr>
  //             <td align="center" style="background:#fafafa; padding:20px; font-size:13px; color:#999;">
  //               © ${new Date().getFullYear()} Food Hub  
  //               <br/>
  //               Made with ❤️ for food lovers
  //             </td>
  //           </tr>
  //         </table>
  //       </td>
  //     </tr>
  //   </table>
  // </body>
  // </html>
  // `
  //       });
  //       console.log("Message sent:", info.messageId);
  //     }
  //     catch (err) {
  //       console.error(err)
  //       throw err;
  //     }
  //   }
  // },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  }
});

// src/app.ts
import cors from "cors";

// src/modules/meals/meals.router.ts
import express from "express";

// src/modules/meals/meals.service.ts
var createMeal = async (data, id) => {
  const providerProfile = await prisma.providerProfiles.findUnique({
    where: {
      userId: id
    }
  });
  const providerId = providerProfile?.id;
  if (!providerId) {
    return {
      message: "Provider profile not found",
      status: 404
    };
  }
  const result = await prisma.meals.create({
    data: {
      providerId,
      ...data
    }
  });
  return result;
};
var getAllMeals = async (filters) => {
  const where = {};
  if (filters.dietary) {
    where.dietary = filters.dietary;
  }
  if (filters.minPrice || filters.maxPrice) {
    where.price = {};
    if (filters.minPrice) where.price.gte = Number(filters.minPrice);
    if (filters.maxPrice) where.price.lte = Number(filters.maxPrice);
  }
  if (filters.cuisine) {
    where.category = {
      cuisine: filters.cuisine
    };
  }
  const result = await prisma.meals.findMany({
    where,
    orderBy: {
      createdAt: "desc"
    },
    select: {
      id: true,
      providerId: true,
      dietary: true,
      category: {
        select: {
          cuisine: true
        }
      },
      name: true,
      description: true,
      price: true,
      thumbnail: true,
      isAvailable: true,
      reviews: {
        select: {
          rating: true,
          customer: {
            select: {
              name: true
            }
          },
          comment: true,
          createdAt: true
        }
      },
      createdAt: true
    }
  });
  return result;
};
var getMeal = async (id) => {
  const result = await prisma.meals.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      providerId: true,
      dietary: true,
      category: {
        select: {
          cuisine: true
        }
      },
      name: true,
      description: true,
      price: true,
      thumbnail: true,
      isAvailable: true,
      reviews: {
        select: {
          rating: true,
          customer: {
            select: {
              name: true
            }
          },
          comment: true,
          createdAt: true
        }
      },
      createdAt: true
    }
  });
  return result;
};
var updateMeal = async (data, id) => {
  const result = await prisma.meals.update({
    where: {
      id
    },
    data: {
      ...data
    }
  });
  return result;
};
var deleteMeal = async (id) => {
  const result = await prisma.meals.delete({
    where: {
      id
    }
  });
};
var mealsServices = {
  createMeal,
  getAllMeals,
  updateMeal,
  getMeal,
  deleteMeal
};

// src/modules/meals/meals.controller.ts
var createMeal2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized user"
      });
    }
    const mealData = req.body;
    const result = await mealsServices.createMeal(mealData, userId);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Meal creation failed",
      details: error
    });
  }
};
var getAllMeals2 = async (req, res) => {
  try {
    const { dietary, cuisine, minPrice, maxPrice } = req.query;
    const result = await mealsServices.getAllMeals({
      dietary,
      cuisine,
      minPrice,
      maxPrice
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Meals get failed",
      details: error
    });
  }
};
var getMeal2 = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      throw new Error("Invallid meal id");
    }
    const result = await mealsServices.getMeal(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Meal get failed",
      details: error
    });
  }
};
var updateMeal2 = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      throw new Error("Invalid category id");
    }
    const updateData = req.body;
    const result = await mealsServices.updateMeal(updateData, id);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Meals update failed",
      details: error
    });
  }
};
var deleteMeal2 = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      throw new Error("Invalid category id");
    }
    const result = await mealsServices.deleteMeal(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Meals delete failed",
      details: error
    });
  }
};
var mealsController = {
  createMeal: createMeal2,
  getAllMeals: getAllMeals2,
  getMeal: getMeal2,
  updateMeal: updateMeal2,
  deleteMeal: deleteMeal2
};

// src/middleware/auth.ts
var auth2 = (...roles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.cookie;
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized - No cookie found"
        });
      }
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session || !session.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized - Invalid session"
        });
      }
      req.user = {
        id: session?.user?.id,
        email: session?.user?.email,
        name: session?.user?.name,
        role: session?.user?.role,
        emailVerified: session?.user?.emailVerified,
        image: session?.user?.image ?? null
      };
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden - Insufficient permission"
        });
      }
      next();
    } catch (error) {
      console.error("Auth Middleware Error:", error);
      return res.status(500).json({
        success: false,
        message: "Authentication failed"
      });
    }
  };
};
var auth_default = auth2;

// src/modules/meals/meals.router.ts
var router = express.Router();
router.post("/provider/meals", auth_default("PROVIDER" /* PROVIDER */), mealsController.createMeal);
router.get("/meals", mealsController.getAllMeals);
router.get("/meals/:id", mealsController.getMeal);
router.put("/provider/meals/:id", auth_default("PROVIDER" /* PROVIDER */), mealsController.updateMeal);
router.delete("/provider/meals/:id", auth_default("PROVIDER" /* PROVIDER */), mealsController.deleteMeal);
var mealsRouter = router;

// src/modules/provider/provider.router.ts
import express2 from "express";

// src/modules/provider/provider.service.ts
var createProviderProfile = async (data, userId) => {
  const profileInfo = { userId, ...data };
  const result = await prisma.providerProfiles.create({
    data: {
      ...profileInfo
    }
  });
  return result;
};
var getProviderProfile = async (id) => {
  const profile = await prisma.providerProfiles.findUnique({
    where: {
      userId: id
    }
  });
  const providerId = profile?.id;
  if (!providerId) {
    return {
      status: 404,
      success: false,
      message: "Provider not found, create profile"
    };
  }
  return profile;
};
var getProviders = async () => {
  const providers = await prisma.providerProfiles.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
  return providers;
};
var getProvider = async (id) => {
  const provider = await prisma.providerProfiles.findUnique({
    where: {
      userId: id
    },
    include: {
      meals: {
        select: {
          id: true,
          dietary: true,
          category: true,
          name: true,
          description: true,
          price: true,
          thumbnail: true,
          isAvailable: true,
          reviews: true
        }
      }
    }
  });
  return provider;
};
var getProviderOrders = async (id) => {
  const providerProfile = await prisma.providerProfiles.findUnique({
    where: {
      userId: id
    }
  });
  const providerId = providerProfile?.id;
  if (!providerId) {
    throw new Error("Provider profile not found");
  }
  const providerOrders = await prisma.orders.findMany({
    where: {
      providerId,
      status: {
        in: ["PLACED", "DELIVERED"]
      }
    },
    select: {
      id: true,
      deliveryAddress: true,
      user: {
        select: {
          name: true,
          email: true
        }
      },
      orderItems: {
        select: {
          category: {
            select: {
              cuisine: true
            }
          },
          meals: {
            select: {
              name: true,
              price: true
            }
          },
          quantity: true
        }
      },
      paymentMethod: true,
      totalAmount: true,
      createdAt: true,
      status: true
    }
  });
  return providerOrders;
};
var getProviderOrderById = async (id) => {
  const providerOrder = await prisma.orders.findUnique({
    where: {
      id
    }
  });
  return providerOrder;
};
var updateOrderStatus = async (data, id) => {
  const orderStatus = await prisma.orders.update({
    where: {
      id
    },
    data: {
      ...data
    }
  });
  return orderStatus;
};
var updateProfile = async (data, id) => {
  const updateData = await prisma.providerProfiles.update({
    where: {
      id
    },
    data: {
      ...data
    }
  });
  return updateData;
};
var getProviderStats = async (userId) => {
  const provider = await prisma.providerProfiles.findUnique({
    where: {
      userId
    }
  });
  if (!provider) {
    throw new Error("Provider not found");
  }
  const providerId = provider?.id;
  const [totalMeals, totalOrders, revenue] = await Promise.all([
    prisma.meals.count({
      where: { providerId }
    }),
    prisma.orders.count({
      where: { providerId }
    }),
    prisma.orders.aggregate({
      where: {
        providerId,
        status: "DELIVERED"
      },
      _sum: {
        totalAmount: true
      }
    })
  ]);
  return {
    totalMeals,
    totalOrders,
    totalRevenue: revenue._sum.totalAmount || 0
  };
};
var providerSevices = {
  createProviderProfile,
  getProviderProfile,
  updateProfile,
  getProvider,
  getProviders,
  getProviderOrders,
  getProviderOrderById,
  updateOrderStatus,
  getProviderStats
};

// src/modules/provider/provider.controller.ts
var createProviderProfile2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user"
      });
    }
    const providerInfo = req.body;
    const result = await providerSevices.createProviderProfile(providerInfo, userId);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Provider profile create failed",
      details: error
    });
  }
};
var getProviderProfile2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    const result = await providerSevices.getProviderProfile(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Provider profile get failed",
      details: error
    });
  }
};
var getProviders2 = async (req, res) => {
  try {
    const result = await providerSevices.getProviders();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Providers get failed",
      details: error
    });
  }
};
var getProvider2 = async (req, res) => {
  try {
    const id = req.user?.id;
    const result = await providerSevices.getProvider(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Provider get failed",
      details: error
    });
  }
};
var getProviderOrders2 = async (req, res) => {
  try {
    const id = req.user?.id;
    if (!id || typeof id !== "string") {
      return {
        message: "User id is invallied"
      };
    }
    const result = await providerSevices.getProviderOrders(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Provider orders get failed",
      details: error
    });
  }
};
var getProviderOrderById2 = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return {
        message: "Order id invallied"
      };
    }
    const result = await providerSevices.getProviderOrderById(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Provider order get failed",
      details: error
    });
  }
};
var updateOrderStatus2 = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return {
        message: "Id requred!"
      };
    }
    const data = req.body;
    const result = await providerSevices.updateOrderStatus(data, id);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Order status update failed",
      details: error
    });
  }
};
var updateProfile2 = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return {
        message: "Id requred!"
      };
    }
    const updateData = req.body;
    const result = await providerSevices.updateProfile(updateData, id);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Provider profile update failed",
      details: error
    });
  }
};
var getProviderStats2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    const result = await providerSevices.getProviderStats(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Provider stats get failed",
      details: error
    });
  }
};
var providerController = {
  createProviderProfile: createProviderProfile2,
  getProviderProfile: getProviderProfile2,
  updateProfile: updateProfile2,
  getProviders: getProviders2,
  getProvider: getProvider2,
  getProviderOrders: getProviderOrders2,
  getProviderOrderById: getProviderOrderById2,
  updateOrderStatus: updateOrderStatus2,
  getProviderStats: getProviderStats2
};

// src/modules/provider/provider.router.ts
var router2 = express2.Router();
router2.post("/provider/profile", auth_default("PROVIDER" /* PROVIDER */), providerController.createProviderProfile);
router2.get("/provider/profile", auth_default("PROVIDER" /* PROVIDER */), providerController.getProviderProfile);
router2.get("/providers", providerController.getProviders);
router2.get("/provider/meals", auth_default("PROVIDER" /* PROVIDER */), providerController.getProvider);
router2.get("/provider/orders", auth_default("PROVIDER" /* PROVIDER */), providerController.getProviderOrders);
router2.get("/provider/orders/:id", auth_default("PROVIDER" /* PROVIDER */), providerController.getProviderOrderById);
router2.patch("/provider/orders/status/:id", auth_default("PROVIDER" /* PROVIDER */), providerController.updateOrderStatus);
router2.patch("/provider/profile/:id", auth_default("PROVIDER" /* PROVIDER */), providerController.updateProfile);
router2.get("/provider/stats", auth_default("PROVIDER" /* PROVIDER */), providerController.getProviderStats);
var providerRouter = router2;

// src/modules/categories/categories.router.ts
import express3 from "express";

// src/modules/categories/categories.service.ts
var createCategories = async (data) => {
  const result = await prisma.categories.create({
    data: {
      ...data
    }
  });
  return result;
};
var getCategories = async () => {
  const categories = await prisma.categories.findMany();
  return categories;
};
var deleteCategories = async (cateId) => {
  const deleteCate = await prisma.categories.delete({
    where: {
      id: cateId
    }
  });
  return deleteCate;
};
var getAdminStats = async () => {
  const [
    totalUsers,
    totalOrders,
    totalCategories,
    totalProviders,
    revenue
  ] = await Promise.all([
    prisma.user.count(),
    prisma.orders.count(),
    prisma.categories.count(),
    prisma.providerProfiles.count(),
    prisma.orders.aggregate({
      _sum: { totalAmount: true }
    })
  ]);
  return {
    totalUsers,
    totalOrders,
    totalCategories,
    totalProviders,
    totalRevenue: revenue?._sum?.totalAmount ?? 0
  };
};
var categoriesSevices = {
  createCategories,
  getCategories,
  deleteCategories,
  getAdminStats
};

// src/modules/categories/categories.controller.ts
var createCategories2 = async (req, res) => {
  try {
    const data = req.body;
    const result = await categoriesSevices.createCategories(data);
    res.status(200).json(result);
  } catch (error) {
    if (error.code === "P2002") {
      res.status(400).json({
        error: "Category list already exists",
        status: 400
      });
    }
  }
};
var getCategories2 = async (req, res) => {
  try {
    const result = await categoriesSevices.getCategories();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Category update failed",
      details: error
    });
  }
};
var deleteCategories2 = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || typeof id != "string") {
      throw new Error("Invalid category id");
    }
    const result = await categoriesSevices.deleteCategories(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Category update failed",
      details: error
    });
  }
};
var getAdminStats2 = async (req, res) => {
  try {
    const result = await categoriesSevices.getAdminStats();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Admin stats getting failed",
      details: error
    });
  }
};
var categoriesController = {
  createCategories: createCategories2,
  getCategories: getCategories2,
  deleteCategories: deleteCategories2,
  getAdminStats: getAdminStats2
};

// src/modules/categories/categories.router.ts
var router3 = express3.Router();
router3.post("/categories", auth_default("ADMIN" /* ADMIN */), categoriesController.createCategories);
router3.get("/categories", categoriesController.getCategories);
router3.delete("/categories/:id", auth_default("ADMIN" /* ADMIN */), categoriesController.deleteCategories);
router3.get("/admin-stats", auth_default("ADMIN" /* ADMIN */), categoriesController.getAdminStats);
var categoriesRouter = router3;

// src/modules/orders/orders.router.ts
import express4 from "express";

// src/modules/orders/orders.service.ts
var createOrder = async (data, userId) => {
  console.log(data);
  const { cartId, providerId, deliveryAddress, items } = data;
  const order = await prisma.orders.create({
    data: {
      userId,
      providerId,
      deliveryAddress,
      totalAmount: 0
    }
  });
  let totalAmount = 0;
  for (const item of items) {
    const meal = await prisma.meals.findUnique({
      where: {
        id: item.mealId
      }
    });
    if (!meal) {
      throw new Error("Meal not found");
    }
    ;
    const price = Number(meal.price) * item.quantity;
    totalAmount = totalAmount + price;
    await prisma.orderItems.create({
      data: {
        orderID: order.id,
        mealId: meal.id,
        categoryId: meal.categoryId,
        quantity: item.quantity,
        price: meal.price
      }
    });
  }
  await prisma.orders.update({
    where: { id: order.id },
    data: { totalAmount }
  });
  const updateCartStatus = await prisma.cart.update({
    where: {
      id: cartId,
      status: "ACTIVE"
    },
    data: {
      status: "ORDERED"
    }
  });
  return updateCartStatus;
};
var getOrders = async (userId) => {
  const orders = await prisma.orders.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: "desc"
    },
    select: {
      id: true,
      status: true,
      deliveryAddress: true,
      paymentMethod: true,
      totalAmount: true,
      createdAt: true,
      provider: {
        select: {
          id: true,
          restaurentName: true
        }
      },
      orderItems: {
        select: {
          quantity: true,
          price: true,
          meals: {
            select: {
              id: true,
              name: true,
              thumbnail: true
            }
          }
        }
      }
    }
  });
  return orders;
};
var getOrderById = async (id) => {
  const order = await prisma.orders.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      status: true,
      deliveryAddress: true,
      paymentMethod: true,
      totalAmount: true,
      createdAt: true,
      provider: {
        select: {
          id: true,
          restaurentName: true
        }
      },
      orderItems: {
        select: {
          quantity: true,
          price: true,
          meals: {
            select: {
              id: true,
              name: true,
              thumbnail: true
            }
          }
        }
      }
    }
  });
  return order;
};
var updateOrderStatus3 = async (orderId, userId, role) => {
  if (role === "USER" /* USER */) {
    await prisma.orders.update({
      where: {
        userId,
        id: orderId
      },
      data: {
        status: "CANCELED"
      }
    });
  } else if (role === "PROVIDER" /* PROVIDER */) {
    await prisma.orders.update({
      where: {
        id: orderId
      },
      data: {
        status: "DELIVERED"
      }
    });
  }
  return;
};
var ordersServices = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus: updateOrderStatus3
};

// src/modules/orders/orders.controller.ts
var createOrder2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return {
        message: "Please login you account first!"
      };
    }
    const orderData = req.body;
    const result = await ordersServices.createOrder(orderData, userId);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Order create failed",
      details: error
    });
  }
};
var getOrders2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const result = await ordersServices.getOrders(userId);
    res.status(200).json({
      data: result,
      success: true
    });
  } catch (error) {
    res.status(400).json({
      error: "Orders get failed",
      details: error
    });
  }
};
var getOrderById2 = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || typeof id !== "string") {
      return {
        message: "Invallied Order id"
      };
    }
    const result = await ordersServices.getOrderById(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Order get failed",
      details: error
    });
  }
};
var updateOrderStatus4 = async (req, res) => {
  try {
    const orderId = req.params.id;
    const role = req.user?.role;
    const userId = req.user?.id;
    const result = await ordersServices.updateOrderStatus(orderId, userId, role);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Order get failed",
      details: error
    });
  }
};
var ordersController = {
  createOrder: createOrder2,
  getOrders: getOrders2,
  getOrderById: getOrderById2,
  updateOrderStatus: updateOrderStatus4
};

// src/modules/orders/orders.router.ts
var router4 = express4.Router();
router4.post("/orders", auth_default("ADMIN" /* ADMIN */, "PROVIDER" /* PROVIDER */, "USER" /* USER */), ordersController.createOrder);
router4.get("/orders", auth_default("ADMIN" /* ADMIN */, "PROVIDER" /* PROVIDER */, "USER" /* USER */), ordersController.getOrders);
router4.get("/orders/:id", ordersController.getOrderById);
router4.patch("/orders/:id", auth_default("ADMIN" /* ADMIN */, "PROVIDER" /* PROVIDER */, "USER" /* USER */), ordersController.updateOrderStatus);
var ordersRouter = router4;

// src/modules/admin/admin.router.ts
import express5 from "express";

// src/modules/admin/admin.service.ts
var getUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};
var getAllOrders = async () => {
  const orders = await prisma.orders.findMany({
    include: {
      orderItems: true
    }
  });
  return orders;
};
var updateUserRole = async (data, id) => {
  const roleChange = await prisma.user.update({
    where: {
      id
    },
    data: {
      ...data
    }
  });
  return roleChange;
};
var updateUserStatus = async (userId) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!existingUser) {
    throw new Error("User not found");
  }
  const newStatus = existingUser.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status: newStatus }
  });
  return updatedUser;
};
var adminServices = {
  getUsers,
  updateUserRole,
  updateUserStatus,
  getAllOrders
};

// src/modules/admin/admin.controller.ts
var getUsers2 = async (req, res) => {
  try {
    const result = await adminServices.getUsers();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Get users failed",
      details: error
    });
  }
};
var getAllOrders2 = async (req, res) => {
  try {
    const result = await adminServices.getAllOrders();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Get users failed",
      details: error
    });
  }
};
var updateUserRole2 = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || typeof id !== "string") {
      return {
        message: "User id invallied"
      };
    }
    const data = req.body;
    const result = await adminServices.updateUserRole(data, id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Update user status failed",
      details: error
    });
  }
};
var updateUserStatus2 = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await adminServices.updateUserStatus(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Update user status failed",
      details: error
    });
  }
};
var adminController = {
  getUsers: getUsers2,
  getAllOrders: getAllOrders2,
  updateUserRole: updateUserRole2,
  updateUserStatus: updateUserStatus2
};

// src/modules/admin/admin.router.ts
var router5 = express5.Router();
router5.get("/admin/users", auth_default("ADMIN" /* ADMIN */), adminController.getUsers);
router5.get("/admin/orders", auth_default("ADMIN" /* ADMIN */), adminController.getAllOrders);
router5.patch("/admin/users/:id", auth_default("ADMIN" /* ADMIN */), adminController.updateUserRole);
router5.patch("/admin/users/status/:id", auth_default("ADMIN" /* ADMIN */), adminController.updateUserStatus);
var adminRoter = router5;

// src/modules/auth/auth.router.ts
import express6 from "express";

// src/modules/auth/auth.controller.ts
var getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (err) {
    console.log(err);
  }
};
var authController = {
  getMe
};

// src/modules/auth/auth.router.ts
var router6 = express6.Router();
router6.get("/my-info", auth_default("ADMIN" /* ADMIN */, "PROVIDER" /* PROVIDER */, "USER" /* USER */), authController.getMe);
var authRouter = router6;

// src/modules/reviews/reviews.router.ts
import express7 from "express";

// src/modules/reviews/reviews.service.ts
var createReviews = async (data, id) => {
  const reviews = await prisma.reviews.create({
    data: {
      customerId: id,
      ...data
    }
  });
  return reviews;
};
var getCustomerReviews = async (id) => {
  const customerReviews = await prisma.reviews.findMany({
    where: {
      customerId: id
    }
  });
  return customerReviews;
};
var updateReviews = async (data, id) => {
  const update = await prisma.reviews.update({
    where: {
      id
    },
    data: {
      ...data
    }
  });
  return update;
};
var reviewsServices = {
  createReviews,
  getCustomerReviews,
  updateReviews
};

// src/modules/reviews/reviews.controller.ts
var createReviews2 = async (req, res) => {
  try {
    const id = req.user?.id;
    if (!id) {
      return {
        message: "User id invallied"
      };
    }
    const data = req.body;
    console.log(data);
    const result = await reviewsServices.createReviews(data, id);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Review create failled!",
      details: error
    });
  }
};
var getCustomerReviews2 = async (req, res) => {
  try {
    const id = req.user?.id;
    if (!id) {
      return {
        message: "User id invallied"
      };
    }
    const result = await reviewsServices.getCustomerReviews(id);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Review get failled!",
      details: error
    });
  }
};
var updateReviews2 = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await reviewsServices.updateReviews(data, id);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Review update failled!",
      details: error
    });
  }
};
var reviewsContoller = {
  createReviews: createReviews2,
  getCustomerReviews: getCustomerReviews2,
  updateReviews: updateReviews2
};

// src/modules/reviews/reviews.router.ts
var router7 = express7.Router();
router7.post("/reviews", auth_default("USER" /* USER */), reviewsContoller.createReviews);
router7.get("/my-reviews", auth_default("USER" /* USER */), reviewsContoller.getCustomerReviews);
router7.put("/my-reviews/:id", auth_default("USER" /* USER */), reviewsContoller.updateReviews);
var reviewsRouter = router7;

// src/modules/cart/cart.router.ts
import express8 from "express";

// src/modules/cart/cart.service.ts
var createCart = async (data, userId) => {
  let cart = await prisma.cart.findFirst({
    where: {
      userId,
      status: "ACTIVE"
    }
  });
  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
        status: "ACTIVE"
      }
    });
  }
  const meal = await prisma.meals.findUnique({
    where: { id: data.mealId }
  });
  if (!meal) {
    return {
      message: "Meal not found"
    };
  }
  const existingItem = await prisma.cartItems.findFirst({
    where: {
      cartId: cart.id,
      mealId: data.mealId
    }
  });
  if (existingItem) {
    await prisma.cartItems.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + data.quantity,
        price: Number(meal.price) * (existingItem.quantity + data.quantity)
      }
    });
  } else {
    await prisma.cartItems.create({
      data: {
        cartId: cart.id,
        mealId: data.mealId,
        quantity: data.quantity,
        price: Number(meal.price) * data.quantity
      }
    });
  }
  return {
    message: "Item added to cart",
    cartId: cart.id
  };
};
var getCartItems = async (userId) => {
  const cart = await prisma.cart.findFirst({
    where: {
      userId,
      status: "ACTIVE"
    },
    include: {
      cartItems: {
        include: {
          meals: {
            select: {
              providerId: true,
              name: true,
              thumbnail: true,
              category: {
                select: {
                  cuisine: true
                }
              }
            }
          }
        }
      }
    }
  });
  if (!cart) {
    return {
      success: true,
      data: [],
      message: "Cart is empty"
    };
  }
  return {
    success: true,
    data: cart.cartItems
  };
};
var deleteCartItems = async (id) => {
  const deleteItems = await prisma.cartItems.delete({
    where: {
      id
    }
  });
  return deleteItems;
};
var cartService = {
  createCart,
  getCartItems,
  deleteCartItems
};

// src/modules/cart/cart.controller.ts
var createCart2 = async (req, res) => {
  try {
    const id = req.user?.id;
    if (!id) {
      return {
        message: "Please login you account first!"
      };
    }
    const data = req.body;
    const result = await cartService.createCart(data, id);
    res.status(201).json({
      success: true,
      message: "Cart created",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: "Cart create failed",
      details: error
    });
  }
};
var getCartItems2 = async (req, res) => {
  try {
    const id = req.user?.id;
    if (!id) {
      return {
        message: "Please login you account first!"
      };
    }
    const result = await cartService.getCartItems(id);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: "Cart get failed",
      details: error
    });
  }
};
var deleteCartItems2 = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || typeof id !== "string") {
      return {
        message: "Id invallied"
      };
    }
    const result = await cartService.deleteCartItems(id);
    res.status(200).json({
      data: result,
      success: true
    });
  } catch (error) {
    res.status(400).json({
      error: "Cart delete failed",
      details: error
    });
  }
};
var cartController = {
  createCart: createCart2,
  getCartItems: getCartItems2,
  deleteCartItems: deleteCartItems2
};

// src/modules/cart/cart.router.ts
var router8 = express8.Router();
router8.post("/cart", auth_default("USER" /* USER */), cartController.createCart);
router8.get("/cart", auth_default("USER" /* USER */), cartController.getCartItems);
router8.delete("/cart/:id", auth_default("USER" /* USER */), cartController.deleteCartItems);
var cartRouter = router8;

// src/app.ts
var app = express9();
app.use(express9.json());
app.use(cors({
  origin: process.env.APP_URL,
  // client side url
  credentials: true
}));
app.get("/", (req, res) => {
  res.send("Running Food Hub Server");
});
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api", authRouter);
app.use("/api", mealsRouter);
app.use("/api", providerRouter);
app.use("/api", ordersRouter);
app.use("/api", reviewsRouter);
app.use("/api", cartRouter);
app.use("/api", categoriesRouter);
app.use("/api", adminRoter);
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
