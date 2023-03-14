import { PrismaClient } from '@prisma/client'
import dotenv from "dotenv";

dotenv.config({ path: '../.env' });
const prisma = new PrismaClient();

// Create a new user in the database
export async function createUser(id: string, email: string) {
   prisma.user.create({
        data: {
            id: id,
            email: email,
        }
   }) 
   .then(() => console.log("User created: ", id, email))
   .catch(e => console.error(e))
   .finally(async () => await prisma.$disconnect())
}

// Based on a user id, fetch the user from the database
export async function fetchUser(id: string) {
    try {
        let user = await prisma.user.findUnique({
            where: {
                id: id,
            }
        });
        await prisma.$disconnect();
        return user;
    } catch (e) {
        console.error(e);
    }
}