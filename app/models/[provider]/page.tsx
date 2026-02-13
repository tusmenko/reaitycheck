import Link from "next/link";

export default async function ModelProviderPage({
  params,
}: {
  params: Promise<{ provider: string }>;
}) {
  const { provider } = await params;
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="mb-4 text-2xl font-bold">
        Models by {decodeURIComponent(provider)}
      </h1>
      <p className="mb-6 text-muted-foreground">
        Provider overview. Select a model from the leaderboard or comparison
        grid.
      </p>
      <Link
        href="/"
        className="text-primary underline underline-offset-4 hover:no-underline"
      >
        Back to home
      </Link>
    </div>
  );
}
