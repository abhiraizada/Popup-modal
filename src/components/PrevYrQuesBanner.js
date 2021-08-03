import React, { memo, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Button } from "react-bootstrap";
// import PrevYrQuesImg from "../assets/prevYrQuesBanner.png";
import img from "./R.png";

import code from "./code.mp4";
// import "./prevYrQuesBanner.css";
const PrevYrQuesBanner = (props) => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 1, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };
  const [playVideo, setPlayVideo] = useState(false);
  return (
    <div className="prevYrQuesBanner m20">
      <Carousel
        responsive={responsive}
        partialVisible={true}
        containerClass="carousel-container"
        responsive={responsive}
        arrows={true}
        swipeable
        showDots={false}
      >
        <div>
          {!playVideo ? (
            <img src={img} width="100" height="100" />
          ) : (
            <video
              src={code}
              width="100%"
              height="100%"
              controls="controls"
              autoPlay
              // poster={`${API_BASE_URL}/uploads/staticvideo/wion-news.jpg`}
            />
          )}
          <div className="prevYrTxt clrwhite m10">
            {/* <div className="prevYrHeading font20 font-semibold">Previous Year Questions</div>
            <div> */}
            {!playVideo ? (
              <Button
                className="exploreBtn font-semibold"
                onClick={() => setPlayVideo(true)}
              >
                Explore
              </Button>
            ) : (
              <Button className="exploreBtn font-semibold blurTxt" disabled>
                Explore
              </Button>
            )}
            {/* </div> */}
          </div>
        </div>
        <div>item1</div>
        {!playVideo ? (
          <img src={img} width="100" height="100" />
        ) : (
          <video
            src={code}
            width="100%"
            height="100%"
            controls="controls"
            autoPlay
            // poster={`${API_BASE_URL}/uploads/staticvideo/wion-news.jpg`}
          />
        )}
        <div className="prevYrTxt clrwhite m10">
          {/* <div className="prevYrHeading font20 font-semibold">Previous Year Questions</div>
            <div> */}
          {!playVideo ? (
            <Button
              className="exploreBtn font-semibold"
              onClick={() => setPlayVideo(true)}
            >
              Explore
            </Button>
          ) : (
            <Button className="exploreBtn font-semibold blurTxt" disabled>
              Explore
            </Button>
          )}
          {/* </div> */}
        </div>
      </Carousel>
    </div>
  );
};
export default memo(PrevYrQuesBanner);
