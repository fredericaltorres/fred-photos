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
import Markdown from "react-markdown";
const MarkDownClassName = "prose max-w-none prose-p:text-sm prose-p:leading-relaxed prose-p:font-normal  prose-p:text-white prose-ul:text-white prose-ol:text-white  prose-h1:text-white prose-h2:text-white prose-h3:text-white prose-h4:text-white prose-h5:text-white prose-h6:text-white prose-p:mt-2 prose-p:mb-2 prose-p:ml-2 prose-p:mr-2 ";


/*

  https://vercel.com/blog/building-a-fast-animated-image-gallery-with-next-js
  https://cloudinary.com/documentation/transformation_reference
  https://cloudinary.com/documentation/image_upload_api_reference
  https://cloudinary.com/documentation/search_method
  https://www.flickr.com/photos/138302041@N06/
  nusbio2
  https://console.cloudinary.com/app/c-f365f09c777553e8ebf1ea4f54d6f7/assets/media_library/folders/cd8301c579893e3a49bd9528788fc09474?view_mode=mosaic
  https://res.cloudinary.com/dlcbrqzbv/image/upload/c_scale,w_720/8x8_LED_Matrix_Consumption_glxrli.jpg
  https://res.cloudinary.com/dlcbrqzbv/image/upload/c_scale,w_1440/8x8_LED_Matrix_Consumption_glxrli.jpg
  https://res.cloudinary.com/dlcbrqzbv/image/upload/c_scale,w_2560/8x8_LED_Matrix_Consumption_glxrli.jpg

*/

const PAGE_TITLE = "Hardware projects by Frederic Torres";

const getUrl = (public_id: string, format: string) => `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`;

const nusbio1Markdown = `
### Nusbio /1 
The is USB communication interface for Windows/.NET/C# based on the FT232R chip providing an abstraction to program
* The SPI protocol
* The I2C protocol
* The GPIOs
`;

const nusbio2Markdown = `
### Nusbio /2 + FT232H.NET Library.
The .NET/Windows library FT232H.NET provides an abstraction to program
* The SPI protocol
* The I2C protocol
* The GPIOs
for the FTDI chip FT232H using the [Adafruit Breakout FT232H](https://www.adafruit.com/product/2264) or any other compatible breakout.
`;

const nusbio1LcdMarkdown = `
### Nusbio /1 + LCD 24x4
 Nusbio /1 + LCD is USB device for Windows/.NET/C# based on the FT232R chip to control a LCD 24x4.
`;

const analogMarkdown = `
### Analog
Different analog projects, based on the 1970 chip technology or Arduino.
`;

const arduinoMarkdown = `
### Arduino and other MCUs
- Arduino / ATmega328P MCU
- ESP32 MCU
- RP2040 MCU
`;

