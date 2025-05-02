import { PrismaClient } from "../generated/prisma/index.js";

const globalForPrisma = globalThis;
//This creates a reference to the global object (globalThis). In Node.js, this is equivalent to the global object, while in browsers it would be window.
/*he globalThis object exists in all modern JavaScript environments, including:

Node.js
Bun.js
Deno
Web browsers
Web Workers
Service Workers */
export const db = globalForPrisma.prisma || new PrismaClient();
/*
This line is implementing a singleton pattern for the PrismaClient. Here's what's happening:

First, it checks if globalForPrisma.PrismaClient exists (if a PrismaClient instance has already been stored on the global object)
If it exists, it uses that existing instance and assigns it to db
If it doesn't exist (like on the first run), it creates a new PrismaClient instance with new PrismaClient()
Either way, it assigns the resulting client to the db variable and exports it


When your application first starts:

globalForPrisma.PrismaClient is undefined (it doesn't exist yet)
So the code creates a new PrismaClient instance with new PrismaClient()
This new instance gets assigned to the db variable

When this happens, the PrismaClient instance:

Initializes a connection to your database

Loads all your Prisma schema models (more info below)
Model loading: Your models only get "loaded" when you actually instantiate PrismaClient in your running application with new PrismaClient()

The line export const db = globalForPrisma.PrismaClient || new PrismaClient(); creates or retrieves a PrismaClient instance, which is when your models actually become available to use in your code.
*/
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
/*

This if statement ensures the Prisma Client is stored in a global variable only in development (not production):

js
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
Why?
Development: Prevents duplicate database connections during hot-reloads.

Production: Avoids unnecessary global storage (since the app runs long-term).

What It Controls
Stores db in global → Only in development (for hot-reload safety).

Skips global storage → In production (optimizes memory usage).

Key Point: This is about managing the database connection, not where your actual data is stored.
*/
