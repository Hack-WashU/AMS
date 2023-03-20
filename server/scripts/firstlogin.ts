import { PrismaClient, User } from '@prisma/client'
import dotenv from "dotenv";

dotenv.config({ path: '../.env' });
const prisma:PrismaClient = new PrismaClient();

// Create a new user in the database
export async function createUser(id: string, email: string) : Promise<void> {
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
export async function fetchUser(id: string) : Promise<User | Error | unknown> {
    try {
        let user = await prisma.user.findUnique({
            where: {
                id: id,
            }
        });
        if (!user){
            return Error("User not found")
        }
        await prisma.$disconnect();
        return user;
    } catch (e: unknown) {
        console.error(e)
        return e;
    }
}