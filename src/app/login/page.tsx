"use client";
import { UseAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import AuthFoam from '@/components/AuthFoam';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {

  const router = useRouter();
  const login = UseAuthStore((state) => state.login);


  const handleLogin = async (email: string, password: string) => {
    await login(email, password, () => {
      router.push("/");
    })
  }

  return (
    <>
      <AuthFoam func={handleLogin} />
      <ToastContainer position="top-center" />
    </>
  )
}

export default Login