import ErrorPage from "@/components/error/errorPage";



interface PageProps {
  params: {
    message: string;
  };
}

export default async function ErrorPageRoute({ params }: PageProps) {
  const decodedMessage = decodeURIComponent(params.message);

  return (
    <ErrorPage
      title="Verification Error"
      message={decodedMessage}
      actionLabel="Back to Home"
      actionHref="/"
    />
  );
}
