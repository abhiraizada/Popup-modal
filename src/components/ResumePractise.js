import React, { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ResumePractiseTest from "./ResumePractiseTest";
import "./ResumePractise.css";
import ResumeContent from "./ResumeContent";

const ResumePractise = (props) => {
  // let [sectionData, setSectionData] = useState([]);
  let [contentMsaIds, setContentMsaIds] = useState([]);
  let [contentMsaData, setContentMsaData] = useState([]);
  let [testMsaData, setTestMsaData] = useState([]);
  let [loader, setLoader] = useState(false);
  let [startIndex, setStartIndex] = useState(0);
  let [endIndex, setEndIndex] = useState(4);

  let paginationCount = 5;
  //   useEffect(() => {
  //     getContentMsaContentIds(startIndex, endIndex);
  //     getTestMsaData(startIndex, endIndex);
  //   }, []);

  //   const autofetch = (currentSlide, slidesToShow, totalItems) => {
  //     console.log(currentSlide, slidesToShow, totalItems, startIndex, endIndex);
  //     let endI = totalItems - slidesToShow;
  //     console.log(endI);
  //     if (currentSlide == endI  ) {
  //       console.log(currentSlide);
  //       let strtInd = startIndex + paginationCount;
  //       let endInd = endIndex + paginationCount;
  //       setLoader(true);
  // if(contentMsaDataFromIds.length < paginationCount){

  //   //       getContentMsaContentIds(strtInd+paginationCount, endInd+paginationCount);
  // }
  // if(testMsaData.length < paginationCount){
  //   //       getTestMsaData(strtInd+ paginationCount, endInd + paginationCount);
  // }
  //       setStartIndex(strtInd);
  //       setEndIndex(endInd);
  //       //     let newArr = sectionData.concat(sampleResponse.rece.questions)
  //       // setSectionData(newArr)
  //     }
  //   };

  //   const getContentMsaContentIds = (strtInd, endInd) => {
  //     console.log(strtInd, endInd);
  //     let url = `get_content_list_by_state`;
  //     let startIndex = strtInd;
  //     let endIndex = endInd;
  //     let questionUsed = "";
  //     let difficulty = "";
  //     let action = "get_dashboard_category_questions";
  //     let checksum = md5(
  //       `${studentID}:${studentType}:${boardID}:${classID}:${paperType}:${containerID}:${SALT_STAGE}:${API_KEY_STAGE}`.toUpperCase()
  //     );
  //     let formData = {
  //       student_id: studentID,
  //       student_type: studentType,
  //       board_id: boardID,
  //       class_id: classID,
  //       container_id: containerID,
  //       container_type: containerType,
  //       paper_type: paperType,
  //       start_index: startIndex.toString(),
  //       end_index: endIndex.toString(),
  //       question_used: questionUsed,
  //       difficulty: difficulty,
  //       action: action,
  //       checksum: checksum,
  //     };

  //     axios
  //       .post(url, formData)
  //       .then((res) => {
  //         console.log(res);
  //         if (
  //           res.data.status == "1" &&
  //           res.data.contents &&
  //           res.data.contents.length
  //         ) {
  // let contentIdsArr = res.data.contents
  // setContentMsaIds(contentIdsArr)

  //           let newArr = sectionData.concat(res.data.questions);
  //           setSectionData(newArr);
  //         }
  //         setLoader(false);
  //       })
  //       .catch((err) => console.log(err));
  //   };

  //Api 2nd Call for fetching content msa details from ids got from ist api call

  // let formdata2 = {
  //   // REst of the params
  // contentIdsArr: contentMsaIds
  // }
  // axios.post('getcontent_details_by_content_ids_content',{formdata2})
  // .then((res) => {
  //         console.log(res);
  //           let contentMsaDataFromIds = res.content_detail
  //           setContentMsaData(contentMsaDataFromIds)
  // );
  // .catch((err) => console.log(err))

  //Api Call for fetching Test Msa Data

  // const getTestMsaData = (strtInd, endInd) => {
  //     console.log(strtInd, endInd);
  //     let url = `get_content_list_by_state`;
  //     let startIndex = strtInd;
  //     let endIndex = endInd;
  //     let questionUsed = "";
  //     let difficulty = "";
  //     let action = "get_dashboard_category_questions";
  //     let checksum = md5(
  //       `${studentID}:${studentType}:${boardID}:${classID}:${paperType}:${containerID}:${SALT_STAGE}:${API_KEY_STAGE}`.toUpperCase()
  //     );
  //     let formData = {
  //       student_id: studentID,
  //       student_type: studentType,
  //       board_id: boardID,
  //       class_id: classID,
  //       container_id: containerID,
  //       container_type: containerType,
  //       paper_type: paperType,
  //       start_index: startIndex.toString(),
  //       end_index: endIndex.toString(),
  //       question_used: questionUsed,
  //       difficulty: difficulty,
  //       action: action,
  //       checksum: checksum,
  //     };
  // let formdata3 = {};

  //     axios
  //       .post('get_resume_list_by_service_group', formdata3)
  //       .then((res) => {
  //         console.log(res);
  //         if (
  //           res.data.status == "1" &&
  //           res.data.content_list &&
  //           res.data.content_list.length
  //         ) {
  // let testMsaData = res.data.content_list
  // setTestMsaData(testMsaData)

  //         }
  //         setLoader(false);
  //       })
  //       .catch((err) => console.log(err));
  //   };

  const getContentIdsRes = {
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
      {
        container_id: "3291",
        service_id: "1311",
        total_consumption_time: "0:00:27",
        total_media_time: "0:12:27",
        content_id: "2170713",
        start_time: "2021-07-09 16:45",
        end_time: "2021-07-09 17:45",
        group_name: "Learn",
        group_id: "83",
      },
    ],
  };
  console.log(
    "content ids len ,",
    getContentIdsRes.contents,
    getContentIdsRes.contents.length
  );

  const getContentDetailsFromIds = {
    status: 1,
    response_code: 10001,
    message: "success",
    action: "content_msa",
    current_date: "747324792743274092",
    week_start_date: "2021-07-11 16:40",
    week_end_date: "2021-07-19 16:40",
    total_learning_time_mins: "7328",
    content_detail: [
      {
        service_group_name: "Learn",
        service_id: "311XX",
        service_name: "Concept Learning",
        content_id: "323232",
        subject_id: "211",
        subject_name: "Math",
        chapter_id: "32",
        chapter_name: "Thermodynamics",
        content_thumb: "cdn.extramarks.com/232/322.png",
        type: "html|video|pdf",
        path: "cdn.extramarks.com/232/322.mp4",
      },
      {
        service_group_name: "Learn",
        service_id: "311XX",
        service_name: "Recorded Classes",
        access_time: "3230820382022",
        total_duration_mins: "322",
        content_id: "323232",
        subject_id: "211",
        subject_name: "Math",
        chapter_id: "32",
        chapter_name: "Thermodynamics",
        content_thumb: "cdn.extramarks.com/232/322.png",
        type: "html|video|pdf",
        path: "cdn.extramarks.com/232/322.mp4",
      },
      {
        service_group_name: "Practice",
        service_id: "311XX",
        service_name: "Hots",
        access_time: "3230820382022",
        total_duration_mins: "322",
        content_id: "323232",
        subject_id: "211",
        subject_name: "Math",
        chapter_id: "32",
        chapter_name: "Thermodynamics",
        content_thumb: "cdn.extramarks.com/232/322.png",
        type: "html",
        path: "cdn.extramarks.com/232/322.html",
      },
    ],
  };
  console.log(
    "content id details data",
    getContentDetailsFromIds.content_detail.length
  );
  const contentMsaApi = () => {};
  contentMsaApi();

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
      partialVisibilityGutter: 70,
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
        {content_list.map((practiseTestDetails) => (
          <ResumeContent data={practiseTestDetails} />
        ))}
        {/* <div className="test">item1</div>
        <div className="test">item2</div>
        <div className="test">item3</div> */}
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
