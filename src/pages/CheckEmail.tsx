// src/pages/CheckEmail.tsx
import { Link, useLocation } from "react-router-dom";
import { Footer } from "@/components/footer";

export default function CheckEmail() {
  const location = useLocation() as { state?: { email?: string } };
  const email = location.state?.email;

  return (
    <div className="min-h-screen bg-app flex flex-col">
      <div className="flex-1 grid place-items-center px-4">
        <div className="glass rounded-2xl border max-w-md w-full p-6 text-center">
          <h1 className="text-xl font-semibold mb-2">Confirm your email</h1>
          <p className="text-sm opacity-80">
            We've sent a confirmation link{email ? <> to <strong>{email}</strong></> : ""}.<br />
            Please check your inbox (and spam) to activate your account. Please close this window.
          </p>
          <div className="mt-5">
            <Link to="/signin" className="btn-glass inline-block">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}