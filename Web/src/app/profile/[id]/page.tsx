import { redirect } from 'next/navigation';
import { Id } from '@convex/_generated/dataModel';

export default async function ProfileRedirectPage({ params }: { params: Promise<{ id: Id<'users'> }> }) {
  const { id } = await params;
  redirect(`/users/${id}`);
}
