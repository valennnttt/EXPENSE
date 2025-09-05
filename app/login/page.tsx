import AuthForm from "@/app/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md py-8">
      <AuthForm mode="login" />
      <p className="mt-6 text-center text-sm text-gray-600">
        Don’t have an account?{" "}
        <a className="underline" href="/register">
          Sign-up
        </a>
      </p>
    </div>
  );
}
