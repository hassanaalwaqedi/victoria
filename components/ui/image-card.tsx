import Image from "next/image";
import Link from "next/link";

type Props = { href: string; image: string | null; title: string; subtitle?: string; className?: string };

export function ImageCard({ href, image, title, subtitle, className = "" }: Props) {
  return (
    <Link href={href} className={`group relative block overflow-hidden rounded-[2rem] ${className}`}>
      {image ? <Image src={image} alt={title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition duration-700 group-hover:scale-105" /> : <div className="absolute inset-0 bg-cocoa/70" />}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-cream sm:p-8">
        {subtitle && <p className="mb-2 text-xs text-cream/70">{subtitle}</p>}
        <h3 className="text-xl font-medium sm:text-2xl">{title}</h3>
      </div>
    </Link>
  );
}
