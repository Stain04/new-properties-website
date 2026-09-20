import Image from "next/image";
import Link from "next/link";
import { photos } from "@/lib/images";

export default function NotFound() {
  return (
    <section className="relative min-h-[90svh] overflow-hidden bg-ink-950">
      <Image
        src={photos.heroCoast}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-45"
      />
      <div className="scrim-full absolute inset-0" />

      <div className="shell relative flex min-h-[90svh] flex-col justify-center py-32">
        <p className="eyebrow eyebrow-light">Error 404</p>
        <h1 className="display-xl mt-6 text-bone-50">
          Not found.
          <br />
          <span className="italic text-gold-400">Possibly sold.</span>
        </h1>
        <p className="lede lede-light mt-7 max-w-lg">
          The page you were looking for is not here. The catalogue is, and an adviser can usually
          find the closest equivalent to whatever you were after.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/properties" className="btn btn-gold">
            Browse properties
          </Link>
          <Link href="/contact" className="btn btn-outline-light">
            Speak to an adviser
          </Link>
        </div>
      </div>
    </section>
  );
}
