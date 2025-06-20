import { LoginForm } from "@/components/LoginForm/loginForm";
import Logo from "@/components/logo/logo";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted">
      {/* Top nav / logo */}
      <header className="flex h-16 items-center justify-center border-b px-4 md:justify-start md:px-8">
        <Logo />
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-3xl">
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
