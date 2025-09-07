'use client';

import { useForm } from 'react-hook-form';
import { useLoginMutation } from '../services/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type LoginForm = {
  email: string;
  password: string;
};

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [login, { isLoading, error }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
  try {
    const res: any = await login(data).unwrap();

    // Assuming your API returns the roles array
    const roles = res.roles || ['user'];

    dispatch(setCredentials({ token: res.access_token, roles }));

    // Redirect based on role
    if (roles.includes('admin') || roles.includes('super_admin')) {
      router.push('/dashboard/dashboard');
    } else {
      router.push('/');
    }
  } catch (err) {
    console.log(err);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        {/* Card Title */}
        <h1 className="text-3xl font-bold text-center mb-6 text-black">SHOP.CO</h1>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          {...register('email', { required: 'Email is required' })}
          className="w-full p-3 mb-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>
        )}

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          {...register('password', { required: 'Password is required' })}
          className="w-full p-3 mb-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-2">
            {errors.password.message}
          </p>
        )}

        {/* API Error */}
        {error && (
          <p className="text-red-500 text-sm mb-2">
            {(error as any)?.data?.message || 'Login failed'}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-3 mt-2 bg-black hover:bg-gray-900 rounded-lg text-white font-medium"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        {/* Signup Link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{' '}
          <Link href="/register" className="text-black font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
