import { redirect } from 'next/navigation';

export default function MovieRedirectPage({
  params,
}: {
  params: { id: string };
}) {
  redirect(`/movies/movie/${params.id}`);
}
