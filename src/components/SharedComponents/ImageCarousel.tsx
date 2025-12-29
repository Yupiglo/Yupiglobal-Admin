"use client";

import React from "react";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";

// Import styles (necessary for carousel)
import "react-responsive-carousel/lib/styles/carousel.min.css";

const imageList = [ "form_background.svg"];

const ImageCarousel: React.FC = () => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Carousel
        showThumbs={false} // Hide thumbnails
        autoPlay={true} // Auto-slide
        infiniteLoop={true} // Loop slides
        showStatus={false} // Hide status indicator
        showArrows={false} // Hide left/right arrows
        showIndicators={true} // Show bottom dots
        interval={3000} // Slide change interval (3s)
        transitionTime={600} // Slide transition duration
        className="rounded-lg bg-transparent"
      >
        {/* Dynamically loop through images */}
        {imageList.map((image) => (
          <div key={image}> {/* Using image name as key instead of index */}
            <Image
              src={`/${image}`} // Image path from public/
              alt={`Slide ${image}`}
              width={600}
              height={400}
              priority
              className="w-full h-[400px] object-contain rounded-lg"
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ImageCarousel;