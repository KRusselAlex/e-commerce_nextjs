import ErrorPage, { ErrorPageProps } from "@/components/error/errorPage";

// Define params type
type Params = Promise<{ message: string }>;

// Use async function to await params
export default async function ErrorPageRoute({ params }: { params: Params }) {
  const resolvedParams = await params;
  const decodedMessage = decodeURIComponent(resolvedParams.message);

  const errorPageProps: ErrorPageProps = {
    title: "Verification Error",
    message: decodedMessage,
    actionLabel: "Back to Home",
    actionHref: "/",
  };

  return <ErrorPage {...errorPageProps} />;
}
