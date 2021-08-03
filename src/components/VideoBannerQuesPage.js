import React from "react";

const VideoBannerQuesPage = (props) => {
  openContent(
    props.url,
    props.title,
    props.fileType,
    props.service_id,
    props.contentData,
    props.category
    // serviceName
  );
  const openContent = (
    url,
    title,
    fileType,
    service_id,
    contentData,
    category
  ) => {
    history.push("/nucleus", {
      url: props.url,
      boardId: props.selected_board,
      chapterId: props.chapterId,
      title: props.title,
      selectedTab: "learn",
    });
  };
  return <div>VIDEO BANNER</div>;
};

export default VideoBannerQuesPage;
