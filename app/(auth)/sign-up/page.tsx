import AuthForm from '@/components/AuthForm'
import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';

const page = async () => {
  const authed = await isAuthenticated();
  if (authed) redirect('/');

  return <AuthForm type="sign-up" />;
}

export default page