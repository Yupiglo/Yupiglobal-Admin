/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface LoaderProps {
  isOpen?: any;
}


/**  Component to show loader between page mounts */
const Loading: React.FC<LoaderProps> = ({isOpen}) => {
  if (!isOpen) return null;
  return (
    // <div className="fixed inset-0 bg-transparent flex justify-center items-center z-50">
    //   <div className="flex flex-row gap-2">
    //     <div className="w-4 h-4 rounded-full bg-green-700 animate-bounce"></div>
    //     <div className="w-4 h-4 rounded-full bg-green-700 animate-bounce [animation-delay:-.3s]"></div>
    //     <div className="w-4 h-4 rounded-full bg-green-700 animate-bounce [animation-delay:-.5s]"></div>
    //   </div>
    // </div>
    <div className="fixed inset-0 flex justify-center items-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-green-500"></div>
    </div>
  );
};

export default Loading;
