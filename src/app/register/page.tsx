"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 shadow-lg bg-white rounded-2xl relative">
        <CardContent>
          <button
            className="absolute top-4 left-4 text-gray-600 hover:text-gray-800"
            onClick={() => router.back()}
          >
            <FaArrowLeft size={24} />
          </button>
          <Link
            href="/"
            className="absolute Sprite_Graffiti   top-4 right-4 text-primary  text-lg hover:underline"
          >
            A&apos;space
          </Link>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Create an Account
          </h2>
          <form className="space-y-4">
            <Input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
            <Button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900">
              Sign Up
            </Button>
          </form>
          <div className="text-center my-4 text-gray-600">OR</div>
          <Button className="w-full flex items-center text-white justify-center gap-2 border py-3 rounded-lg hover:bg-gray-200">
            <FcGoogle size={20} /> Sign up with Google
          </Button>
          <Button className="w-full flex items-center text-white justify-center gap-2 border py-3 rounded-lg mt-2 hover:bg-gray-200">
            <FaApple size={20} /> Sign up with Apple
          </Button>
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline">
              Sign In
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
