
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function EmailVerifiedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center space-y-4">
        <CheckCircle className="text-green-500 w-12 h-12 mx-auto" />
        <h1 className="text-2xl font-bold">Email Verified</h1>
        <p className="text-muted-foreground">
          Your email has been successfully verified. You can now log in to your
          account.
        </p>
        <Link href="/auth/login">
          <Button className="w-full mt-4 text-white">Go to Login</Button>
        </Link>
      </div>
    </div>
  );
}
