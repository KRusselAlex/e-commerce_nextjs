"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ErrorPageProps {
  title?: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function ErrorPage({
  title = "Oops!",
  message,
  actionLabel = "Go Home",
  actionHref = "/",
}: ErrorPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
      <Link href={actionHref}>
        <Button className="text-white">{actionLabel}</Button>
      </Link>
    </div>
  );
}
