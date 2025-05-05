import React from "react";

interface IconProps {
  svg: string; 
  scale?: number; 
  className?: string; 
  styleSvg?:string;
}

const Icon: React.FC<IconProps> = ({ svg, scale = 110, className = "" , styleSvg ="w-6 w-6"}) => {
  return (
    <div
      className={`transition-transform duration-300 ease-in-out transform hover:scale-${scale} ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className={`${styleSvg}`}
        dangerouslySetInnerHTML={{ __html: svg }}
      ></svg>
    </div>
  );
};

export default Icon;
