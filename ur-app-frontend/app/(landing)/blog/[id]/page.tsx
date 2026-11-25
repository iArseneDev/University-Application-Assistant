import BlogDetailClient from './BlogDetailClient';

export async function generateStaticParams() {
  return [];
}

export default function Page({ params }: { params: { id: string } }) {
  return <BlogDetailClient id={params.id} />;
}