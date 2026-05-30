import type { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { IconArrowLeft, IconExternalLink } from "@tabler/icons-react";
import type { MediaDetail } from "@/pages/api/instagram/[id]";

type Props = {
  media: MediaDetail;
};

export default function ProjectDetail({ media }: Props) {
  const titleLine = media.caption?.split("\n")[0] ?? "Instagram Post";
  const bodyCaption = media.caption?.split("\n").slice(1).join("\n").trim() ?? "";
  const postedDate = new Date(media.timestamp).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const isVideo = media.media_type === "VIDEO";

  return (
    <>
      <Head>
        <title>{titleLine} — Hair & Makeup by Anjali</title>
        <meta name="description" content={titleLine} />
      </Head>

      <div className="min-h-screen bg-black text-white">
        {/* Back navigation */}
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-neutral-800">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm"
            >
              <IconArrowLeft size={16} />
              Back to Gallery
            </Link>
          </div>
        </div>

        <main className="max-w-3xl mx-auto px-4 py-10">
          {/* Full media */}
          <div className="w-full flex justify-center mb-8">
            {isVideo ? (
              <video
                controls
                autoPlay
                muted
                loop
                playsInline
                poster={media.thumbnail_url}
                className="w-full max-h-[75vh] object-contain rounded-xl"
              >
                <source src={media.media_url} type="video/mp4" />
              </video>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={media.media_url}
                alt={titleLine}
                className="w-full max-h-[75vh] object-contain rounded-xl"
              />
            )}
          </div>

          {/* Caption heading */}
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-4">
            {titleLine}
          </h1>

          {/* Full caption body */}
          {bodyCaption && (
            <p className="text-neutral-400 whitespace-pre-line text-sm md:text-base leading-relaxed mb-6">
              {bodyCaption}
            </p>
          )}

          {/* Footer row — date + Instagram link */}
          <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-neutral-800">
            <span className="text-neutral-500 text-sm">{postedDate}</span>

            {media.permalink && (
              <a
                href={media.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-white bg-neutral-800 hover:bg-neutral-700 transition-colors px-4 py-2 rounded-full"
              >
                Open on Instagram
                <IconExternalLink size={14} />
              </a>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const { id } = ctx.params as { id: string };
  const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

  if (!ACCESS_TOKEN) {
    return { notFound: true };
  }

  try {
    const params = new URLSearchParams({
      fields: "id,media_type,media_url,thumbnail_url,caption,timestamp,permalink",
      access_token: ACCESS_TOKEN,
    });

    const res = await fetch(`https://graph.instagram.com/${id}?${params}`);
    if (!res.ok) return { notFound: true };

    const media: MediaDetail = await res.json();

    return {
      props: { media },
    };
  } catch {
    return { notFound: true };
  }
};