const Home: NextPage = ({ images, counter }: { images: ImageProps[], counter: number }) => {

  console.log(`counter ${counter}`);
  const router = useRouter();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();
  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);
  const [nusbio1, setNusbio1] = useState(true);
  const [nusbio2, setNusbio2] = useState(false);
  const [nusbio1Lcd, setNusbio1Lcd] = useState(false);
  const [analog, setAnalog] = useState(false);
  const [arduino, setArduino] = useState(false);
  const markdownInfos = [];

  if (photoId) {
    console.log(`photoId ${photoId} DETECTED`);
  }
  else {
    if (!nusbio1 && !nusbio2 && !analog && !nusbio1Lcd && !arduino) {
      images = [];
    }
    else if (nusbio1 && nusbio2 && analog && nusbio1Lcd && arduino) {
      images = images;
      markdownInfos.push(nusbio1Markdown, nusbio2Markdown, nusbio1LcdMarkdown, analogMarkdown);
    }
    else {
      const images2 = images;
      images = [];
      if (nusbio1) {
        images.push(...images2.filter((image) => image.parentFolder.includes("/nusbio1")));
        markdownInfos.push(nusbio1Markdown);
      }
      if (nusbio2) {
        images.push(...images2.filter((image) => image.parentFolder.includes("/nusbio2")));
        markdownInfos.push(nusbio2Markdown);
      }
      if (nusbio1Lcd) {
        images.push(...images2.filter((image) => image.parentFolder.includes("/nusbio_lcd")));
        markdownInfos.push(nusbio1LcdMarkdown);
      }
      if (analog) {
        images.push(...images2.filter((image) => image.parentFolder.includes("/analog")));
        markdownInfos.push(analogMarkdown);
      }
      if (arduino) {
        images.push(...images2.filter((image) => image.parentFolder.includes("/arduino")));
        markdownInfos.push(arduinoMarkdown);
      }
    }
  }
  console.log(`images ${images.length}`);

  // useEffect(() => {
  //   // This effect keeps track of the last viewed photo in the modal to keep the index page 
  //   // in sync when the user navigates back
  //   if (lastViewedPhoto && !photoId) {
  //     lastViewedPhotoRef.current.scrollIntoView({ block: "center" });
  //     setLastViewedPhoto(null);
  //   }
  // }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

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

            <div className="flex flex-col mt-4">

              <label className="flex items-center gap-2"><input type="checkbox" checked={nusbio1} onChange={(e) => setNusbio1(e.target.checked)} className="rounded text-pink-500 focus:ring-0" /> <span>Nusbio1 USB Device</span></label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={nusbio2} onChange={(e) => setNusbio2(e.target.checked)} className="rounded text-pink-500 focus:ring-0" /><span>Nusbio2 USB Device</span></label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={nusbio1Lcd} onChange={(e) => { setNusbio1Lcd(e.target.checked); }} className="rounded text-pink-500 focus:ring-0" /><span>Nusbio1 LCD</span></label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={analog} onChange={(e) => setAnalog(e.target.checked)} className="rounded text-pink-500 focus:ring-0" /><span>Analog PCBs</span></label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={arduino} onChange={(e) => setArduino(e.target.checked)} className="rounded text-pink-500 focus:ring-0" /><span>Arduino and MCUs</span></label>

              <br />

              <div className={MarkDownClassName}>
                {markdownInfos.map((markdown, index) => (
                  <Markdown key={index} >{markdown}</Markdown>
                ))}
              </div>

            </div>
          </div>

          {(!photoId) && images.map(({ id, public_id, format, blurDataUrl }) => (
            <Link key={id} href={`/?photoId=${id}`} as={`/p/${id}`}
              onClick={() => { console.log(`onClick ${JSON.stringify(images[id])}`); }}
              ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
              shallow className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
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
        Hardware photos by Frederic Torres
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
  console.log(`process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME} `);
  console.log(`process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ${process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY} `);

  const results = await cloudinary.v2.search
    .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
    .sort_by("public_id", "desc")
    .max_results(400)
    .execute();

  if (results.resources.length == 0) {
    console.error(`No results found for folder ${process.env.CLOUDINARY_FOLDER}`);
  }

  console.log(`results ${results.resources.length}`);

  let reducedResults: ImageProps[] = [];
  let i = 0;
  for (let result of results.resources) {

    //console.log(`result ${result.public_id} ${JSON.stringify(result)}`);
    try {
      if (result.height) {
        reducedResults.push({ id: i, height: result.height, width: result.width, public_id: result.public_id, format: result.format, parentFolder: result.asset_folder, aspect_ratio: result.aspect_ratio });
      }
    }
    catch (error) {
      console.log(`error ${error}`);
      console.log(`result ${result.public_id} ${JSON.stringify(result)}`);
    }

    i++;
  }

  console.log(`reducedResults ${reducedResults.length}`);

  // const blurImagePromises = results.resources.map((image: ImageProps) => {
  //   return getBase64ImageUrl(image);
  // });
  // const imagesWithBlurDataUrls = await Promise.all(blurImagePromises);
  // for (let i = 0; i < reducedResults.length; i++) {
  //   reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i];
  // }

  // only blur the first image
  let blurImagePromises = results.resources.map((image: ImageProps) => {
    return getBase64ImageUrl(image);
  });
  blurImagePromises = blurImagePromises.splice(0, 1);
  const imagesWithBlurDataUrls = await Promise.all(blurImagePromises);
  for (let i = 0; i < reducedResults.length; i++) {
    reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[0];
  }

  console.log(`*************************************`);

  __reducedResults = reducedResults;

  return { props: { images: reducedResults, counter: 1234 }, revalidate: 5 * 60 };
}

