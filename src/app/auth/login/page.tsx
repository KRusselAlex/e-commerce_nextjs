import { LoginForm } from "@/components/LoginForm/loginForm";
import Logo from "@/components/logo/logo";

export default function LoginPage() {
  return (
    <div className="bg-muted h-full">
      <div className="flex min-h-screen flex-col justify-center  relative h-full max-w-7xl mx-auto w-full">
        {/* Top nav / logo */}
        <header className=" flex justify-center mt-3 md:mt-0 md:absolute md:top-4 md:left-0  z-10">
          <Logo />
        </header>

        {/* Main content */}
        <main className="flex flex-1 items-center  justify-center p-4 h-full md:p-6 lg:p-8">
          <div className="w-full max-w-4xl h-full">
            <LoginForm />
          </div>
        </main>
      </div>
    </div>
  );
}
