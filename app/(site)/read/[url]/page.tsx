
import ReaderLayout from "@/components/layout/ReaderLayoutServer";

export default async function Page({ params }: { params: { url: string } }) {
  const decodedUrl = decodeURIComponent(params.url);
  return <ReaderLayout url={decodedUrl} />;
}