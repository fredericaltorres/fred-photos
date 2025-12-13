import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* <link rel="icon" href="/favicon.ico" />
          <meta name="description" content="Frederic Torres's pictures" />
          <meta property="og:site_name" content="" />
          <meta property="og:description" content="Frederic Torres's pictures" />
          <meta property="og:title" content="Frederic Torres's pictures" /> */}
        </Head>
        <body className="bg-black antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
