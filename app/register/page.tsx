import AuthForm from "@/app/components/AuthForm";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md py-8">
      <AuthForm mode="register" />
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <a className="underline" href="/login">
          Sign-in
        </a>
      </p>
    </div>
  );
}
