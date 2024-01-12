import React from "react";

type MyComponentProps = {
  title: string;
  content: string;
};

export const TitleContent: React.FC<MyComponentProps> = ({
  title,
  content,
}) => {
  return (
    <div>
      <div className="font-monofont-sans text-xs font-bold tracking-wider text-text-black p-1">
        {title}
      </div>
      <div className="font-monofont-sans text-xs font-medium tracking-wider text-text-black p-1 truncate opacity-80">
        {content}
      </div>
    </div>
  );
};
