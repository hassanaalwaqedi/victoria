import Link from "next/link";

export function SectionHeading({ eyebrow, title, link }: { eyebrow?: string; title: string; link?: { label: string; href: string } }) { return <div className="mb-8 flex items-end justify-between gap-6 sm:mb-10"><div>{eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}<h2 className="display-title max-w-xl text-3xl sm:text-4xl lg:text-5xl">{title}</h2></div>{link && <Link href={link.href} className="hidden shrink-0 border-b border-gold pb-1 text-xs text-cocoa transition hover:text-rose sm:block">{link.label} ←</Link>}</div>; }
