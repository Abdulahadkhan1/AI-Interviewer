"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { email, z } from "zod"

import { Button } from "@/components/ui/button"
import {Form, FormField} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { triggerAsyncId } from "async_hooks"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { constants } from "buffer"
import { auth } from "@/firebase/admin"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { SignIn, SignUp } from "@/lib/actions/auth.action"
const formSchema = z.object({
  username: z.string().min(2).max(50),
})

const AuthFormSchema = (type: FormType) => {
    return z.object ({
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().min(8, { message: "Password must be at least 8 characters" }),
        ...(type === "sign-up" && { name: z.string().min(2, { message: "Name must be at least 2 characters" }) })
    })
}

const AuthForm = ( { type }: {type : FormType}) => {
  const  router = useRouter();
  const formSchema = AuthFormSchema(type);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })
 
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try{
      if (type === 'sign-up') {
        const {name, email, password} = values;

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const result = await SignUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        })

        if (!result?.success) {
          toast.error(result?.message || 'Failed to create an account. Please try again later!');
          return;
        }


        toast.success('Account created successfully!');
        router.push('/sign-in');
      } else {
        const { email, password } = values;
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

        const idToken = await userCredentials.user.getIdToken();
        if (!idToken) {
          toast.error('Failed to sign in. Please try again later!');
          return;
        }
        await SignIn({ email, idToken });


        toast.success('Signed in successfully!');
        router.push('/');
      }
    }catch (error) {
      console.log(error);
      toast.error('There was an error: ${error}');
    }
  }

  const siSignIn = type==="sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
        <div className="flex flex-col gap-6 card py-14 px-10">
            <div className="flex flex-row gap-2 justify-center">
                <Image src="/logo.svg" alt="logo" height={32} width={38} />
                <h2 className="text-primary-100">PrepWise</h2>
            </div>
            <h3>Practice Job Interviews with AI </h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
                    {!siSignIn && (
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <div>
                            <label className="block text-sm font-medium">Name</label>
                            <Input placeholder="Your Name" {...(field as any)} />
                          </div>
                        )}
                      />
                    )}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <div>
                            <label className="block text-sm font-medium">Email</label>
                            <Input placeholder="Your email address" type="email" {...(field as any)} />
                          </div>
                        )}
                      />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <div>
                            <label className="block text-sm font-medium">Password</label>
                            <Input placeholder=" Enter your password" type="password" {...(field as any)} />
                          </div>
                        )}
                      />
                    <Button className="btn" type="submit">{siSignIn ? 'Sign In ' : 'Create an Account'}</Button>
                </form>
            </Form>
            <p className="text-center">
                {siSignIn ? "Don't have an account? " : "Already have an account? "}
             <Link href= {!siSignIn ? '/sign-in' : '/sign-up'} className="font-bold text-user-primary ml-1">
                {!siSignIn ? 'Sign In' : 'Sign Up'}
             </Link> 
            </p>
        </div>
    </div>

  )
}

export default AuthForm