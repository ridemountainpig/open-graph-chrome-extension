import { useEffect, useState } from "react";
import { Image as LucideImage } from "lucide-react";
import { OpenGraph } from "../type";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface OGImageProps {
  OpenGraph: OpenGraph;
}

export const OGImage = ({ OpenGraph }: OGImageProps) => {
  const [imgLoadState, setImgLoadState] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (OpenGraph.og.image != "none" || OpenGraph.twitter.image != "none") {
      const img = new Image();
      img.src = OpenGraph.og.image || OpenGraph.twitter.image;
      img.onload = () => {
        setImageLoaded(true);
      };
    }
  }, [OpenGraph.og.image, OpenGraph.twitter.image]);

  return (
    <>
      {(OpenGraph.og.image != "none" || OpenGraph.twitter.image != "none") &&
      imgLoadState ? (
        imageLoaded ? (
          OpenGraph.og.image ? (
            <img
              src={OpenGraph.og.image}
              alt={OpenGraph.title + " image"}
              className="rounded-xl"
              onError={() => {
                setImgLoadState(false);
              }}
            />
          ) : (
            <img
              src={OpenGraph.twitter.image}
              alt={OpenGraph.title + " image"}
              className="rounded-xl"
              onError={() => {
                setImgLoadState(false);
              }}
            />
          )
        ) : (
          <div className="rounded-xl overflow-hidden w-full h-1/2 -mt-0.5">
            <Skeleton
              width="100%"
              height="100%"
              baseColor="#e5ecf7"
              highlightColor="#edf3fa"
            />
          </div>
        )
      ) : (
        <div className="w-full h-[50%] flex justify-center items-center">
          <div>
            <div className="w-full flex justify-center">
              <LucideImage size={64} color="#000000" />
            </div>
            <div className="w-full flex justify-center">
              <div className="font-monofont-sans text-xs font-medium tracking-wider text-black w-fit mt-2 p-3 rounded-xl bg-zumthor-400 opacity-60">
                {imgLoadState == false ? "Failed to load image" : "No Image"}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
