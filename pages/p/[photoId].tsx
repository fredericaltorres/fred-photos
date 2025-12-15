import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Carousel from "../../components/Carousel";
import getResults from "../../utils/cachedImages";
import cloudinary from "../../utils/cloudinary";
import getBase64ImageUrl from "../../utils/generateBlurPlaceholder";
import type { ImageProps } from "../../utils/types";

const Home: NextPage = ({ currentPhoto }: { currentPhoto: ImageProps }) => {

  const router = useRouter();
  const { photoId } = router.query;
  let index = Number(photoId);

  if (!currentPhoto) {
    console.error(`[photoId]currentPhoto is not defined`);
    return <div>Photo not found</div>;
  }

  const currentPhotoUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_2560/${currentPhoto.public_id}.${currentPhoto.format}`;

  console.log(`currentPhotoUrl ${currentPhotoUrl}`);

  return (
    <>
      <Head>
        {/* <title>Next.js Conf 2022 Photos</title> */}
        <meta property="og:image" content={currentPhotoUrl} />
        {/* <meta name="twitter:image" content={currentPhotoUrl} /> */}
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        <Carousel currentPhoto={currentPhoto} index={index} />
      </main>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async (context) => {

  console.log(`[[photoId].tsx]getStaticProps]START`);
  const results = await getResults();
  console.log(`[[photoId].tsx]getStaticProps]results ${results.resources.length}`);

  let reducedResults: ImageProps[] = [];
  let i = 0;
  for (let result of results.resources) {
    if (result.height && result.public_id) { // bad image
      reducedResults.push({ id: i, height: result.height, width: result.width, public_id: result.public_id, format: result.format });
    }
    i++;
  }
  const currentPhoto = reducedResults.find((img) => img.id === Number(context.params.photoId));
  currentPhoto.blurDataUrl = await getBase64ImageUrl(currentPhoto);

  console.log(`[[photoId].tsx]getStaticProps]END`);

  return { props: { currentPhoto: currentPhoto } };
};

export async function getStaticPaths() {

  console.log(`[[photoId].tsx]getStaticPaths]START`);
  const results = await cloudinary.v2.search
    .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
    .sort_by("public_id", "desc")
    .max_results(400)
    .execute();

  let fullPaths = [];
  for (let i = 0; i < results.resources.length; i++) {
    fullPaths.push({ params: { photoId: i.toString() } });
  }

  console.log(`[[photoId].tsx]getStaticPaths]END`);

  return { paths: fullPaths, fallback: false };
}
