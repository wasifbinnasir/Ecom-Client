'use client';

import { useForm } from 'react-hook-form';
import { useRegisterMutation } from '../services/authApi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const router = useRouter();
  const [registerUser, { isLoading, error }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    try {
      const { confirmPassword, ...payload } = data;
      const response = await registerUser(payload).unwrap();

    
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (err: any) {
      const message = err?.data?.message;

      if (message?.includes('not verified')) {
        router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
      } else {
        console.error(err);
      }
    }
  };

  const password = watch('password');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        {/* Card Title */}
        <h1 className="text-3xl font-bold text-center mb-6 text-black">SHOP.CO</h1>

        {/* Name */}
        <input
          type="text"
          placeholder="Name"
          {...register('name', { required: 'Name is required' })}
          className="w-full p-3 mb-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mb-2">{errors.name.message}</p>
        )}

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
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Min 6 characters' },
          })}
          className="w-full p-3 mb-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-2">
            {errors.password.message}
          </p>
        )}

        {/* Confirm Password */}
        <input
          type="password"
          placeholder="Confirm Password"
          {...register('confirmPassword', {
            required: 'Confirm Password is required',
            validate: (value) =>
              value === password || 'Passwords do not match',
          })}
          className="w-full p-3 mb-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mb-2">
            {errors.confirmPassword.message}
          </p>
        )}

        {/* API Error */}
        {error && (
          <p className="text-red-500 text-sm mb-2">
            {(error as any)?.data?.message || 'Registration failed'}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-3 mt-2 bg-black hover:bg-gray-900 rounded-lg text-white font-medium"
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>

        {/* Already have an account? */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-black font-medium hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
