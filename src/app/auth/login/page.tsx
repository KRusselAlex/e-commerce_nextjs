
import { LoginForm } from "@/components/LoginForm/loginForm";


export default function LoginPage() {

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted py-1 px-1 md:p-10">
      <div>
        <h1 className="logo flex justify-center Sprite_Graffiti text-5xl cursor-pointer text-primary mb-6">
          A&apos;SPACE
        </h1>
      </div>
      <div className="w-full h-full  max-w-sm md:max-w-4xl 2xl:max-w-6xl">
        <LoginForm />
      </div>
    </div>
  );
}
