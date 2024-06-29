import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { parseOpenGraph } from "./open-graph";
import "./popup.css";
import { OpenGraph } from "./type";
import { ArrowRight, LoaderCircle, MoveLeft, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { TitleContent } from "./components/title-content";
import { TitleLink } from "./components/title-link";
import { SplitLine } from "./components/split-line";
import { OGImage } from "./components/og-image";

const Popup = () => {
  const [url, setUrl] = useState("");
  const [OpenGraph, setOpenGraph] = useState({} as OpenGraph);
  const [loading, setLoading] = useState(false);

  const getCurrentTabUrl = async () => {
    chrome.runtime.sendMessage({ type: "getCurrentTabUrl" }, (response) => {
      setUrl(response);
    });
  };

  async function getLocalUrlOG(url: string): Promise<OpenGraph | null> {
    const fetchRes = await fetch(url);
    if (!fetchRes.ok) return null;

    const html = await fetchRes.text();
    return parseOpenGraph(html);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleBackButtonClick = () => {
    setOpenGraph({} as OpenGraph);
  };

  const handleButtonClick = async () => {
    if (loading) {
      return;
    }

    if (url === "") {
      toast.error("Please Enter URL");
      return;
    }

    setLoading(true);

    const fullUrl =
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `https://${url}`;

    let localState = false;
    let resSuccess = false;

    const parsedUrl = new URL(fullUrl);
    const hostname = parsedUrl.hostname;

    if (hostname === "localhost" || hostname === "127.0.0.1") localState = true;

    const imageUrl = (url: string) => {
      const img = url;
      if (img === null || img.startsWith("http")) return img;
      if (!img.startsWith("/")) return new URL(img, fullUrl).toString();
      const domain = new URL(fullUrl).origin;
      return `${domain}${img}`;
    };

    try {
      if (localState) {
        const og = await getLocalUrlOG(fullUrl);
        if (og) {
          if (og.og.image != "none") {
            og.og.image = imageUrl(og.og.image);
          }
          if (og.twitter.image != "none") {
            og.twitter.image = imageUrl(og.twitter.image);
          }
          setOpenGraph(og);
          resSuccess = true;
        }
      } else {
        const res = await fetch(`https://og-api.zeabur.app/url?url=${fullUrl}`);
        if (res.ok) {
          const text = await res.text();
          if (text == "") {
            toast.error(`Invalid URL\nCheck the URL and try again`);
            setOpenGraph({} as OpenGraph);
          }
          const openGraph = parseOpenGraph(text);
          if (openGraph.og.image != "none") {
            openGraph.og.image = imageUrl(openGraph.og.image);
          }
          if (openGraph.twitter.image != "none") {
            openGraph.twitter.image = imageUrl(openGraph.twitter.image);
          }
          setOpenGraph(openGraph);
          resSuccess = true;
        }
      }

      if (!resSuccess) {
        toast.error(
          `Can't get open graph information\nPlease check the url and try again.`
        );
        setOpenGraph({} as OpenGraph);
      }
      setLoading(false);
    } catch (error) {
      toast.error(
        "Can't get open graph information\nPlease check the url and try again."
      );
      setOpenGraph({} as OpenGraph);
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center bg-gradient-to-br from-water-leaf-300 via-polo-blue-600 to-chetwode-blue-500"
      style={{ width: "500px", height: "400px" }}
    >
      <Toaster position="top-center" reverseOrder={false} />
      <div className="h-[calc(100%-1rem)] w-[calc(100%-1rem)] overflow-hidden p-1 rounded-xl bg-zumthor-50 opacity-85">
        {!OpenGraph.title ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-fit w-full">
              <div className="flex w-full justify-center py-6">
                <h1 className="font-monofont-sans text-[2rem] font-semibold tracking-widest text-dove-gray-600">
                  Open Graph
                </h1>
              </div>
              <div className="flex w-full justify-center py-6">
                <img
                  src="open-graph-icon.png"
                  alt="open graph icon"
                  width="64"
                  height="64"
                />
              </div>
              <div className="relative flex w-full justify-center items-center pt-6">
                <input
                  type="text"
                  placeholder="URL"
                  className="h-14 w-[75%] rounded-2xl bg-zumthor-400 text-center font-sans font-semibold tracking-wider text-dove-gray-600 focus:border-zumthor-600/50 focus: outline-none focus:ring-0 border-zumthor-400 border-[1.5px]"
                  value={url}
                  onChange={handleInputChange}
                />
                {url === "" ? (
                  <div className="absolute right-[4.5rem]">
                    <button
                      className="rounded-lg bg-zumthor-400 hover:bg-zumthor-300 text-center text-3xs font-sans font-semibold tracking-wider text-dove-gray-400 px-2 py-1 border-zumthor-600/50 border-[1.5px]"
                      onClick={getCurrentTabUrl}
                    >
                      Current Tab
                    </button>
                  </div>
                ) : (
                  <div className="absolute right-[4.5rem]">
                    <button
                      className="rounded-lg bg-zumthor-400 hover:bg-zumthor-300 text-dove-gray-400 p-1 border-zumthor-600/50 border-[1.5px]"
                      onClick={() => setUrl("")}
                    >
                      <X size={10} strokeWidth={2} />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex w-full justify-center pb-6 pt-4">
                <button
                  className="flex h-14 w-20 items-center justify-center rounded-2xl bg-zumthor-400"
                  onClick={handleButtonClick}
                >
                  {loading ? (
                    <div className="animate-spin">
                      <LoaderCircle color="#665c5c" />
                    </div>
                  ) : (
                    <ArrowRight color="#665c5c" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center relative">
            <div className="absolute top-2 left-2">
              <button
                className="p-3 rounded-xl bg-zumthor-400 opacity-60 hover:opacity-80"
                onClick={handleBackButtonClick}
              >
                <MoveLeft size={18} strokeWidth={2.25} />
              </button>
            </div>
            <div className="grid grid-cols-5 h-full w-full">
              <div className="col-span-3 h-full overflow-y-auto p-2">
                <OGImage OpenGraph={OpenGraph} />
                <div className="font-monofont-sans text-base font-semibold tracking-wider text-text-black mt-2 p-3 rounded-xl bg-zumthor-400 bg-opacity-60">
                  {OpenGraph.title}
                </div>
                <div className="font-monofont-sans text-xs font-medium tracking-wider text-text-black mt-2 p-3 rounded-xl bg-zumthor-400 bg-opacity-60">
                  {OpenGraph.description
                    ? OpenGraph.description
                    : "No Description"}
                </div>
              </div>
              <div className="col-span-2 w-full h-full overflow-y-auto rounded-xl p-2">
                <TitleContent title="title" content={OpenGraph.title} />
                <TitleContent
                  title="description"
                  content={OpenGraph.description}
                />
                <SplitLine />
                <TitleContent title="og:title" content={OpenGraph.og.title} />
                <TitleContent
                  title="og:description"
                  content={OpenGraph.og.description}
                />
                <TitleLink title="og:image" link={OpenGraph.og.image} />
                <TitleLink title="og:url" link={OpenGraph.og.url} />
                <SplitLine />
                <TitleContent
                  title="twitter:title"
                  content={OpenGraph.twitter.title}
                />
                <TitleContent
                  title="twitter:description"
                  content={OpenGraph.twitter.description}
                />
                <TitleContent
                  title="twitter:card"
                  content={OpenGraph.twitter.card}
                />
                <TitleLink
                  title="twitter:image"
                  link={OpenGraph.twitter.image}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
