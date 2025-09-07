'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useVerifyOtpMutation, useResendOtpMutation } from '../services/authApi';
import { useState } from 'react';
import Link from 'next/link';

type OtpForm = {
  otp: string;
};

export default function VerifyOtp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [verifyOtp, { isLoading: verifying, error: verifyError }] =
    useVerifyOtpMutation();
  const [resendOtp, { isLoading: resending, error: resendError }] =
    useResendOtpMutation();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpForm>();

  const onSubmit = async (data: OtpForm) => {
    try {
      await verifyOtp({ email, otp: data.otp }).unwrap();
      setSuccessMessage('✅ OTP verified! Redirecting to login...');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err) {
      console.log('OTP verification failed', err);
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ email }).unwrap();
      setSuccessMessage('📩 New OTP sent to your email!');
    } catch (err) {
      console.log('Resend OTP failed', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        {/* Brand Title */}
        <h1 className="text-3xl font-extrabold text-center mb-2">SHOP.CO</h1>
        <h2 className="text-lg mb-6 text-center text-gray-700 font-medium">
          Verify OTP
        </h2>

        <p className="text-gray-600 text-sm mb-4 text-center">
          We sent an OTP to <span className="font-semibold">{email}</span>
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          {...register('otp', { required: 'OTP is required' })}
          className="w-full p-3 mb-2 rounded border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
        />
        {errors.otp && (
          <p className="text-red-500 text-sm mb-2">{errors.otp.message}</p>
        )}

        {verifyError && (
          <p className="text-red-500 text-sm mb-2">
            {(verifyError as any)?.data?.message || 'OTP verification failed'}
          </p>
        )}

        {resendError && (
          <p className="text-red-500 text-sm mb-2">
            {(resendError as any)?.data?.message || 'Failed to resend OTP'}
          </p>
        )}

        {successMessage && (
          <p className="text-green-500 text-sm mb-2 text-center">
            {successMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={verifying}
          className="w-full p-3 bg-black hover:bg-gray-900 rounded text-white mb-3"
        >
          {verifying ? 'Verifying...' : 'Verify'}
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="w-full p-3 bg-gray-200 hover:bg-gray-300 rounded text-black"
        >
          {resending ? 'Resending...' : 'Resend OTP'}
        </button>

        {/* Back to Login */}
        <p className="text-sm text-center text-gray-600 mt-4">
          Already verified?{' '}
          <Link href="/login" className="text-black font-medium hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
