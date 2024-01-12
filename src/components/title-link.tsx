import React from "react";
import { MoveUpRight } from "lucide-react";

type MyComponentProps = {
  title: string;
  link: string;
};

export const TitleLink: React.FC<MyComponentProps> = ({ title, link }) => {
  return (
    <div>
      <div className="font-monofont-sans text-xs font-bold tracking-wider text-text-black p-1">
        {title}
      </div>
      {link != "none" ? (
        <a href={link} target="_blank">
          <div className="h-full flex items-center">
            <div className="font-monofont-sans text-xs font-medium tracking-wider text-text-black p-1 truncate opacity-80">
              {link}
            </div>
            <div className="text-text-black opacity-80">
              <MoveUpRight size={16} />
            </div>
          </div>
        </a>
      ) : (
        <div className="font-monofont-sans text-xs font-medium tracking-wider text-text-black p-1 truncate opacity-80">
          {link}
        </div>
      )}
    </div>
  );
};
