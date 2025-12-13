import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Bridge from "../components/Icons/Bridge";
import Logo from "../components/Icons/Logo";
import Modal from "../components/Modal";
import cloudinary from "../utils/cloudinary";
import getBase64ImageUrl from "../utils/generateBlurPlaceholder";
import type { ImageProps } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";

/*

https://vercel.com/blog/building-a-fast-animated-image-gallery-with-next-js
https://cloudinary.com/documentation/transformation_reference
https://www.flickr.com/photos/138302041@N06/

nusbio2
https://console.cloudinary.com/app/c-f365f09c777553e8ebf1ea4f54d6f7/assets/media_library/folders/cd8301c579893e3a49bd9528788fc09474?view_mode=mosaic

*/

const PAGE_TITLE = "Nusbio 1 - Frederic Torres";

function getUrl(public_id: string, format: string) {

  const url = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`;
  //console.log(`getUrl ${public_id} ${format}, url ${url}`);
  return url;
}

const Home: NextPage = ({ images }: { images: ImageProps[] }) => {

  const router = useRouter();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();
  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);
  const [nusbio1, setNusbio1] = useState(true);
  const [nusbio2, setNusbio2] = useState(false);
  const [analog, setAnalog] = useState(false);

  if (photoId) {
    console.log(`photoId ${photoId} DETECTED`);
  }
  else {
    if (!nusbio1 && !nusbio2 && !analog) {
      images = [];
    }
    else if (nusbio1 && nusbio2 && analog) {
      images = images;
    }
    else {
      const images2 = images;
      images = [];
      if (nusbio1)
        images.push(...images2.filter((image) => image.parentFolder.includes("nusbio1")));
      if (nusbio2)
        images.push(...images2.filter((image) => image.parentFolder.includes("nusbio2")));
      if (analog)
        images.push(...images2.filter((image) => image.parentFolder.includes("analog")));
    }
  }

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  return (
    <>
      <Head>
        <title> {PAGE_TITLE}</title>
        <meta property="og:image" content="https://nextjsconf-pics.vercel.app/og-image.png" />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        {photoId && (
          <Modal images={images} onClose={() => { setLastViewedPhoto(photoId); }} />
        )}
        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
          <div className="after:content relative mb-1 flex flex-col  gap-4 overflow-hidden rounded-lg bg-white/10 px-6 pb-16 pt-64 text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight lg:pt-0">
            <h1 className="mt-2 mb-1 text-base font-bold tracking-widest">
              {PAGE_TITLE}
            </h1>
            <div className="">
              Nusbio /2 + FT232H.NET Library. <br /><br />
              The .NET/Windows library FT232H.NET provides an abstraction to program
              <ul>
                <li>- The SPI protocol</li>
                <li>- The I2C protocol</li>
                <li>- The GPIOs</li>
              </ul>
              for the FTDI chip FT232H using the (
              <a href="https://www.adafruit.com/product/2264">Adafruit Breakout FT232H</a>
              ) or any other compatible breakout.
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={nusbio1}
                  onChange={(e) => setNusbio1(e.target.checked)}
                  className="rounded text-pink-500 focus:ring-0"
                />
                <span>Nusbio1</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={nusbio2}
                  onChange={(e) => setNusbio2(e.target.checked)}
                  className="rounded text-pink-500 focus:ring-0"
                />
                <span>Nusbio2</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={analog}
                  onChange={(e) => setAnalog(e.target.checked)}
                  className="rounded text-pink-500 focus:ring-0"
                />
                <span>Analog</span>
              </label>
            </div>
          </div>
          {images.map(({ id, public_id, format, blurDataUrl }) => (
            <Link key={id} href={`/?photoId=${id}`} as={`/p/${id}`}
              ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
              shallow
              className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
            >
              <Image alt=""
                className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                style={{ transform: "translate3d(0, 0, 0)" }}
                placeholder="blur"
                blurDataURL={blurDataUrl}
                src={getUrl(public_id, format)}
                width={720}
                height={480}
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, (max-width: 1536px) 33vw, 25vw"
              />
            </Link>
          ))}
        </div>
      </main>
      <footer className="p-6 text-center text-white/80 sm:p-12">
        Thank you to footer
      </footer>
    </>
  );
};

export default Home;

let __counter = 0;
let __reducedResults: ImageProps[] = [];

export async function getStaticProps() {

  if (__reducedResults.length > 0) {
    console.log(`\r\n*** getStaticProps **** OPTIMIZED **** `);
    return { props: { images: __reducedResults } };
  }

  console.log(`\r\n*** getStaticProps ********************************** `);
  console.log(`Machine Name: ${require("os").hostname()}`);
  __counter++;
  console.log(`__counter ${__counter}`);
  console.log(`process.env.CLOUDINARY_FOLDER ${process.env.CLOUDINARY_FOLDER} `);

  const results = await cloudinary.v2.search
    .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
    .sort_by("public_id", "desc")
    .max_results(400)
    .execute();

  console.log(`results ${results.resources.length}`);

  let reducedResults: ImageProps[] = [];
  let i = 0;
  for (let result of results.resources) {
    //console.log(`result ${result.public_id} ${JSON.stringify(result)}`);
    reducedResults.push({ id: i, height: result.height, width: result.width, public_id: result.public_id, format: result.format, parentFolder: result.asset_folder, aspect_ratio: result.aspect_ratio });
    i++;
  }

  console.log(`reducedResults ${reducedResults.length}`);

  const blurImagePromises = results.resources.map((image: ImageProps) => {
    return getBase64ImageUrl(image);
  });

  const imagesWithBlurDataUrls = await Promise.all(blurImagePromises);

  for (let i = 0; i < reducedResults.length; i++) {
    reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i];
  }

  console.log(`*************************************`);

  __reducedResults = reducedResults;

  return { props: { images: reducedResults } };
}

