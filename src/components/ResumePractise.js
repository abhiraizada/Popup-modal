import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ResumePractiseTest from "./ResumePractiseTest";
import "./ResumePractise.css";

const ResumePractise = (props) => {
  const contentMsaApi = () => {
    const res = {
      status: "success",
      action: "get_content_list_by_state",
      api_status: 1,
      api_message: "invalid request params",
      response_code: "0|1",
      total_bookmarked_videos: "43",
      message: "",
      contents: [
        {
          container_id: "3291",
          service_id: "1311",
          total_consumption_time: "0:00:27",
          total_media_time: "0:12:27",
          content_id: "2170712",
          start_time: "2021-07-09 16:45",
          end_time: "2021-07-09 17:45",
          group_name: "Learn",
          group_id: "83",
        },
      ],
    };
  };

  const response = {
    status: 1,
    response_code: 10001,
    message: "success",
    total_bookmarked_questions: "43",

    content_list: [
      {
        content_id: "23022023",
        content_title: "Integration",

        service_id: "1311",
        service_name: "Q&A",
        container_id: "3291",
        max_marks: "50",
        total_time_mins: "30",
        total_questions: "40",
        "subject_id ": "2121",
        "subject_name ": "Physics",
      },
      {
        content_id: "23022023",
        content_title: "Integration",

        service_id: "1311",
        service_name: "Q&A",
        container_id: "3291",
        max_marks: "50",
        total_time_mins: "30",
        total_questions: "40",
        subject_id: "2121",
      },
      {
        content_id: "23022023",
        content_title: "Integration",

        service_id: "1311",
        service_name: "Q&A",
        container_id: "3291",
        max_marks: "50",
        total_time_mins: "30",
        total_questions: "40",
        subject_id: "2121",
      },
    ],
  };

  const { content_list } = response;

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
      //   partialVisibilityGutter: 70,
    },
  };

  const autofetch = (currentSlide, slidesToShow, totalItems) => {};
  return (
    <div className="resume-practise text-left">
      <h3>Resume</h3>
      <p>Lorem Lorem Lorem Lorem Lorem Lorem Lorem</p>
      <Carousel
        responsive={responsive}
        partialVisible={true}
        containerClass="carousel-container"
        responsive={responsive}
        arrows={true}
        swipeable
        showDots={false}
        afterChange={(
          previousSlide,
          { currentSlide, slidesToShow, totalItems }
        ) => {
          console.log(currentSlide, slidesToShow, totalItems);
          autofetch(currentSlide, slidesToShow, totalItems);
        }}
      >
        {content_list.map((practiseTestDetails) => (
          <ResumePractiseTest data={practiseTestDetails} />
        ))}
      </Carousel>
      {/* <Carousel
        responsive={responsive}
        partialVisible={true}
        containerClass="carousel-container"
        responsive={responsive}
        arrows={true}
        swipeable
      >
        <div className="test">item1</div>
        <div className="test">item2</div>
        <div className="test">item3</div>
        <div className="test">item4</div>
      </Carousel> */}
    </div>
  );
};

export default ResumePractise;
