'use server';
import { auth } from "@/firebase/admin";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { cookies } from "next/headers";
import { success } from "zod";
import { ca } from "zod/locales";

const ONE_WEEK = 60 * 60 * 24 * 7;


export async function SignUp(params: SignUpParams) {
    const { uid, name, email} = params;
    try {
        const userRecord = await db.collection('user').doc(uid).get();

        if (userRecord.exists) {
            return {
                success: false,
                message: 'User already exists.Please SignIn instead.'
            }
        }

        await db.collection('user').doc(uid).set({
            name,
            email,
        });
    }
    catch (e: any) {
        console.log("Error creating user:", e);
        if (e.code === 'auth/email-already-exists'){
        return {
            success: false,
            message: 'This email is already in use. Please try logging in instead.'
        }}

        return {
            success: false,
            message: 'Failed to create an account. Please try again later!'
        }
    }
}

export async function SignIn(params: SignInParams) {
    const { email, idToken } = params;
    try {
        const userRecord = await auth.getUserByEmail(email);       
        if (userRecord) {
            return {
                success: false,
                message: 'User does not exist. Please SignUp first.'
            }
        }
        await setSessionCookie(idToken);

    } catch (e) {
        console.log(e);
        return {
            success: false,
            message : 'Failed to sign in. Please try again later!'
        }
    }
}

export async function setSessionCookie(idToken: string) {

    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: 60 * 60 * 24 * 7 * 1000,
    })
    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    });
}