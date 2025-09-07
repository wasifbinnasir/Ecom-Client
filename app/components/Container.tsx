// components/Container.tsx
import React, { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

const Container: React.FC<ContainerProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`w-full mx-auto max-w-[1440px] ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
