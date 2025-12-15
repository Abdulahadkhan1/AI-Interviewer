import AuthForm from "@/components/AuthForm";
import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';

const Page = async () => {
  const authed = await isAuthenticated();
  if (authed) redirect('/');

  return <AuthForm type="sign-in" />;
};

export default Page;