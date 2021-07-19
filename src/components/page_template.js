import "App.css";
import Axios from "axios";
import {
  AdaptiveSalt,
  API_KEY_EMSCC_DASHBOARD,
  ASSESSEMENT_API_BASE_URL,
  IRTBaseUrl,
  IRTDomainBaseUrl,
  SALT_EMSCC_DASHBOARD,
  Student_type,
} from "constants/appConstats";
import DOMPurify from "dompurify";
import Md5 from "md5";
import moment from "moment";
import { default as React, lazy, useEffect, useState } from "react";
import { Accordion, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useParams } from "react-router";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import io from "socket.io-client";
import { addingImgUrl, serverUrl } from "utils/Utilities";
import LazyLoadHoc from "utils/WrapperHoc";
import backIcon from "../../assets/dashboard/back-icon.png";
import webEmloader from "../../assets/images/website_v7/webEmloader.gif";
import Announcements from "./Announcements";
import ChatModal from "./ChatModal";
import DemoTutorial from "./DemoTutorial";
import InstructionModalComponent from "./InstructionModal";
import MarkedReview from "./MarkedReview";
import "./page_template.css";
import TestData from "./Questionanswer";
import QuestionNumberList from "./QuestionNumberList";
import QuestionStatusInfo from "./questionStatusInfo";
import QuestionTimer from "./QuestionTimer";
import TimeRemainView from "./TimeRemainView";
import Warnings from "./Warnings";
const EyseVisibilityPopup = LazyLoadHoc(
  lazy(() => import("./EyseVisibilityPopup"))
);
const TimeupPopUp = LazyLoadHoc(lazy(() => import("./TimeupPopUp")));
const LastModal = LazyLoadHoc(
  lazy(() => import("./DemoTutorialComponent/LastModal"))
);
const EyseEmatModalComp = lazy(() => import("./EyseEmatComplete"));

const EyseEmatComplete = LazyLoadHoc(EyseEmatModalComp);

var arrStatus = [];
var questionCount = 0;
var arrQuestionTime = [];
var myInterval = "";
var getTestData = "";
var questionText = [];
var optionText = [];
var isQuestionTimeBound = 2;
var isAdaptiveTest = 0;
var arrPerQuestionTimeBound = [];
var arrIsTimeup = [];
var isQuestimeUpHandle = true;
var arrQuestionId = [];
var paperNameHeader = "";
var testStart = false;
var paperDone = false;
var is_proctoring_enabled = 0;
var count = 0;
var optionLen = 0;
var mongoTestStatusResponse = {};
var arrAnnouncement = [];
var arrWarning = [];
var arrChat = [];
const socket = io("https://gtsstagelearning2.extramarks.com:5000/");

const questionStatus = {
  NotAttempted: "Not_Attempted",
  Attempted: "Attempted",
  MarkForReview: "MarkForReview",
  Skipped: "Skipped",
  AttemptedAndMarkedForReview: "Attempted_And_MarkedForReview",
  skipped: "Skip",
};

let QuesOptions = [];

const Template = (props) => {
  const sanitizer = DOMPurify.sanitize;

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  let testName = useQuery().get("test");
  if (testName == "demo") {
    localStorage.setItem("testStarted", 0);
  }
  let { paperName } = useParams();

  let history = useHistory();
  let location = useLocation();
  let reportData = location.state;
  const [teacherId, setTeacherId] = useState("");
  const [isProctoring, setIsProctoring] = useState(false);
  const [paragraphToggel, setParagraphToggel] = useState(false);
  const [paperSubmit, setPaperSubmit] = useState(false);
  const [demoTestModal, setDemoTestModal] = useState(false);
  const [arrAdaptiveData, setArrAdaptiveData] = useState([]);
  const [showLoader, setLoader] = useState(false);
  const [timerStop, setTimerStop] = useState(false);
  const [getQuestionApi, setQuestionApi] = useState(false);
  const [totalTestTime, setTotalTestTime] = useState(-1);
  const [totalRemainingTime, setTotalRemainingTime] = useState(0);
  const finalValues = React.useRef({});
  const [qTimer, setQtimer] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [quesTime, setQuesTime] = useState("");
  const [arrRightAnswer, setArrRightAnswer] = useState([]);
  const [changeDemoState, setDemoState] = useState(false);
  const [eyseEmatComplete, seteyseEmatComplete] = useState(false);
  const moveBack = () => {
    if (paperName == "eyse") {
      history.push("/student-dashboard");
      onClickBrowserBack();
    } else {
      history.goBack();
    }
  };

  useEffect(() => {
    let obj = { ...finalValues.current };
    obj.timeRemaining = totalRemainingTime;
    obj.currentIndexs = currentIndex;
    obj.qTimers = qTimer;
    obj.arrAdaptiveData = arrAdaptiveData;
    finalValues.current = obj;
  }, [totalRemainingTime, currentIndex, qTimer, arrAdaptiveData]);

  const setPaperNameHeader = () => {
    switch (paperName) {
      case "weekly":
        paperNameHeader = "National Weekly Test ";
        break;

      case "schoolAdaptive":
        paperNameHeader = "School Adaptive Test";
        break;

      case "foundation":
        paperNameHeader = "Weekly Test";
        break;
      case "instant":
        paperNameHeader = "Instant Test ";
        break;
      case "chapter":
        paperNameHeader = "Chapter Test ";
        break;
      case "homeWork":
        paperNameHeader = "Homework Test ";
        break;
      case "school":
        paperNameHeader = "Weekly Test";
        break;
      case "worksheet":
        paperNameHeader = "Worksheet Test ";
        break;
      case "gts":
        paperNameHeader = "Weekly Test";
        break;
      case "practice":
        paperNameHeader = "Practice Test";
        break;
      case "eyse":
        paperNameHeader = "Eyse Test";
        break;
      case "emat":
        paperNameHeader = "EMAT Test";
        break;
      default:
        paperNameHeader = paperName;
    }
  };
  const onEyseVisibilitychange = () => {
    showVisibilityPopup(true);
  };

  useEffect(() => {
    setLoader(true);
    setPaperNameHeader();

    testStart = false;
    paperDone = false;
    if (props.testData.is_ques_time_bound != "undefined") {
      isQuestionTimeBound = props.testData.is_ques_time_bound;
    }
    if (props.testData.isAdaptiveTest != "undefined") {
      isAdaptiveTest = props.testData.isAdaptiveTest;
    }

    if (
      props.testData &&
      props.testData.is_proctoring_enabled &&
      props.testData.is_proctoring_enabled != undefined
    ) {
      is_proctoring_enabled = props.testData.is_proctoring_enabled;
      console.log("is_proctoring_enabled ========", is_proctoring_enabled);

      arrAnnouncement.length = [];
      arrWarning.length = [];
      arrChat.length = [];
      if (is_proctoring_enabled == 1) {
        console.log("socket =========", socket);
        setIsProctoring(true);
        if (socket) {
          socket.on("connect", () => {
            console.log("socket connected =======", socket);
          });
          socket.on("connect_error", (data) => {
            console.log("socket error ====", data);
          });
          socket.on(`disconnect`, () => {
            console.log("socket disconnected =====");
          });

          socket.on("login_status", (data) => {
            let dataj = JSON.parse(data);
            arrAnnouncement = dataj.announcements;
            arrWarning = dataj.warnings;
            arrChat = dataj.chats;
            setTeacherId(dataj.teacher_id);
            console.log("socket data login_status =====", arrChat);
          });

          let assign_id = props.testData.assign_auto_id;

          if (assign_id === undefined) {
            assign_id = localStorage.getItem("assign_Id");
          }

          socket.on("reconnect", () => {
            console.log("reconnected=====");
            let reconnect = {
              user_id: props.loginData.isLoginUserData.content.user_id,
              assign_auto_id: assign_id,
              midlogin: true,
            };
            socket.emit("login", reconnect);
          });

          socket.emit("login", {
            user_id: props.loginData.isLoginUserData.content.user_id,
            assign_auto_id: assign_id,
          });
          socket.on("proctoring_announcement", (data) => {
            let dataj = JSON.parse(data);
            if (dataj.type == "announcement") {
              arrAnnouncement.push(dataj.warning);
            } else if (dataj.type == "warning") {
              arrWarning.push(dataj.warning);
            }
            console.log(
              "proctoring_announcement ====",
              dataj,
              dataj.warning,
              arrAnnouncement
            );
          });
          socket.on("announcement", (data) => {
            let dataj = JSON.parse(data);
            if (dataj.type == "warning") {
              arrWarning.push(dataj.warning);
            }
            console.log("announcement ====", dataj, arrWarning);
          });
          socket.on("user_log_status", (data) => {
            console.log("user_log_status ====", data);
          });

          socket.on("chat", (data) => {
            let dataj = JSON.parse(data);
            arrChat.push(dataj);
            console.log("chat ====", arrChat);
          });
          socket.on("stoptest", (data) => {
            console.log("stoptest ====", data);
          });

          console.log(
            "user_id,assign_id =========",
            props.loginData.isLoginUserData.content.user_id,
            assign_id
          );
        }
      }
    }

    if (testName == "demo" && paperName == "eyse") {
      hitDemoTest();
    } else if (paperName == "eyse" || paperName == "emat") {
      hitDemoTest(paperName);
    } else {
      if (
        paperName == "weekly" ||
        paperName == "foundation" ||
        paperName == "homeWork" ||
        paperName == "school" ||
        paperName == "worksheet" ||
        paperName == "gts" ||
        paperName == "schoolAdaptive" ||
        paperName == "chapter" ||
        paperName == "instant" ||
        paperName == "practice"
      ) {
        if (
          props.testData &&
          props.testData.is_subjective_type === undefined &&
          props.testData.assign_auto_id === undefined
        ) {
          props.testData.is_subjective_type =
            localStorage.getItem("is_subjective_type");
        }
        if (props.testData.is_subjective_type == 2) {
          getWeeklyTestStatus();
        } else {
          getTestStatus();
        }
      }
    }
    if (paperName == "eyse" && testName != "demo") {
      window.addEventListener("visibilitychange", onEyseVisibilitychange);
    }
    if (testName != "demo") {
      window.addEventListener("beforeunload", alertUser);
    }
    window.addEventListener("load", reloadData);
    return () => {
      questionText = [];

      optionText = [];
      setQuestionList({ QuestionData: [] });

      setOptionList({ OptionsData: [] });
      window.removeEventListener("visibilitychange", onEyseVisibilitychange);

      window.removeEventListener("beforeunload", alertUser);
      window.removeEventListener("load", reloadData);
    };
  }, []);

  const paperStatusUpate = () => {
    let assign_auto_id =
        paperName == "eyse" || paperName == "emat"
          ? getTestData.data.assign_auto_id
          : props.testData.assign_auto_id,
      user_id = props.loginData.isLoginUserData.content.user_id,
      url =
        ASSESSEMENT_API_BASE_URL +
        (paperName == "eyse" || paperName == "emat"
          ? `/api/v1.0/${paperName}-test`
          : "/api/v1.0/weeklyv2");

    const checksum = Md5(
      (
        assign_auto_id +
        ":" +
        user_id +
        ":" +
        Student_type +
        ":" +
        "update_attempt_status" +
        ":" +
        SALT_EMSCC_DASHBOARD +
        ":" +
        API_KEY_EMSCC_DASHBOARD
      ).toUpperCase()
    );
    const data = {
      action: "update_attempt_status",
      checksum: checksum,
      assign_auto_id: assign_auto_id,
      student_id: user_id,
      student_type: Student_type,
    };
    if (paperName == "eyse" || paperName == "emat") {
      data.app_name = "LearningApp";
    }
    console.log("resolve hjo", JSON.stringify(data), url);
    Axios.post(url, data)
      .then((response) => {})
      .catch(function (error) {});
  };

  const hitDemoTest = (paperType = "demo") => {
    let user_id = props.loginData.isLoginUserData.content.user_id;
    let paperTypeAction =
      paperType == "demo" ? 37 : paperType == "eyse" ? 22 : 39;
    let request = {
      user_id: user_id,
      //  "student_id": user_id,
      student_type: Student_type,
      checksum: "",
      course_flag: 0,
      paper_type: paperTypeAction,
      action:
        paperType == "demo" ? "demo_take_test_detail" : "take_test_detail",
      board_id: 180,
      class_id: 36,
    };
    //
    let checksumStr =
      request.user_id +
      ":" +
      request.student_type +
      ":" +
      request.board_id +
      ":" +
      request.class_id +
      ":" +
      request.action +
      ":" +
      request.paper_type +
      ":" +
      "EF6C40ECBA" +
      ":" +
      "8FF8508F917BCC12FFDCD";
    checksumStr = checksumStr.toUpperCase();
    let checksum = Md5(checksumStr);
    //
    request.checksum = checksum;
    //
    console.log(request);

    Axios({
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: ASSESSEMENT_API_BASE_URL + `/api/v1.0/${paperName}-test`,
      data: request,
    }).then(function (response) {
      getTestData = response;
      //
      setQuestionApi(true);
      setLoader(false);
      if (testName == "demo") {
        parseEyseEmat(getTestData.data);
      } else {
        getTestStatus(getTestData.data.assign_auto_id);
      }
    });
  };
  const parseEyseEmat = (qData) => {
    arrStatus.length = 0;
    QuestionList.QuestionData.length = 0;
    arrQuestionTime.length = 0;
    arrPerQuestionTimeBound.length = 0;
    arrIsTimeup.length = 0;
    let arrRightAnswerLocal = [];
    if (qData.paperJson != "" && qData.paperJson != "undefined") {
      let iterator = qData.paperJson.data;
      optionLen = 0;

      count = 0;

      for (let ques = 0; ques < iterator.length; ques++) {
        arrStatus[count] = questionStatus.NotAttempted;
        arrQuestionTime[count] = 0;
        questionText[count] = {};
        questionText[count]["quesId"] = {};
        questionText[count]["quesText"] = {};
        questionText[count]["questionmarks"] = {};
        questionText[count]["quesId"] = iterator[ques].questionData.questionId;
        arrQuestionId[count] = iterator[ques].questionData.questionId;
        questionText[count]["quesText"] = iterator[ques].questionData.question1;
        questionText[count]["quesText"] = addingImgUrl(
          serverUrl.AssementServer,
          questionText[ques]["quesText"]
        );
        // questionText[ques][
        //   "quesText"
        // ].replaceAll(`src="`, `src="${AssementImageBaseURL}`);
        questionText[count]["questionmarks"] =
          iterator[ques].questionData.questionMarks;

        if (isQuestionTimeBound == 1) {
          arrPerQuestionTimeBound[count] =
            iterator[ques].questionData.questionTime;
          arrIsTimeup[count] = false;
        }

        // OPTIONS PARSING

        optionLen = iterator[ques].optionData.options;

        optionText[count] = {};

        if (mongoTestStatusResponse.status == "1") {
          for (
            let i = 0;
            i < mongoTestStatusResponse.attempted_question_data.length;
            i++
          ) {
            if (
              questionText[count]["quesId"] ==
              mongoTestStatusResponse.attempted_question_data[i].question_id
            ) {
              questionText[count].questionAttemptedTime =
                mongoTestStatusResponse.attempted_question_data[
                  i
                ].attempt_time_sec;
              arrQuestionTime[count] =
                mongoTestStatusResponse.attempted_question_data[
                  i
                ].attempt_time_sec;
              questionText[count].questionStatus =
                mongoTestStatusResponse.attempted_question_data[
                  i
                ].question_status;
              arrStatus[count] =
                mongoTestStatusResponse.attempted_question_data[
                  i
                ].question_status;

              if (
                arrStatus[count] == questionStatus.Attempted ||
                arrStatus[count] == questionStatus.AttemptedAndMarkedForReview
              ) {
                questionText[count].attemptedOptionId =
                  mongoTestStatusResponse.attempted_question_data[i].option_id;

                questionText[count].answer = mongoTestStatusResponse
                  .attempted_question_data[i].answer_text
                  ? mongoTestStatusResponse.attempted_question_data[i]
                      .answer_text
                  : getAnswer(questionText[count].attemptedOptionId, optionLen);

                questionText[count].order = getAnswer(
                  questionText[count].attemptedOptionId,
                  optionLen,
                  true
                );
              }
            }
          }
        }

        for (let op = 0; op < optionLen.length; op++) {
          optionText[count][op] = {};
          optionText[count][op]["optionId"] = {};
          optionText[count][op]["optionText"] = {};
          optionText[count][op]["optionId"] = optionLen[op].optionId;
          optionText[count][op]["optionText"] = optionLen[op].optionText1;
          optionText[count][op]["optionText"] = addingImgUrl(
            serverUrl.AssementServer,
            optionText[count][op]["optionText"]
          );

          // optionText[count][op][
          //   "optionText"
          // ].replaceAll(`src="`, `src="${AssementImageBaseURL}`);
        }

        count = count + 1;
      }

      setQuestionList({ QuestionData: questionText });
      questionCount = count;

      // totalTestTime = qData.paperJson.timeDuration * 60;
      // totalRemainingTime = qData.paperJson.timeDuration * 60;

      if (mongoTestStatusResponse.status == "1") {
        setTime();
      } else {
        setTotalTestTime(qData.paperJson.timeDuration * 60);
        setTotalRemainingTime(qData.paperJson.timeDuration * 60);
      }
      //
      if (questionText.length == optionText.length) {
        //

        for (let index = 0; index < optionText.length; index++) {
          if (optionText[index][3]) {
            QuesOptions[index] = {
              order1: "A",
              option1: optionText[index][0].optionText,
              optionId1: optionText[index][0].optionId,
              order2: "B",
              option2: optionText[index][1].optionText,
              optionId2: optionText[index][1].optionId,
              order3: "C",
              option3: optionText[index][2].optionText,
              optionId3: optionText[index][2].optionId,
              order4: "D",
              option4: optionText[index][3].optionText,
              optionId4: optionText[index][3].optionId,
            };
          } else if (optionText[index][2]) {
            QuesOptions[index] = {
              order1: "A",
              option1: optionText[index][0].optionText,
              optionId1: optionText[index][0].optionId,
              order2: "B",
              option2: optionText[index][1].optionText,
              optionId2: optionText[index][1].optionId,
              order3: "C",
              option3: optionText[index][2].optionText,
              optionId3: optionText[index][2].optionId,
            };
          } else if (optionText[index][1]) {
            QuesOptions[index] = {
              order1: "A",
              option1: optionText[index][0].optionText,
              optionId1: optionText[index][0].optionId,
              order2: "B",
              option2: optionText[index][1].optionText,
              optionId2: optionText[index][1].optionId,
            };
          } else {
            QuesOptions[index] = {
              optionText: optionText[index][0].optionText,
              optionId: optionText[index][0].optionId,
              isSubjective: true,
            };
          }
        }
      } else {
      }
    }

    setQuestionApi(true);
  };
  const getQuestionData = () => {
    let assign_auto_id = props.testData.assign_auto_id,
      user_id = props.loginData.isLoginUserData.content.user_id;
    //"":

    let request = {};

    if (isAdaptiveTest == 1) {
      request = {
        assign_auto_id: assign_auto_id,
        student_id: user_id,
        student_type: Student_type,
        action: "take_test_detail",
        app_name: "Learning App School Adaptive Test",
        checksum: "",
      };
    } else {
      request = {
        assign_auto_id: assign_auto_id,
        student_id: user_id,
        student_type: Student_type,
        action: "take_test_detail",
        checksum: "",
      };
    }

    let checksumStr =
      request.assign_auto_id +
      ":" +
      request.student_id +
      ":" +
      request.student_type +
      ":" +
      request.action +
      ":" +
      "EF6C40ECBA" +
      ":" +
      "8FF8508F917BCC12FFDCD";
    checksumStr = checksumStr.toUpperCase();
    let checksum = Md5(checksumStr);

    request.checksum = checksum;

    Axios({
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: ASSESSEMENT_API_BASE_URL + "/api/v1.0/weeklyv2",
      data: request,
    }).then(function (response) {
      getTestData = response;
      console.log("========= getTestData ====", getTestData);

      setLoader(false);
      if (getTestData.data.is_ques_time_bound != "undefined") {
        isQuestionTimeBound = getTestData.data.is_ques_time_bound;
      }

      setQuestionApi(true);

      if (getTestData.data.status === "Test attempted") {
        onClickBack();
        return;
      }

      if (mongoTestStatusResponse && mongoTestStatusResponse.status == "1") {
        closeInstructionModal();
      } else {
        setInstructionModal(true);
      }
    });
  };
  const getWeeklyTestStatus = () => {
    let assign_auto_id = props.testData.assign_auto_id,
      user_id = props.loginData.isLoginUserData.content.user_id;

    if (assign_auto_id === undefined) {
      props.testData.assign_auto_id = localStorage.getItem("assign_Id");
      assign_auto_id = localStorage.getItem("assign_Id");

      props.testData.is_ques_time_bound =
        localStorage.getItem("is_ques_time_bound");
      isQuestionTimeBound = localStorage.getItem("is_ques_time_bound");

      props.testData.isAdaptiveTest = localStorage.getItem("isAdaptiveTest");
      isAdaptiveTest = localStorage.getItem("isAdaptiveTest");

      props.testData.is_subjective_type =
        localStorage.getItem("is_subjective_type");
    }

    let request = {
      assign_auto_id: assign_auto_id,
      // "assign_auto_id": 22703,
      // "user_id": 10655762,
      user_id: user_id,
      student_type: Student_type,
      action: "resume_subjective_paper",
      checksum: "",
    };
    let checksumStr =
      request.assign_auto_id +
      ":" +
      request.action +
      ":" +
      "EF6C40ECBA" +
      ":" +
      "8FF8508F917BCC12FFDCD";
    checksumStr = checksumStr.toUpperCase();
    let checksum = Md5(checksumStr);

    request.checksum = checksum;

    Axios({
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: ASSESSEMENT_API_BASE_URL + "/api/v1.0/weeklyv2",
      data: request,
    }).then(function (response) {
      mongoTestStatusResponse = response.data;
      console.log("mongoTestStatusResponse ======", mongoTestStatusResponse);
      setQuestionApi(true);
      getQuestionData();
    });
  };

  const getTestStatus = (assignId = "") => {
    let assign_auto_id =
        assignId == "" ? props.testData.assign_auto_id : assignId,
      user_id = props.loginData.isLoginUserData.content.user_id,
      url = "https://o2ml9cjy22.execute-api.ap-south-1.amazonaws.com/mongoEyse";

    if (assign_auto_id === undefined) {
      props.testData.assign_auto_id = localStorage.getItem("assign_Id");
      assign_auto_id = localStorage.getItem("assign_Id");

      props.testData.is_ques_time_bound =
        localStorage.getItem("is_ques_time_bound");
      isQuestionTimeBound = localStorage.getItem("is_ques_time_bound");

      props.testData.isAdaptiveTest = localStorage.getItem("isAdaptiveTest");
      isAdaptiveTest = localStorage.getItem("isAdaptiveTest");

      props.testData.is_subjective_type =
        localStorage.getItem("is_subjective_type");
    }
    const data = {
      action: "",
      checksum: "",
      assign_auto_id: assign_auto_id,
      user_id: user_id,
    };
    if (paperName == "emat") {
      data.action = "emat_get_question_status";
      url =
        "https://o2ml9cjy22.execute-api.ap-south-1.amazonaws.com/StageDev/mongoEyse";
      // "https://o2ml9cjy22.execute-api.ap-south-1.amazonaws.com/mongoEyse";
    } else if (paperName == "eyse") {
      url =
        "https://o2ml9cjy22.execute-api.ap-south-1.amazonaws.com/StageDev/mongoEyse";
      // "https://o2ml9cjy22.execute-api.ap-south-1.amazonaws.com/mongoEyse";

      data.action = "eyes_get_question_status";
    } else {
      data.action = "weeklytest_get_question_status";
    }
    data.checksum = Md5(data.action + ":" + user_id + ":" + assign_auto_id);
    console.log(JSON.stringify(data));
    Axios.post(url, data)
      .then((response) => {
        //

        mongoTestStatusResponse = response.data;
        // if (paperName != "eyse") {
        // }
        console.log(JSON.stringify(response.data));
        if (paperName == "emat" || paperName == "eyse") {
          setQuestionApi(true);

          if (getTestData.data.status === "Test attempted") {
            onClickBack();
            return;
          }

          if (
            mongoTestStatusResponse &&
            mongoTestStatusResponse.status == "1"
          ) {
            closeInstructionModal();
          } else {
            setInstructionModal(true);
          }
        } else {
          getQuestionData();
        }
      })
      .catch(function (error) {});
  };

  // Submit Adaptive Question
  const submitAdaptiveQuestion = () => {
    setLoader(true);
    let testId = arrAdaptiveData[currentIndex].question.studentCategoryId,
      user_id = props.loginData.isLoginUserData.content.user_id;
    const API_URL = IRTBaseUrl;
    const platform = "website";
    const app_name = "Learning App School Adaptive Test";
    const domain = IRTDomainBaseUrl;
    const currentQuestionID =
      arrAdaptiveData[currentIndex].question.questionId.toString();
    let userResponse = 0;

    if (
      arrAdaptiveData[currentIndex].question.attemptedOptionId ==
      getTestData.data.paperJson.rightAnsDetails[currentQuestionID].answerid
    ) {
      userResponse = 1;
    } else {
      userResponse = 0;
    }

    const checksum = Md5(
      user_id +
        ":" +
        platform +
        ":" +
        app_name +
        ":" +
        testId +
        ":" +
        currentQuestionID +
        ":" +
        userResponse +
        ":" +
        AdaptiveSalt
    );
    const data = {
      user_id: user_id,
      platform: platform,
      app_name: app_name,
      domain: domain,
      test_id: testId,
      current_question: currentQuestionID,
      user_response: userResponse,
      checksum: checksum,
    };

    Axios.post(API_URL, data)
      .then((response) => {
        setLoader(false);
        if (response.data.status[0] == "success") {
          adaptiveQuestionGenerate(response.data.next_question_id[0]);
        } else {
          adaptiveQuestionGenerate("");
        }

        setCurrentIndex(currentIndex + 1);
        setQuesTime(arrQuestionTime[currentIndex + 1]);
        setQtimer(0);
      })
      .catch(function (error) {
        if (currentIndex + 1 < questionCount) {
          setQuesNumb(QuesNumb + 1);
        } else {
          return;
        }
        adaptiveQuestionGenerate("");
        setCurrentIndex(currentIndex + 1);
        setQuesTime(arrQuestionTime[currentIndex + 1]);
        setQtimer(0);
      })
      .then(function () {});
  };

  const adaptiveQuestionGenerate = (QuesId) => {
    if (QuesId != "") {
      if (getTestData.data.paperJson.questioncategories.length > 1) {
        let questionCatLength = 0;

        for (
          var i = 0;
          i < getTestData.data.paperJson.questioncategories.length;
          i++
        ) {
          questionCatLength =
            questionCatLength +
            getTestData.data.paperJson.questioncategories[i]
              .categoryTotalQuestion;

          if (arrAdaptiveData.length < questionCatLength) {
            let indx = getTestData.data.paperJson.data.findIndex(
              (item) => item.questionData.questionId == QuesId
            );

            setArrAdaptiveData((question) => {
              let obj = {
                question: getTestData.data.paperJson.data[indx].questionData,
                options: getTestData.data.paperJson.data[indx].optionData,
              };
              return [...question.concat(obj)];
            });
            break;
          } else if (arrAdaptiveData.length == questionCatLength) {
            if (getTestData.data.paperJson.questioncategories.length <= i + 1) {
              let stCatId =
                getTestData.data.paperJson.questioncategories[i + 1]
                  .studentCategoryId;

              let arrStCatIdQuestion = getTestData.data.paperJson.data.filter(
                (Qitem) => {
                  return Qitem.questionData.studentCategoryId == stCatId;
                }
              );

              setArrAdaptiveData((question) => {
                let obj = {
                  question: arrStCatIdQuestion[0].questionData,
                  options: arrStCatIdQuestion[0].optionData,
                };
                return [...question.concat(obj)];
              });
              break;
            }
          }
        }
      } else {
        let indx = getTestData.data.paperJson.data.findIndex(
          (item) => item.questionData.questionId == QuesId
        );

        setArrAdaptiveData((question) => {
          let obj = {
            question: getTestData.data.paperJson.data[indx].questionData,
            options: getTestData.data.paperJson.data[indx].optionData,
          };
          return [...question.concat(obj)];
        });
      }
    } else {
      if (getTestData.data.paperJson.questioncategories.length > 1) {
        let questionCatLength = 0;

        for (
          var i = 0;
          i < getTestData.data.paperJson.questioncategories.length;
          i++
        ) {
          questionCatLength =
            questionCatLength +
            getTestData.data.paperJson.questioncategories[i]
              .categoryTotalQuestion;

          if (arrAdaptiveData.length < questionCatLength) {
            let stCatId =
              getTestData.data.paperJson.questioncategories[i]
                .studentCategoryId;

            let arrStCatIdQuestion = getTestData.data.paperJson.data.filter(
              (Qitem) => {
                return Qitem.questionData.studentCategoryId == stCatId;
              }
            );

            let arrNotAttemptedQuestion = arrStCatIdQuestion.filter((Qitem) => {
              return arrAdaptiveData.find(
                (item) =>
                  item.question.questionId != Qitem.questionData.questionId
              );
            });

            setArrAdaptiveData((question) => {
              let obj = {
                question: arrNotAttemptedQuestion[0].questionData,
                options: arrNotAttemptedQuestion[0].optionData,
              };
              return [...question.concat(obj)];
            });

            break;
          } else if (arrAdaptiveData.length == questionCatLength) {
            if (getTestData.data.paperJson.questioncategories.length <= i + 1) {
              let stCatId =
                getTestData.data.paperJson.questioncategories[i + 1]
                  .studentCategoryId;

              let arrStCatIdQuestion = getTestData.data.paperJson.data.filter(
                (Qitem) => {
                  return Qitem.questionData.studentCategoryId == stCatId;
                }
              );

              setArrAdaptiveData((question) => {
                let obj = {
                  question: arrStCatIdQuestion[0].questionData,
                  options: arrStCatIdQuestion[0].optionData,
                };
                return [...question.concat(obj)];
              });
              break;
            }
          }
        }
      } else {
        let arrNotAttemptedQuestion = getTestData.data.paperJson.data.filter(
          (Qitem) => {
            return arrAdaptiveData.find(
              (item) =>
                item.question.questionId != Qitem.questionData.questionId
            );
          }
        );

        setArrAdaptiveData((question) => {
          let obj = {
            question: arrNotAttemptedQuestion[0].questionData,
            options: arrNotAttemptedQuestion[0].optionData,
          };
          return [...question.concat(obj)];
        });
      }
    }
  };

  // QuestionID generater
  const randomQuestionIdGenrate = () => {
    return arrQuestionId[currentIndex + 1];
  };

  // SUBMIT QUESTION ONE BY ONE API FOR RESUME FUNCTIONALITY

  const submitNationalLevelWeeklyTest = (isComeFromBack) => {
    let assign_auto_id =
        paperName == "eyse" || paperName == "emat"
          ? getTestData.data.assign_auto_id
          : props.testData.assign_auto_id,
      user_id = props.loginData.isLoginUserData.content.user_id;
    let API_URL =
      "https://o2ml9cjy22.execute-api.ap-south-1.amazonaws.com/mongoEyse";

    if (paperName == "eyse") {
      API_URL =
        "https://o2ml9cjy22.execute-api.ap-south-1.amazonaws.com/StageDev/mongoEyse";
      // "https://o2ml9cjy22.execute-api.ap-south-1.amazonaws.com/mongoEyse";
    }
    var localtotalRemainingTime = 0;
    var questionID = 0;
    var optionID = "";
    var questionNumberIndx = 0;
    var attemptedTimeSec = 0;
    var questionStatus = "";
    if (isAdaptiveTest == 1) {
      if (isComeFromBack) {
        const { arrAdaptiveData } = finalValues.current;
        localtotalRemainingTime =
          finalValues.current.timeRemaining - finalValues.current.qTimers;
        questionID =
          arrAdaptiveData[finalValues.current.currentIndexs].question
            .questionId;
        optionID =
          arrAdaptiveData[finalValues.current.currentIndexs].question
            .attemptedOptionId;
        questionNumberIndx = finalValues.current.currentIndexs;
        attemptedTimeSec =
          arrAdaptiveData[finalValues.current.currentIndexs].question
            .questionAttemptedTime;
        questionStatus =
          arrAdaptiveData[finalValues.current.currentIndexs].question
            .questionStatus;
      } else {
        localtotalRemainingTime = totalRemainingTime - qTimer;
        questionID = arrAdaptiveData[currentIndex].question.questionId;
        optionID = arrAdaptiveData[currentIndex].question.attemptedOptionId;
        questionNumberIndx = currentIndex;
        attemptedTimeSec =
          arrAdaptiveData[currentIndex].question.questionAttemptedTime;
        questionStatus = arrAdaptiveData[currentIndex].question.questionStatus;
      }
    } else {
      if (isComeFromBack) {
        localtotalRemainingTime =
          finalValues.current.timeRemaining - finalValues.current.qTimers;
        questionID =
          QuestionList.QuestionData[finalValues.current.currentIndexs].quesId;
        optionID =
          QuestionList.QuestionData[finalValues.current.currentIndexs]
            .attemptedOptionId;
        questionNumberIndx = finalValues.current.currentIndexs;
        attemptedTimeSec =
          QuestionList.QuestionData[finalValues.current.currentIndexs]
            .questionAttemptedTime;
        questionStatus =
          QuestionList.QuestionData[finalValues.current.currentIndexs]
            .questionStatus;
        getTestData = "";
        mongoTestStatusResponse = "";
        questionText = [];
        optionText = [];
        setQuestionList({ QuestionData: [] });

        setOptionList({ OptionsData: [] });
      } else {
        localtotalRemainingTime = totalRemainingTime - qTimer;
        questionID = QuestionList.QuestionData[currentIndex].quesId;
        optionID = QuestionList.QuestionData[currentIndex].attemptedOptionId;
        questionNumberIndx = currentIndex;
        attemptedTimeSec =
          QuestionList.QuestionData[currentIndex].questionAttemptedTime;
        questionStatus = QuestionList.QuestionData[currentIndex].questionStatus;
        QuesOptions = [];
      }
    }

    setTotalRemainingTime(localtotalRemainingTime);
    // if (paperName === "weekly") {

    let data = {
      action: "weeklytest_submit_question",
      checksum: "",
      assign_auto_id: assign_auto_id,
      user_id: user_id,
      question_id: questionID,
      option_id: optionID,
      question_index: questionNumberIndx,
      attempt_time_sec: attemptedTimeSec,
      question_status: questionStatus,
      remaining_time: localtotalRemainingTime,
    };
    if (paperName == "eyse") {
      data.action = "eyes_submit_question";
    } else if (paperName == "emat") {
      data.action = "emat_submit_question";
    }
    data.checksum = Md5(data.action + ":" + user_id + ":" + assign_auto_id);
    console.log(data);

    console.log(JSON.stringify(data));
    Axios.post(API_URL, data)
      .then((response) => {
        console.log(response);
      })
      .catch(function (error) {})
      .then(function () {});
  };
  const submitQuestion = (isComeFromBack = false) => {
    if (
      paperName == "weekly" ||
      paperName == "foundation" ||
      paperName == "homeWork" ||
      paperName == "school" ||
      paperName == "worksheet" ||
      paperName == "schoolAdaptive" ||
      paperName == "gts" ||
      paperName == "instant" ||
      paperName == "chapter" ||
      paperName == "practice"
    ) {
      if (props.testData.is_subjective_type == 2) {
        submitWeeklyOneByOne("0", isComeFromBack);
      } else {
        submitNationalLevelWeeklyTest(isComeFromBack);
      }
    } else {
      submitNationalLevelWeeklyTest(isComeFromBack);
    }
  };

  useEffect(() => {
    return () => {
      if (history.action === "POP") {
        onClickBrowserBack();
      }
    };
  }, [history]);

  const timeEnd = () => {
    setTimerStop(true);
  };

  const abortTest = () => {
    setLoader(true);
    hitSubmitApi();
  };

  const setTime = () => {
    setTotalRemainingTime(mongoTestStatusResponse.last_remaining_time);
    setTotalTestTime(mongoTestStatusResponse.last_remaining_time);
    setQuesNumb(mongoTestStatusResponse.last_attempted_question);
    setCurrentIndex(mongoTestStatusResponse.last_attempted_question);
    setQuesTime(
      arrQuestionTime[mongoTestStatusResponse.last_attempted_question]
    );
  };

  const closeInstructionModal = () => {
    testStart = true;
    setInstructionModal(false);

    if (isAdaptiveTest == 1) {
      parseAdaptiveTestData(getTestData);
    } else if (paperName == "eyse" || paperName == "emat") {
      parseEyseEmat(getTestData.data);
    } else {
      parseTestData(getTestData);
    }
  };
  const getAnswer = (optionId, optionArray, order = false) => {
    let orderVal = ["A", "B", "C", "D", "E"];
    for (var l = 0; l < optionArray.length; l++) {
      if (optionArray[l]["optionid"] == optionId) {
        if (order) {
          return orderVal[l];
        } else return optionArray[l]["optiontext"];
      }
    }
  };

  const [InstructionModal, setInstructionModal] = useState(false);
  const [visibilityPopup, showVisibilityPopup] = useState(false);
  const [QuestionList, setQuestionList] = useState({
    QuestionData: questionText,
  });
  const [OptionList, setOptionList] = useState({
    OptionsData: QuesOptions,
  });

  const parseParagraph = (paragraphQuestion) => {
    let paragraph = addingImgUrl(
      serverUrl.AssementServer,
      paragraphQuestion.qnaData.questiondata.question
    );
    let loopHandle = paragraphQuestion.childQuestion;
    for (let ques = 0; ques < paragraphQuestion.childQuestion.length; ques++) {
      arrStatus[count] = questionStatus.NotAttempted;
      arrQuestionTime[count] = 0;

      questionText[count] = {};
      questionText[count]["quesId"] = {};
      questionText[count]["quesText"] = {};
      questionText[count]["questionmarks"] = {};
      questionText[count]["quesId"] =
        loopHandle[ques].qnaData.questiondata.questionid;
      questionText[count]["quesText"] =
        loopHandle[ques].qnaData.questiondata.question;
      questionText[count]["quesText"] = addingImgUrl(
        serverUrl.AssementServer,
        questionText[count]["quesText"]
      );
      questionText[count]["quesType"] =
        loopHandle[ques].qnaData.questiondata.questiontype;
      // questionText[count][
      //   "quesText"
      // ].replaceAll(`src="`, `src="${AssementImageBaseURL}`);
      questionText[count]["questionmarks"] =
        loopHandle[ques].qnaData.questiondata.questionmarks;
      questionText[count]["answer_image"] = [];
      questionText[count]["paragraph"] = "";
      questionText[count]["paragraph"] = paragraph;

      if (isQuestionTimeBound == 1) {
        arrPerQuestionTimeBound[count] =
          loopHandle[ques].qnaData.questiondata.questiontime;
        arrIsTimeup[count] = false;
      }

      if (mongoTestStatusResponse.status == "1") {
        for (
          let i = 0;
          i < mongoTestStatusResponse.attempted_question_data.length;
          i++
        ) {
          if (
            questionText[count]["quesId"] ==
            mongoTestStatusResponse.attempted_question_data[i].question_id
          ) {
            questionText[count].questionAttemptedTime =
              mongoTestStatusResponse.attempted_question_data[
                i
              ].attempt_time_sec;
            arrQuestionTime[count] =
              mongoTestStatusResponse.attempted_question_data[
                i
              ].attempt_time_sec;
            questionText[count].questionStatus =
              mongoTestStatusResponse.attempted_question_data[
                i
              ].question_status;
            arrStatus[count] =
              mongoTestStatusResponse.attempted_question_data[
                i
              ].question_status;

            if (
              mongoTestStatusResponse.attempted_question_data[i]
                .question_status == questionStatus.skipped &&
              mongoTestStatusResponse.attempted_question_data[i]
                .attempt_time_sec != 0
            ) {
              arrStatus[count] = questionStatus.Skipped;
              questionText[count].questionStatus = questionStatus.Skipped;
            } else if (
              mongoTestStatusResponse.attempted_question_data[i]
                .question_status == questionStatus.skipped
            ) {
              arrStatus[count] = questionStatus.NotAttempted;
              questionText[count].questionStatus = questionStatus.NotAttempted;
            }
            if (
              arrStatus[count] == questionStatus.Attempted ||
              arrStatus[count] == questionStatus.AttemptedAndMarkedForReview
            ) {
              questionText[count].attemptedOptionId =
                mongoTestStatusResponse.attempted_question_data[i].option_id;
              questionText[count].answer_image = mongoTestStatusResponse
                .attempted_question_data[i].answer_image
                ? mongoTestStatusResponse.attempted_question_data[i]
                    .answer_image
                : [];
              questionText[count].answer = mongoTestStatusResponse
                .attempted_question_data[i].answer_text
                ? mongoTestStatusResponse.attempted_question_data[i].answer_text
                : getAnswer(
                    questionText[count].attemptedOptionId,
                    loopHandle[ques].optiondata[0].options
                  );
              questionText[count].subjectiveAnswer = mongoTestStatusResponse
                .attempted_question_data[i].answer_text
                ? mongoTestStatusResponse.attempted_question_data[i].answer_text
                : "";
              questionText[count].order = getAnswer(
                questionText[count].attemptedOptionId,
                loopHandle[ques].optiondata[0].options,
                true
              );
            }
          }
        }
      }

      // OPTIONS PARSING

      optionLen = loopHandle[ques].optiondata[0].options;
      optionText[count] = {};

      for (let op = 0; op < optionLen.length; op++) {
        optionText[count][op] = {};
        optionText[count][op]["optionId"] = {};
        optionText[count][op]["optionText"] = {};
        optionText[count][op]["optionId"] =
          loopHandle[ques].optiondata[0].options[op].optionid;
        optionText[count][op]["optionText"] =
          loopHandle[ques].optiondata[0].options[op].optiontext;
        optionText[count][op]["optionText"] = addingImgUrl(
          serverUrl.AssementServer,
          optionText[count][op]["optionText"]
        );

        // optionText[count][op][
        //   "optionText"
        // ].replaceAll(`src="`, `src="${AssementImageBaseURL}`);
      }

      count = count + 1;
    }
  };

  const getAdaptiveAnswer = (attemptedId, optionData, order = false) => {
    let orderVal = ["A", "B", "C", "D", "E"];

    for (var i = 0; i < optionData.options.length; i++) {
      let opText = optionData.options[i].optionText1;
      opText = addingImgUrl(serverUrl.AssementServer, opText);

      // opText.replaceAll(`src="`, `src="${AssementImageBaseURL}`);

      if (attemptedId == optionData.options[i].optionId) {
        if (order) {
          return orderVal[i];
        } else {
          return opText;
        }
      }
    }
  };

  const parseAdaptiveTestData = (qData) => {
    arrStatus.length = 0;
    QuestionList.QuestionData.length = 0;
    arrQuestionTime.length = 0;
    arrPerQuestionTimeBound.length = 0;
    arrIsTimeup.length = 0;

    questionCount = Number(qData.data.paperJson.total_question);

    for (var i = 0; i < questionCount; i++) {
      arrQuestionTime[i] = 0;
      arrStatus[i] = questionStatus.NotAttempted;
    }

    if (mongoTestStatusResponse.status == "1") {
      for (
        let i = 0;
        i < mongoTestStatusResponse.attempted_question_data.length;
        i++
      ) {
        let indx = qData.data.paperJson.data.findIndex(
          (item) =>
            item.questionData.questionId ==
            mongoTestStatusResponse.attempted_question_data[i].question_id
        );
        if (indx == -1) {
          continue;
        }
        let questionData = qData.data.paperJson.data[indx].questionData;
        let optionData = qData.data.paperJson.data[indx].optionData;

        questionData.questionAttemptedTime =
          mongoTestStatusResponse.attempted_question_data[i].attempt_time_sec;
        arrQuestionTime[i] =
          mongoTestStatusResponse.attempted_question_data[i].attempt_time_sec;

        questionData.questionStatus =
          mongoTestStatusResponse.attempted_question_data[i].question_status;
        arrStatus[i] =
          mongoTestStatusResponse.attempted_question_data[i].question_status;

        if (
          arrStatus[i] == questionStatus.Attempted ||
          arrStatus[i] == questionStatus.AttemptedAndMarkedForReview
        ) {
          questionData.attemptedOptionId =
            mongoTestStatusResponse.attempted_question_data[i].option_id;

          questionData.answer = mongoTestStatusResponse.attempted_question_data[
            i
          ].answer_text
            ? mongoTestStatusResponse.attempted_question_data[i].answer_text
            : getAdaptiveAnswer(questionData.attemptedOptionId, optionData);

          questionData.order = getAdaptiveAnswer(
            questionData.attemptedOptionId,
            optionData,
            true
          );
        }

        setArrAdaptiveData((question) => {
          let obj = {
            question: questionData,
            options: optionData,
          };

          return [...question.concat(obj)];
        });
        setTime();
      }
    } else {
      setArrAdaptiveData((question) => {
        let obj = {
          question: qData.data.paperJson.data[0].questionData,
          options: qData.data.paperJson.data[0].optionData,
        };
        return [...question.concat(obj)];
      });
      setQuesTime(0);
      setTotalTestTime(qData.data.paperJson.timeDuration * 60);
      setTotalRemainingTime(qData.data.paperJson.timeDuration * 60);
    }
    setQuestionApi(true);
  };

  const parseTestData = (qData) => {
    arrStatus.length = 0;
    QuestionList.QuestionData.length = 0;
    arrQuestionTime.length = 0;
    arrPerQuestionTimeBound.length = 0;
    arrIsTimeup.length = 0;
    let arrRightAnswerLocal = [];
    if (qData.data != "" && qData.data != "undefined") {
      let list =
        qData.data && qData.data.paperJson && qData.data.paperJson.sectionList
          ? qData.data.paperJson.sectionList
          : "";
      optionLen = 0;

      count = 0;
      for (let section = 0; section < list.length; section++) {
        let questionArr = list[section].questionArray;
        for (let ques = 0; ques < questionArr.length; ques++) {
          if (questionArr[ques].numberOfQnaRows[0].questions[0].childQuestion) {
            parseParagraph(questionArr[ques].numberOfQnaRows[0].questions[0]);
          } else {
            arrStatus[count] = questionStatus.NotAttempted;
            arrQuestionTime[count] = 0;
            questionText[count] = {};
            questionText[count]["quesId"] = {};
            questionText[count]["quesText"] = {};
            questionText[count]["questionmarks"] = {};
            questionText[count]["quesId"] =
              questionArr[
                ques
              ].numberOfQnaRows[0].questions[0].qnaData.questiondata.questionid;
            arrQuestionId[count] =
              questionArr[
                ques
              ].numberOfQnaRows[0].questions[0].qnaData.questiondata.questionid;
            questionText[count]["quesText"] =
              questionArr[
                ques
              ].numberOfQnaRows[0].questions[0].qnaData.questiondata.question;
            questionText[count]["quesText"] = addingImgUrl(
              serverUrl.AssementServer,
              questionText[ques]["quesText"]
            );
            questionText[count]["quesType"] =
              questionArr[
                ques
              ].numberOfQnaRows[0].questions[0].qnaData.questiondata.questiontype;
            // questionText[ques][
            //   "quesText"
            // ].replaceAll(`src="`, `src="${AssementImageBaseURL}`);

            questionText[count]["questionmarks"] =
              questionArr[
                ques
              ].numberOfQnaRows[0].questions[0].qnaData.questiondata.questionmarks;
            questionText[count]["answer_image"] = [];

            if (
              questionArr[ques].numberOfQnaRows[0].questions[0]
                .rightanswerdata != "undefined"
            ) {
              arrRightAnswerLocal[count] =
                questionArr[ques].numberOfQnaRows[0].questions[0]
                  .rightanswerdata &&
                questionArr[ques].numberOfQnaRows[0].questions[0]
                  .rightanswerdata.rightanswer &&
                questionArr[ques].numberOfQnaRows[0].questions[0]
                  .rightanswerdata.rightanswer
                  ? questionArr[ques].numberOfQnaRows[0].questions[0]
                      .rightanswerdata.rightanswer
                  : "";
            }

            if (isQuestionTimeBound == 1) {
              arrPerQuestionTimeBound[count] =
                questionArr[
                  ques
                ].numberOfQnaRows[0].questions[0].qnaData.questiondata.questiontime;
              arrIsTimeup[count] = false;
            }

            if (mongoTestStatusResponse.status == "1") {
              for (
                let i = 0;
                i < mongoTestStatusResponse.attempted_question_data.length;
                i++
              ) {
                if (
                  questionText[count]["quesId"] ==
                  mongoTestStatusResponse.attempted_question_data[i].question_id
                ) {
                  questionText[count].questionAttemptedTime =
                    mongoTestStatusResponse.attempted_question_data[
                      i
                    ].attempt_time_sec;
                  arrQuestionTime[count] =
                    mongoTestStatusResponse.attempted_question_data[
                      i
                    ].attempt_time_sec;
                  questionText[count].questionStatus =
                    mongoTestStatusResponse.attempted_question_data[
                      i
                    ].question_status;

                  arrStatus[count] =
                    mongoTestStatusResponse.attempted_question_data[
                      i
                    ].question_status;
                  if (
                    mongoTestStatusResponse.attempted_question_data[i]
                      .question_status == questionStatus.skipped &&
                    mongoTestStatusResponse.attempted_question_data[i]
                      .attempt_time_sec != 0
                  ) {
                    arrStatus[count] = questionStatus.Skipped;
                    questionText[count].questionStatus = questionStatus.Skipped;
                  } else if (
                    mongoTestStatusResponse.attempted_question_data[i]
                      .question_status == questionStatus.skipped
                  ) {
                    arrStatus[count] = questionStatus.NotAttempted;
                    questionText[count].questionStatus =
                      questionStatus.NotAttempted;
                  }

                  if (
                    arrStatus[count] == questionStatus.Attempted ||
                    arrStatus[count] ==
                      questionStatus.AttemptedAndMarkedForReview
                  ) {
                    questionText[count].attemptedOptionId =
                      mongoTestStatusResponse.attempted_question_data[
                        i
                      ].option_id;
                    questionText[count].answer_image = mongoTestStatusResponse
                      .attempted_question_data[i].answer_image
                      ? mongoTestStatusResponse.attempted_question_data[i]
                          .answer_image
                      : [];
                    questionText[count].answer = mongoTestStatusResponse
                      .attempted_question_data[i].answer_text
                      ? mongoTestStatusResponse.attempted_question_data[i]
                          .answer_text
                      : getAnswer(
                          questionText[count].attemptedOptionId,
                          questionArr[ques].numberOfQnaRows[0].questions[0]
                            .optiondata[0].options
                        );
                    questionText[count].subjectiveAnswer =
                      mongoTestStatusResponse.attempted_question_data[i]
                        .answer_text
                        ? mongoTestStatusResponse.attempted_question_data[i]
                            .answer_text
                        : "";
                    questionText[count].order = getAnswer(
                      questionText[count].attemptedOptionId,
                      questionArr[ques].numberOfQnaRows[0].questions[0]
                        .optiondata[0].options,
                      true
                    );
                  }
                }
              }
            }

            // OPTIONS PARSING

            optionLen =
              questionArr[ques].numberOfQnaRows[0].questions[0].optiondata[0]
                .options;
            optionText[count] = {};

            for (let op = 0; op < optionLen.length; op++) {
              optionText[count][op] = {};
              optionText[count][op]["optionId"] = {};
              optionText[count][op]["optionText"] = {};
              optionText[count][op]["optionId"] =
                questionArr[
                  ques
                ].numberOfQnaRows[0].questions[0].optiondata[0].options[
                  op
                ].optionid;
              optionText[count][op]["optionText"] =
                questionArr[
                  ques
                ].numberOfQnaRows[0].questions[0].optiondata[0].options[
                  op
                ].optiontext;
              optionText[count][op]["optionText"] = addingImgUrl(
                serverUrl.AssementServer,
                optionText[count][op]["optionText"]
              );
              // optionText[count][op][
              //   "optionText"
              // ].replaceAll(`src="`, `src="${AssementImageBaseURL}`);
            }

            count = count + 1;
          }
        }
      }
      setQuestionList({ QuestionData: questionText });
      questionCount = count;

      if (mongoTestStatusResponse.status == "1") {
        if (
          paperName == "weekly" ||
          paperName == "foundation" ||
          paperName == "homeWork" ||
          paperName == "school" ||
          paperName == "worksheet" ||
          paperName == "schoolAdaptive" ||
          paperName == "gts" ||
          paperName == "instant" ||
          paperName == "chapter" ||
          paperName == "practice"
        ) {
          // Checking condition paper is subjective
          if (props.testData.is_subjective_type == 2) {
            let usedTime = 0;
            for (
              let i = 0;
              i < mongoTestStatusResponse.attempted_question_data.length;
              i++
            ) {
              usedTime += Number(
                mongoTestStatusResponse.attempted_question_data[i]
                  .attempt_time_sec
              );
            }

            let resumeTime =
              qData.data.paperJson.quesdata.time_allowed * 60 - usedTime;

            setTotalTestTime(resumeTime);
            setTotalRemainingTime(resumeTime);
            let quenumb =
              Number(
                mongoTestStatusResponse.attempted_question_data[
                  mongoTestStatusResponse.attempted_question_data.length - 1
                ].question_index
              ) - 1;
            setQuesNumb(quenumb);
            setCurrentIndex(quenumb);

            let sendValue =
              arrQuestionTime[
                Number(
                  mongoTestStatusResponse.attempted_question_data[
                    mongoTestStatusResponse.attempted_question_data.length - 1
                  ].question_index
                ) - 1
              ];

            setQuesTime(sendValue);
          } else {
            setTime();
          }
        } else {
          setTime();
        }
      } else {
        setTotalTestTime(qData.data.paperJson.quesdata.time_allowed * 60);
        setTotalRemainingTime(qData.data.paperJson.quesdata.time_allowed * 60);
      }

      if (questionText.length == optionText.length) {
        for (let index = 0; index < optionText.length; index++) {
          if (optionText[index][3]) {
            QuesOptions[index] = {
              order1: "A",
              option1: optionText[index][0].optionText,
              optionId1: optionText[index][0].optionId,
              order2: "B",
              option2: optionText[index][1].optionText,
              optionId2: optionText[index][1].optionId,
              order3: "C",
              option3: optionText[index][2].optionText,
              optionId3: optionText[index][2].optionId,
              order4: "D",
              option4: optionText[index][3].optionText,
              optionId4: optionText[index][3].optionId,
            };
          } else if (optionText[index][2]) {
            QuesOptions[index] = {
              order1: "A",
              option1: optionText[index][0].optionText,
              optionId1: optionText[index][0].optionId,
              order2: "B",
              option2: optionText[index][1].optionText,
              optionId2: optionText[index][1].optionId,
              order3: "C",
              option3: optionText[index][2].optionText,
              optionId3: optionText[index][2].optionId,
            };
          } else if (optionText[index][1]) {
            QuesOptions[index] = {
              order1: "A",
              option1: optionText[index][0].optionText,
              optionId1: optionText[index][0].optionId,
              order2: "B",
              option2: optionText[index][1].optionText,
              optionId2: optionText[index][1].optionId,
            };
          } else {
            QuesOptions[index] = {
              optionText: optionText[index][0].optionText,
              optionId: optionText[index][0].optionId,
              isSubjective: true,
            };
          }
        }
      } else {
      }
    }

    if (isAdaptiveTest == 1) {
      if (mongoTestStatusResponse.status == "1") {
        for (
          let i = 0;
          i < mongoTestStatusResponse.attempted_question_data.length;
          i++
        ) {
          // let question = QuestionList.QuestionData.find(
          //   (item) => item.quesId == mongoTestStatusResponse.attempted_question_data[i].question_id
          // );
          let indx = QuestionList.QuestionData.findIndex(
            (item) =>
              item.quesId ==
              mongoTestStatusResponse.attempted_question_data[i].question_id
          );
          setArrAdaptiveData((question) => {
            let obj = {
              question: QuestionList.QuestionData[indx],
              options: QuesOptions[indx],
              rightAnswer: arrRightAnswerLocal[indx],
            };

            return [...question.concat(obj)];
          });
        }
      } else {
        setArrAdaptiveData((question) => {
          let obj = {
            question: QuestionList.QuestionData[0],
            options: QuesOptions[0],
            rightAnswer: arrRightAnswerLocal[0],
          };

          return [...question.concat(obj)];
        });
      }
    }

    setArrRightAnswer(arrRightAnswerLocal);
    setQuestionApi(true);
  };

  // API RESPONSE FROM GET QUESTION/ANSWER API--------------------------------------------------------->
  // END-------------------------------------------------------------------------------------------->

  useEffect(() => {
    if (getQuestionApi && !InstructionModal && !timerStop) {
      myInterval = setInterval(() => {
        let newValue = Number(arrQuestionTime[currentIndex]) + 1;
        setQuesTime(newValue);
        arrQuestionTime[currentIndex] = newValue;
        let newTime = Number(qTimer) + 1;
        setQtimer(newTime);
      }, 1000);
      return () => {
        clearInterval(myInterval);
      };
    }
  }, [getQuestionApi, InstructionModal, timerStop, qTimer]);

  const QuestionTime = () => {
    var qTimerLocal = quesTime;
    if (isQuestionTimeBound == 1) {
      qTimerLocal = arrPerQuestionTimeBound[currentIndex] - quesTime;

      if (qTimerLocal == 0 && isQuestimeUpHandle) {
        NextHandler();
        arrIsTimeup[currentIndex] = true;
      } else if (qTimerLocal < 0) {
        arrIsTimeup[currentIndex] = true;
        qTimerLocal = 0;
      } else if (qTimerLocal > 0) {
        isQuestimeUpHandle = true;
      }
    }

    var hr = Math.floor(qTimerLocal / 3600);
    var minLeft = qTimerLocal % 3600;
    var min = Math.floor(minLeft / 60);
    var sec = minLeft % 60;
    sec = (sec < 10 ? "0" + sec : sec) + "s";

    if (hr > 0) {
      hr = (hr < 10 ? "0" + hr : hr) + "h:";
      min = (min < 10 ? "0" + min : min) + "m:";
      return hr + min + sec;
    } else if (min > 0) {
      min = (min < 10 ? "0" + min : min) + "m:";
      return min + sec;
    } else {
      return sec;
    }
  };

  const diffTime = (quesTime) => {
    quesTime = Math.floor(quesTime / 1000);
    var hr = Math.floor(quesTime / 3600);
    var minLeft = quesTime % 3600;
    var min = Math.floor(minLeft / 60);
    var sec = minLeft % 60;
    sec = sec < 10 ? "0" + sec : sec;
    //
    if (hr > 0) {
      hr = hr < 10 ? "0" + hr : hr;
      min = min < 10 ? "0" + min : min;

      return hr + ":" + min + ":" + sec;
    } else if (min > 0) {
      min = min < 10 ? "0" + min : min;
      return "00:" + min + ":" + sec;
    } else {
      return "00:00:" + sec;
    }
  };

  const getTotalTimeTaken = (quesTime) => {
    var hr = Math.floor(quesTime / 3600);
    var minLeft = quesTime % 3600;
    var min = Math.floor(minLeft / 60);
    var sec = minLeft % 60;
    sec = sec < 10 ? "0" + sec : sec;
    //
    if (hr > 0) {
      hr = hr < 10 ? "0" + hr : hr;
      min = min < 10 ? "0" + min : min;

      return hr + ":" + min + ":" + sec;
    } else if (min > 0) {
      min = min < 10 ? "0" + min : min;
      return "00:" + min + ":" + sec;
    } else {
      return "00:00:" + sec;
    }
  };
  const getBase64FromUrl = async (url) => {
    // if (url.includes("https")) {
    //   url = url.replace("https", "http");
    // }
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
    });
  };
  let submitWeeklyOneByOne = (last = "0", isComeFromBack = false) => {
    // submitQuestion();
    // "assign_auto_id": 28634,
    // "student_id": 10655757,
    if (last == 1) {
      QuestionList.QuestionData[currentIndex].questionAttemptedTime =
        arrQuestionTime[currentIndex];
    }

    let assign_auto_id = props.testData.assign_auto_id,
      // let assign_auto_id = 28634,
      // user_id = props.loginData.isLoginUserData.content.user_id,
      user_id = props.loginData.isLoginUserData.content.user_id,
      username = props.loginData.isLoginUserData.content.username;
    //
    let m = moment(new Date());
    let h = moment(getTestData.data.currentTime);
    let endTime = m.format("YYYY-MM-DD HH:mm:ss");
    let diff = m.diff(h);
    let timeTaken = diffTime(diff);
    let questionAnswer = [];
    let answerObject = {};
    //  let answerObject = {
    //    "answer": QuestionList.QuestionData[i].attemptedOptionId ? QuestionList.QuestionData[i].attemptedOptionId : [],
    //    "question_id": QuestionList.QuestionData[i].quesId,
    //    "time_taken" : QuestionList.QuestionData[i].questionAttemptedTime ? QuestionList.QuestionData[i].questionAttemptedTime : 0
    //  }
    questionAnswer.push(answerObject);
    let localCurrentIndex = currentIndex;
    if (isComeFromBack) {
      localCurrentIndex = finalValues.current.currentIndexs;
    }
    if (QuestionList.QuestionData[localCurrentIndex].file) {
      if (last != 1) {
        setLoader(true);
      }
    }
    let checksum = Md5(
      (
        assign_auto_id +
        ":" +
        user_id +
        ":" +
        Student_type +
        ":" +
        getTestData.data.currentTime +
        ":" +
        "1" +
        ":" +
        "submit_weekly_test_questionwise" +
        ":" +
        SALT_EMSCC_DASHBOARD +
        ":" +
        API_KEY_EMSCC_DASHBOARD
      ).toUpperCase()
    );

    // "checksum":"md5(strtoupper(assign_auto_id.’:’.student_id.':'.student_type.’:’.student_start_test_time.’:’.auto_save.’:’.action.':'.salt.':'.api_key))",
    let request = {
      assign_auto_id: assign_auto_id,
      student_id: user_id,
      student_type: Student_type,
      student_start_test_time: getTestData.data.currentTime,
      student_end_test_time: endTime,
      auto_save: "1",
      action: "submit_weekly_test_questionwise",
      question_answer: [
        {
          question_id: QuestionList.QuestionData[localCurrentIndex].quesId,
          question_order: localCurrentIndex + 1,
          question_type:
            QuestionList.QuestionData[localCurrentIndex].isSubjective == true
              ? "1"
              : "2",
          answer:
            QuestionList.QuestionData[localCurrentIndex].isSubjective == true &&
            QuestionList.QuestionData[localCurrentIndex].subjectiveAnswer
              ? QuestionList.QuestionData[localCurrentIndex].subjectiveAnswer
              : QuestionList.QuestionData[localCurrentIndex].attemptedOptionId
              ? QuestionList.QuestionData[localCurrentIndex].attemptedOptionId
              : "",
          time_taken:
            QuestionList.QuestionData[localCurrentIndex].questionAttemptedTime,
        },
      ],
      checksum: checksum,
      app_name: "Website",
      time_taken: timeTaken,
      platform: "Web",
      timezone: "Asia/Kolkata",
      is_last: last,
      student_name: username,
    };

    if (QuestionList.QuestionData[localCurrentIndex].file) {
      request.question_answer[0].answer_image = QuestionList.QuestionData[
        localCurrentIndex
      ].file
        ? QuestionList.QuestionData[localCurrentIndex].file
        : [];
    }
    if (QuestionList.QuestionData[localCurrentIndex].answer_image) {
      for (
        let i = 0;
        i < QuestionList.QuestionData[localCurrentIndex].answer_image.length;
        i++
      ) {
        if (
          QuestionList.QuestionData[localCurrentIndex].answer_image[i].file_path
        ) {
          getBase64FromUrl(
            QuestionList.QuestionData[localCurrentIndex].answer_image[i]
              .file_path
          ).then((data) => {
            let obj = {
              img: data.split(",").slice(1).join(","),
            };
            if (request.question_answer[0].answer_image) {
              request.question_answer[0].answer_image.push(obj);
            } else {
              request.question_answer[0].answer_image = obj;
            }
          });
        }
      }
    }

    Axios({
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      url: ASSESSEMENT_API_BASE_URL + "/api/v1.0/weeklyv2",
      data: request,
    }).then(function (response) {
      // alert("Your paper Has been submitted.",response)

      //
      setLoader(false);

      if (last == "1") {
        setLoader(false);
      }
      if (response.data.message == "Submission Successful." && last == "1") {
        setPaperSubmit(true);
        paperDone = true;
        setTimeout(function () {
          if (paperName == "eyse" || paperName == "emat") {
            seteyseEmatComplete(true);
            history.goBack();
          } else if (paperName == "homeWork") {
            // if (props.testData.is_subjective_type == 2) {
            history.goBack();
            // } else {
            //   let subjectName =
            //     getTestData.data.paperJson &&
            //     getTestData.data.paperJson.quesdata &&
            //     getTestData.data.paperJson.quesdata.subject_name &&
            //     getTestData.data.paperJson.quesdata.subject_name
            //       ? getTestData.data.paperJson.quesdata.subject_name
            //       : "";

            //   history.replace({
            //     pathname:
            //       "/homeworksheetreport/" +
            //       assign_auto_id +
            //       "/" +
            //       subjectName +
            //       "/" +
            //       "18",
            //     state: "",
            //   });
            // }
          } else if (paperName == "worksheet") {
            // if (props.testData.is_subjective_type == 2) {
            history.goBack();
            // } else {
            //   let subjectName =
            //     getTestData.data.paperJson &&
            //     getTestData.data.paperJson.quesdata &&
            //     getTestData.data.paperJson.quesdata.subject_name &&
            //     getTestData.data.paperJson.quesdata.subject_name
            //       ? getTestData.data.paperJson.quesdata.subject_name
            //       : "";
            //   history.replace({
            //     pathname:
            //       "/homeworksheetreport/" +
            //       assign_auto_id +
            //       "/" +
            //       subjectName +
            //       "/" +
            //       "17",
            //     state: "",
            //   });
            // }
          } else if (paperName == "schoolAdaptive") {
            history.goBack();
            // const classId = props.loginData.isLoginUserData.content.classId;
            // const boardId = props.loginData.isLoginUserData.content.customBoardId;
            // const userId = props.loginData.isLoginUserData.content.user_id;
            // history.replace({
            //   pathname: `/adaptiveTestReport/report`,
            //   state: {
            //     user_id: userId,
            //     assign_auto_id: props.testData.assign_auto_id,
            //     board_id: boardId,
            //     class_id: classId,
            //     paper_id: props.testData.paper_id,
            //   },
            // });
          } else if (paperName == "instant") {
            history.goBack();
            // history.replace(
            //   "/ChapterTestAnalysis/" + assign_auto_id + "/" + "38"
            // );
          } else if (paperName == "chapter") {
            history.goBack();
            // history.replace("/ChapterTestAnalysis/" + assign_auto_id + "/" + "1");
          } else if (paperName == "practice") {
            history.goBack();
            // history.replace("/ChapterTestAnalysis/" + assign_auto_id + "/" + "6");
          } else {
            history.goBack();
          }
        }, 1300);
      }
    });

    if (isComeFromBack) {
      QuesOptions = [];
      getTestData = "";
      mongoTestStatusResponse = "";
      questionText = [];
      optionText = [];
      setQuestionList({ QuestionData: [] });
      setOptionList({ OptionsData: [] });
    }
  };

  let NationalWeeklyTestSubmitFinal = () => {
    // setLoader(true);
    submitQuestion(false);
    let assign_auto_id =
        paperName == "eyse" || paperName == "emat"
          ? getTestData.data.assign_auto_id
          : props.testData.assign_auto_id,
      user_id = props.loginData.isLoginUserData.content.user_id;
    let m = moment(new Date());
    let h = moment(getTestData.data.currentTime);
    let endTime = m.format("YYYY-MM-DD HH:mm:ss");
    let diff = m.diff(h);
    var timeTaken = 0;
    //diffTime(diff);

    let questionAnswer = [];
    let appName = "";
    let url = "";
    let action = "";

    if (isAdaptiveTest == 1) {
      arrAdaptiveData[currentIndex].question.questionAttemptedTime =
        arrQuestionTime[currentIndex];
      if (!arrAdaptiveData[currentIndex].question.questionStatus) {
        arrAdaptiveData[currentIndex].question.questionStatus =
          questionStatus.NotAttempted;
      }
      appName = "Learning App School Adaptive Test1";
      action = "submit_weekly_test";
      url = ASSESSEMENT_API_BASE_URL + "/api/v1.0/weeklyv2";
      for (var i = 0; i < arrAdaptiveData.length; i++) {
        let answerObject = {
          answer: arrAdaptiveData[i].question.attemptedOptionId
            ? arrAdaptiveData[i].question.attemptedOptionId
            : [],
          question_id: arrAdaptiveData[i].question.questionId,
          time_taken: arrAdaptiveData[i].question.questionAttemptedTime
            ? arrAdaptiveData[i].question.questionAttemptedTime
            : 0,
        };
        timeTaken =
          timeTaken +
          Number(
            arrAdaptiveData[i].question.questionAttemptedTime
              ? arrAdaptiveData[i].question.questionAttemptedTime
              : 0
          );
        questionAnswer.push(answerObject);
      }

      if (arrAdaptiveData.length != questionCount) {
        for (
          var i = 0;
          i < getTestData.data.paperJson.questioncategories.length;
          i++
        ) {
          let questionCatLength =
            getTestData.data.paperJson.questioncategories[i]
              .categoryTotalQuestion;

          let stCat =
            getTestData.data.paperJson.questioncategories[i].studentCategoryId;

          let arrQuest = arrAdaptiveData.filter((item) => {
            return item.question.studentCategoryId == stCat;
          });

          let arrAllQuestCat = getTestData.data.paperJson.data.filter(
            (item) => {
              return item.questionData.studentCategoryId == stCat;
            }
          );

          if (questionCatLength != arrQuest.length) {
            let arrNotAttemptedQuestion = arrAllQuestCat
              .filter((Qitem) => {
                return arrAdaptiveData.find(
                  (item) =>
                    item.question.questionId == Qitem.questionData.questionId
                )
                  ? false
                  : true;
              })
              .map((item) => {
                return {
                  answer: "",
                  question_id: item.questionData.questionId,
                  time_taken: 0,
                };
              });

            let itemRequire = questionCatLength - arrQuest.length;

            for (var i = 0; i < itemRequire; i++) {
              if (arrNotAttemptedQuestion.length > itemRequire) {
                questionAnswer.push(arrNotAttemptedQuestion[i]);
              }

              if (questionAnswer.length == questionCount) {
                break;
              }
            }
          }
        }
      }
    } else {
      QuestionList.QuestionData[currentIndex].questionAttemptedTime =
        arrQuestionTime[currentIndex];

      if (!QuestionList.QuestionData[currentIndex].questionStatus) {
        QuestionList.QuestionData[currentIndex].questionStatus =
          questionStatus.NotAttempted;
      }

      url = ASSESSEMENT_API_BASE_URL + "/api/v1.0/weeklyv2/submit_weekly_test";
      if (paperName == "eyse") {
        action = "submit_jee_test";
        url = ASSESSEMENT_API_BASE_URL + "/api/v1.0/eyse-test";
      } else if (paperName == "emat") {
        action = "submit_emat_test";
        url = ASSESSEMENT_API_BASE_URL + "/api/v1.0/emat-test";
      } else {
        action = "submit_weekly_test";
      }
      appName = "Learning App";
      for (var i = 0; i < QuestionList.QuestionData.length; i++) {
        let answerObject = {
          answer: QuestionList.QuestionData[i].attemptedOptionId
            ? QuestionList.QuestionData[i].attemptedOptionId
            : [],
          question_id: QuestionList.QuestionData[i].quesId,
          time_taken: QuestionList.QuestionData[i].questionAttemptedTime
            ? QuestionList.QuestionData[i].questionAttemptedTime
            : 0,
        };
        timeTaken =
          timeTaken +
          Number(
            QuestionList.QuestionData[i].questionAttemptedTime
              ? QuestionList.QuestionData[i].questionAttemptedTime
              : 0
          );
        questionAnswer.push(answerObject);
      }
    }
    let checksum = "";
    if (paperName == "eyse" || paperName == "emat") {
      checksum = Md5(
        (
          assign_auto_id +
          ":" +
          user_id +
          ":" +
          Student_type +
          ":" +
          getTestData.data.currentTime +
          ":" +
          action +
          ":" +
          SALT_EMSCC_DASHBOARD +
          ":" +
          API_KEY_EMSCC_DASHBOARD
        ).toUpperCase()
      );
    } else {
      checksum = Md5(
        (
          assign_auto_id +
          ":" +
          user_id +
          ":" +
          Student_type +
          ":" +
          getTestData.data.currentTime +
          ":" +
          "0" +
          ":" +
          "submit_weekly_test" +
          ":" +
          SALT_EMSCC_DASHBOARD +
          ":" +
          API_KEY_EMSCC_DASHBOARD
        ).toUpperCase()
      );
    }
    let request = {
      assign_auto_id: assign_auto_id,
      student_type: Student_type,
      student_start_test_time: getTestData.data.currentTime,
      student_end_test_time: endTime,
      auto_save: "0",
      action: action,
      question_answer: questionAnswer,
      checksum: checksum,
      app_name: appName,
      time_taken: getTotalTimeTaken(timeTaken),
      platform: "website",
    };
    if (paperName == "eyse" || paperName == "emat") {
      request.user_id = user_id;
    } else {
      request.student_id = user_id;
    }
    console.log(JSON.stringify(request));

    Axios({
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      url: url,
      data: request,
    }).then(function (response) {
      setLoader(false);
      setPaperSubmit(true);
      paperDone = true;
      console.log(response.data);
      if (
        response &&
        response.data &&
        response.data.message &&
        response.data.message.includes("Submission Successful")
      ) {
        setTimeout(function () {
          if (paperName == "eyse" || paperName == "emat") {
            // seteyseEmatComplete(true);
            history.push("/student-dashboard");
          } else if (paperName == "homeWork") {
            // if (props.testData.is_subjective_type == 2) {
            history.goBack();
            // } else {
            //   let subjectName =
            //     getTestData.data.paperJson &&
            //     getTestData.data.paperJson.quesdata &&
            //     getTestData.data.paperJson.quesdata.subject_name &&
            //     getTestData.data.paperJson.quesdata.subject_name
            //       ? getTestData.data.paperJson.quesdata.subject_name
            //       : "";

            //   history.replace({
            //     pathname:
            //       "/homeworksheetreport/" +
            //       assign_auto_id +
            //       "/" +
            //       subjectName +
            //       "/" +
            //       "18",
            //     state: "",
            //   });
            // }
          } else if (paperName == "worksheet") {
            // if (props.testData.is_subjective_type == 2) {
            history.goBack();
            // } else {
            //   let subjectName =
            //     getTestData.data.paperJson &&
            //     getTestData.data.paperJson.quesdata &&
            //     getTestData.data.paperJson.quesdata.subject_name &&
            //     getTestData.data.paperJson.quesdata.subject_name
            //       ? getTestData.data.paperJson.quesdata.subject_name
            //       : "";
            //   history.replace({
            //     pathname:
            //       "/homeworksheetreport/" +
            //       assign_auto_id +
            //       "/" +
            //       subjectName +
            //       "/" +
            //       "17",
            //     state: "",
            //   });
            // }
          } else if (paperName == "schoolAdaptive") {
            history.goBack();
            // const classId = props.loginData.isLoginUserData.content.classId;
            // const boardId = props.loginData.isLoginUserData.content.customBoardId;
            // const userId = props.loginData.isLoginUserData.content.user_id;
            // history.replace({
            //   pathname: `/adaptiveTestReport/report`,
            //   state: {
            //     user_id: userId,
            //     assign_auto_id: props.testData.assign_auto_id,
            //     board_id: boardId,
            //     class_id: classId,
            //     paper_id: props.testData.paper_id,
            //   },
            // });
          } else if (paperName == "instant") {
            history.goBack();
            // history.replace(
            //   "/ChapterTestAnalysis/" + assign_auto_id + "/" + "38"
            // );
          } else if (paperName == "chapter") {
            history.goBack();
            // history.replace("/ChapterTestAnalysis/" + assign_auto_id + "/" + "1");
          } else if (paperName == "practice") {
            history.goBack();
            // history.replace("/ChapterTestAnalysis/" + assign_auto_id + "/" + "6");
          } else {
            history.goBack();
          }
        }, 1300);
      } else {
        alert("some error occurred");
      }
    });
  };

  let hitSubmitApi = () => {
    if (testName == "demo") {
      setDemoTestModal(true);
    } else if (
      paperName == "weekly" ||
      paperName == "foundation" ||
      paperName == "homeWork" ||
      paperName == "school" ||
      paperName == "worksheet" ||
      paperName == "schoolAdaptive" ||
      paperName == "gts" ||
      paperName == "instant" ||
      paperName == "chapter" ||
      paperName == "practice"
    ) {
      if (isAdaptiveTest == 1) {
        NationalWeeklyTestSubmitFinal();
      } else if (props.testData.is_subjective_type == 2) {
        submitWeeklyOneByOne("1");
      } else {
        NationalWeeklyTestSubmitFinal();
      }
    } else {
      NationalWeeklyTestSubmitFinal();
    }
  };

  const onClickBack = () => {
    if (testStart) {
      if (isAdaptiveTest == 1) {
        if (isAdaptiveTest.length > 0) {
          arrAdaptiveData[currentIndex].question.questionStatus =
            arrStatus[currentIndex];
          arrAdaptiveData[currentIndex].question.questionAttemptedTime =
            arrQuestionTime[currentIndex];

          submitQuestion(false);
          setQtimer(0);
        }
      } else {
        if (QuestionList.QuestionData.length > 0) {
          QuestionList.QuestionData[currentIndex].questionStatus =
            arrStatus[currentIndex];
          QuestionList.QuestionData[currentIndex].questionAttemptedTime =
            arrQuestionTime[currentIndex];
          submitQuestion(false);
          setQtimer(0);
        }
      }
    }
    if (paperName == "eyse") {
      history.push("/student-dashboard");
    } else {
      history.goBack();
    }
  };

  const onClickBrowserBack = () => {
    if (testStart && !paperDone) {
      const { arrAdaptiveData } = finalValues.current;
      if (isAdaptiveTest == 1) {
        if (arrAdaptiveData.length > 0) {
          arrAdaptiveData[
            finalValues.current.currentIndexs
          ].question.questionStatus =
            arrStatus[finalValues.current.currentIndexs];
          arrAdaptiveData[
            finalValues.current.currentIndexs
          ].question.questionAttemptedTime =
            arrQuestionTime[finalValues.current.currentIndexs];
          submitQuestion(true);
          setQtimer(0);
        }
      } else {
        if (QuestionList.QuestionData.length > 0) {
          QuestionList.QuestionData[
            finalValues.current.currentIndexs
          ].questionStatus = arrStatus[finalValues.current.currentIndexs];
          QuestionList.QuestionData[
            finalValues.current.currentIndexs
          ].questionAttemptedTime =
            arrQuestionTime[finalValues.current.currentIndexs];
          submitQuestion(true);
          setQtimer(0);
        }
      }
    }
  };

  const onClickMarkedReviewAndNext = () => {
    if (
      arrStatus[currentIndex] == questionStatus.Attempted ||
      arrStatus[currentIndex] == questionStatus.AttemptedAndMarkedForReview
    ) {
      arrStatus[currentIndex] = questionStatus.AttemptedAndMarkedForReview;
    } else {
      arrStatus[currentIndex] = questionStatus.MarkForReview;
    }

    // if (paperName === "weekly")
    // {

    QuestionList.QuestionData[currentIndex].questionAttemptedTime =
      arrQuestionTime[currentIndex];
    QuestionList.QuestionData[currentIndex].questionStatus =
      arrStatus[currentIndex];

    // }
    submitQuestion(false);
    if (isAdaptiveTest == 1) {
      submitAdaptiveQuestion();
    } else {
      if (QuesNumb >= QuestionList.QuestionData.length - 1) {
        return;
      } else {
        setQuesNumb(QuesNumb + 1);
      }

      setCurrentIndex(currentIndex + 1);
      setQuesTime(arrQuestionTime[currentIndex + 1]);
      setQtimer(0);
    }
  };

  const onClickMarkedReview = () => {
    if (arrStatus[currentIndex] == questionStatus.Attempted) {
      arrStatus[currentIndex] = questionStatus.AttemptedAndMarkedForReview;
    } else {
      arrStatus[currentIndex] = questionStatus.MarkForReview;
    }
  };
  if (isAdaptiveTest == 1) {
    if (arrAdaptiveData.length > 0 && currentIndex > -1) {
      arrAdaptiveData[currentIndex].question.questionStatus =
        arrStatus[currentIndex];
    }
  } else {
    if (QuestionList.QuestionData.length > 0 && currentIndex > -1) {
      QuestionList.QuestionData[currentIndex].questionStatus =
        arrStatus[currentIndex];
    }
  }

  const onClickQuestionNumber = (index) => {
    if (isAdaptiveTest == 1) {
      return;
    }
    if (arrStatus[currentIndex] == questionStatus.NotAttempted) {
      arrStatus[currentIndex] = questionStatus.Skipped;
    }

    // if (paperName === "weekly") {
    QuestionList.QuestionData[currentIndex].questionAttemptedTime =
      arrQuestionTime[currentIndex];
    QuestionList.QuestionData[currentIndex].questionStatus =
      arrStatus[currentIndex];
    //}
    isQuestimeUpHandle = false;
    submitQuestion(false);
    setQuesNumb(index - 1);
    setCurrentIndex(index - 1);
    setQuesTime(arrQuestionTime[index - 1]);
    setQtimer(0);
  };

  const resetHandler = () => {
    arrStatus[currentIndex] = questionStatus.NotAttempted;

    if (isAdaptiveTest == 1) {
      arrAdaptiveData[currentIndex].question.file = [];
      arrAdaptiveData[currentIndex].question.answer_image = [];
      arrAdaptiveData[currentIndex].question.subjectiveAnswer = "";
      arrAdaptiveData[currentIndex].question.answer = "";
      arrAdaptiveData[currentIndex].question.order = "";
      arrAdaptiveData[currentIndex].question.attemptedOptionId = "";
      arrAdaptiveData[currentIndex].question.questionStatus =
        questionStatus.NotAttempted;
    } else {
      QuestionList.QuestionData[currentIndex].file = [];
      QuestionList.QuestionData[currentIndex].answer_image = [];
      QuestionList.QuestionData[currentIndex].subjectiveAnswer = "";
      QuestionList.QuestionData[currentIndex].answer = "";
      QuestionList.QuestionData[currentIndex].order = "";
      QuestionList.QuestionData[currentIndex].questionStatus =
        questionStatus.NotAttempted;
      // if (paperName === "weekly")
      // {
      QuestionList.QuestionData[currentIndex].attemptedOptionId = "";
      // }
    }
  };

  const [QuesNumb, setQuesNumb] = useState(0);

  const PreviousHandler = () => {
    if (isAdaptiveTest == 1) {
      return;
    }
    if (arrStatus[currentIndex] == questionStatus.NotAttempted) {
      arrStatus[currentIndex] = questionStatus.Skipped;
    }

    // if (paperName === "weekly") {
    QuestionList.QuestionData[currentIndex].questionAttemptedTime =
      arrQuestionTime[currentIndex];
    QuestionList.QuestionData[currentIndex].questionStatus =
      arrStatus[currentIndex];
    // }

    submitQuestion(false);
    if (QuesNumb < 1) {
      return false;
    } else {
      setQuesNumb(QuesNumb - 1);
    }
    isQuestimeUpHandle = false;
    setQuesTime(arrQuestionTime[currentIndex - 1]);
    setCurrentIndex(currentIndex - 1);
    setQtimer(0);
  };

  const NextHandler = () => {
    if (arrStatus[currentIndex] == questionStatus.NotAttempted) {
      arrStatus[currentIndex] = questionStatus.Skipped;
    }

    // if (paperName === "weekly" || paperName == 'foundation' || paperName == "homeWork")
    // {

    // }
    //
    if (isAdaptiveTest == 1) {
      if (arrStatus[currentIndex] == questionStatus.Attempted) {
        arrAdaptiveData[currentIndex].question.questionAttemptedTime =
          arrQuestionTime[currentIndex];
        arrAdaptiveData[currentIndex].question.questionStatus =
          arrStatus[currentIndex];

        submitQuestion(false);
        submitAdaptiveQuestion();
      } else {
        return;
      }
    } else {
      QuestionList.QuestionData[currentIndex].questionAttemptedTime =
        arrQuestionTime[currentIndex];
      QuestionList.QuestionData[currentIndex].questionStatus =
        arrStatus[currentIndex];
      submitQuestion(false);

      if (currentIndex + 1 < questionCount) {
        setQuesNumb(QuesNumb + 1);
      } else {
        return;
      }
      setCurrentIndex(currentIndex + 1);
      setQuesTime(arrQuestionTime[currentIndex + 1]);
      setQtimer(0);
    }
  };
  const getInstructionToolTip = () => {
    if (
      Object.keys(getTestData).includes("data") &&
      getTestData &&
      getTestData.data
    ) {
      let instruction =
        getTestData &&
        getTestData.data &&
        getTestData.data.paperJson &&
        getTestData.data.paperJson.instruction1
          ? getTestData.data.paperJson.instruction1
          : "";
      instruction = instruction.split("<br />\r\n");
      return (
        <ul>
          {instruction.map((item) => {
            return (
              <li
                dangerouslySetInnerHTML={{
                  __html: sanitizer(item),
                }}
              />
            );
          })}
        </ul>
      );
    }
  };

  const sendChatMessage = () => {
    // "user_id" : $scope.currentUserId,
    // "assign_auto_id" : $scope.assign_auto_id,
    // "teacher_id": $scope.teacherId,
    // "user_type": "student",
    // "message": $scope.charCode(chatMsg)
  };

  const alertUser = (e) => {
    //QuestionList.QuestionData[currentIndex].questionStatus = arrStatus[currentIndex]
    //QuestionList.QuestionData[currentIndex].questionAttemptedTime = arrQuestionTime[currentIndex]
    //submitQuestion();
    //setQtimer(0);
    //
    localStorage.setItem("testStarted", 0);

    localStorage.setItem("isAdaptiveTest", props.testData.isAdaptiveTest);
    localStorage.setItem(
      "is_ques_time_bound",
      props.testData.is_ques_time_bound
    );
    localStorage.setItem("assign_Id", props.testData.assign_auto_id);

    localStorage.setItem(
      "is_subjective_type",
      props.testData.is_subjective_type
    );

    // if (props.testData.is_ques_time_bound != "undefined") {
    //   isQuestionTimeBound = props.testData.is_ques_time_bound;
    // }
    // if (props.testData.isAdaptiveTest != "undefined") {
    //   isAdaptiveTest = props.testData.isAdaptiveTest;
    // }
    onClickBrowserBack();
    e.preventDefault();
    e.returnValue = "";
  };

  const reloadData = (e) => {
    // getTestStatus();
  };

  const SelectedFiles = (file, url = "", deleteIndex = -1) => {
    if (deleteIndex == -1) {
      arrStatus[currentIndex] = questionStatus.Attempted;
      // QuestionList.QuestionData[currentIndex].file ? '' : QuestionList.QuestionData[currentIndex].file  = [];
      if (!QuestionList.QuestionData[currentIndex].file) {
        QuestionList.QuestionData[currentIndex].file = [];
      }

      QuestionList.QuestionData[currentIndex].questionStatus =
        arrStatus[currentIndex];
      QuestionList.QuestionData[currentIndex].isSubjective = true;
      //

      QuestionList.QuestionData[currentIndex].file.push(file);
      if (url != "") {
        QuestionList.QuestionData[currentIndex].answer_image.push(url);
        //
      }
      //
      // setQuestionList ({...QuestionList,QuestionList.QuestionData[currentIndex].file : QuestionList.QuestionData[currentIndex].file })
    } else {
      const s = QuestionList.QuestionData[currentIndex].file.filter(
        (item, index) => index !== deleteIndex
      );
      QuestionList.QuestionData[currentIndex].file = s;

      const show = QuestionList.QuestionData[currentIndex].answer_image.filter(
        (item, index) => index !== deleteIndex
      );

      QuestionList.QuestionData[currentIndex].answer_image = show;
    }
  };
  const SelectedOption = (id, option, order, isSubjective = false) => {
    //alert(id)

    arrStatus[currentIndex] = questionStatus.Attempted;

    if (isAdaptiveTest == 1) {
      arrAdaptiveData[currentIndex].question.questionStatus =
        arrStatus[currentIndex];
      arrAdaptiveData[currentIndex].question.attemptedOptionId = id;
      arrAdaptiveData[currentIndex].question.answer = option;
      arrAdaptiveData[currentIndex].question.order = order;
    } else {
      if (isSubjective == true) {
        QuestionList.QuestionData[currentIndex].subjectiveAnswer = option;
        QuestionList.QuestionData[currentIndex].isSubjective = true;
      }
      QuestionList.QuestionData[currentIndex].questionStatus =
        arrStatus[currentIndex];
      QuestionList.QuestionData[currentIndex].attemptedOptionId = id;
      QuestionList.QuestionData[currentIndex].answer = option;
      QuestionList.QuestionData[currentIndex].order = order;
    }

    // }
  };
  return (
    <div style={{ position: "relative" }}>
      {testName == "demo" && changeDemoState == true && (
        <div className="d-flex justify-content-center flex-wrap align-items-center demo-test-header">
          <span className="font16 font-medium" style={{ color: "#f79548" }}>
            This is a demo test.
          </span>
          &nbsp;&nbsp;&nbsp;
          <span className="font16 font-medium">
            Marks will not be calculated for this.
          </span>
          &nbsp;&nbsp;&nbsp;
          <a href="/test-engine/eyse">
            {" "}
            <span className="font16 font-medium" style={{ color: "#f79548" }}>
              <span style={{ textDecoration: "underline" }}>
                Skip Demo and start actual test
              </span>{" "}
              <span className="fa fa-angle-right" />
            </span>{" "}
          </a>
        </div>
      )}
      {demoTestModal ? <LastModal setDemoTestModal={setDemoTestModal} /> : ""}
      {eyseEmatComplete && <EyseEmatComplete />}
      {showLoader ? <img src={webEmloader} className="gifLoader" /> : ""}
      {visibilityPopup && (
        <EyseVisibilityPopup showVisibilityPopup={showVisibilityPopup} />
      )}
      {InstructionModal ? (
        <InstructionModalComponent
          testData={props.testData}
          getTestData={getTestData}
          paperStatusUpate={paperStatusUpate}
          closeInstructionModal={closeInstructionModal}
          paperName={paperName}
        />
      ) : (
        ""
      )}
      {timerStop && testName != "demo" ? (
        <TimeupPopUp abortTest={abortTest} submitTest={hitSubmitApi} />
      ) : (
        ""
      )}

      <div className="test-engine-page">
        <div className="d-flex align-items-center justify-content-between ml10 mb10 flex-wrap">
          <div className="d-flex align-items-center mb10">
            <div className="back-btn-icon">
              <img
                width="45px"
                height="45px"
                onClick={() => moveBack()}
                src={backIcon}
                alt="back"
              />
            </div>
            <span className="font16 font-medium ml10">{paperNameHeader}</span>
          </div>
          <div className="pl-2">
            <QuestionStatusInfo />
          </div>
        </div>
        <div className="d-flex test-main-container justify-content-between">
          <div
            className="test-engine-left-section"
            style={{ position: "relative" }}
          >
            <div className="">
              {testName == "demo" && changeDemoState == false ? (
                <DemoTutorial
                  fakeState={setDemoState}
                  exam={paperName}
                  setDemoState={setDemoState}
                />
              ) : (
                ""
              )}

              <div className="row flex-column mb10 mr-0 ml-0">
                {QuestionList.QuestionData &&
                QuestionList.QuestionData[currentIndex] &&
                QuestionList.QuestionData[currentIndex].paragraph ? (
                  <Accordion defaultActiveKey="0" className="mb20">
                    <Card>
                      <Accordion.Toggle
                        as={Card.Header}
                        eventKey="0"
                        onClick={() => setParagraphToggel(!paragraphToggel)}
                      >
                        Paragraph
                        {paragraphToggel ? (
                          <span
                            className="breadcrumb-icon"
                            style={{
                              position: "absolute",
                              right: 20,
                              transform: "rotate(-90deg)",
                              color: "#f79548",
                            }}
                          ></span>
                        ) : (
                          <span
                            className="breadcrumb-icon"
                            style={{
                              position: "absolute",
                              right: 20,
                              transform: "rotate(90deg)",
                              color: "#f79548",
                            }}
                          ></span>
                        )}
                      </Accordion.Toggle>
                    </Card>
                    <Accordion.Collapse eventKey="0">
                      <p
                        dangerouslySetInnerHTML={{
                          __html: sanitizer(
                            QuestionList.QuestionData[currentIndex].paragraph
                          ),
                        }}
                      ></p>
                    </Accordion.Collapse>
                  </Accordion>
                ) : (
                  ""
                )}

                <div className="d-flex flex-wrap justify-content-between question-index-timer mb10">
                  <span className="d-inline-block font16 font-semibold">
                    Question {currentIndex + 1}
                  </span>
                  <div>
                    <QuestionTimer qTime={QuestionTime()} />
                    <span className="test-engine-question-timer font-semibold font15">
                      | MM :{" "}
                      {isAdaptiveTest == 1
                        ? arrAdaptiveData.length > 0 &&
                          arrAdaptiveData[currentIndex] &&
                          arrAdaptiveData[currentIndex].question &&
                          arrAdaptiveData[currentIndex].question.questionMarks
                          ? arrAdaptiveData[currentIndex].question.questionMarks
                          : ""
                        : QuestionList.QuestionData.length > 0 &&
                          QuestionList.QuestionData[currentIndex] &&
                          QuestionList.QuestionData[currentIndex].questionmarks
                        ? QuestionList.QuestionData[currentIndex].questionmarks
                        : ""}
                    </span>
                  </div>
                </div>
                <div
                  className="d-flex flex-wrap justify-content-between align-items-center mb10"
                  style={{ position: "relative" }}
                >
                  <div style={{ fontSize: "14px", fontWeight: "500" }}>
                    {isAdaptiveTest == 1 ||
                    paperName == "eyse" ||
                    paperName == "emat"
                      ? "Single Choice Question"
                      : QuestionList.QuestionData &&
                        QuestionList.QuestionData[currentIndex] &&
                        QuestionList.QuestionData[currentIndex].quesType &&
                        QuestionList.QuestionData[currentIndex].quesType == 1
                      ? "Subjective Question"
                      : QuestionList.QuestionData &&
                        QuestionList.QuestionData[currentIndex] &&
                        QuestionList.QuestionData[currentIndex].quesType &&
                        QuestionList.QuestionData[currentIndex].quesType == 3
                      ? "Paragraph Question"
                      : "Single Choice Question"}
                  </div>
                  <div className="">
                    {isAdaptiveTest == 1 ? (
                      ""
                    ) : (
                      <div
                        style={{ display: "inline-flex", margin: "0 5px" }}
                        className="justify-content-center align-items-center"
                      >
                        <span
                          className="fa fa-check-circle"
                          style={{ color: "#f79548" }}
                        />
                        <MarkedReview
                          text={"Mark For Review & Next"}
                          onClick={() => onClickMarkedReviewAndNext()}
                        />
                      </div>
                    )}
                    &nbsp;
                    {isAdaptiveTest == 1 ? (
                      ""
                    ) : (
                      <div
                        style={{ display: "inline-flex", margin: "0 5px" }}
                        className="justify-content-center align-items-center"
                      >
                        <span
                          className="fa fa-eye"
                          style={{ color: "#f79548" }}
                        />
                        <MarkedReview
                          text={"Mark For Review"}
                          onClick={() => onClickMarkedReview()}
                        />
                      </div>
                    )}
                    {paperName == "eyse" &&
                      testName != "demo" &&
                      getTestData != "" && (
                        <div
                          style={{
                            display: "inline-flex",
                            position: "relative",
                            margin: "0 5px",
                          }}
                          className="justify-content-center align-items-center"
                        >
                          <OverlayTrigger
                            placement="bottom"
                            overlay={
                              <Tooltip id="button-tooltip-2">
                                {getInstructionToolTip()}
                              </Tooltip>
                            }
                          >
                            {({ ref, ...triggerHandler }) => (
                              // <Button
                              //   {...triggerHandler}
                              //   className="d-inline-flex align-items-center"
                              // >
                              //   <span className="ml-1">View instruction</span>
                              // </Button>
                              <div
                                style={{ display: "inline-flex" }}
                                className="justify-content-center align-items-center"
                              >
                                <span
                                  className="fa fa-info-circle"
                                  style={{ color: "#f79548" }}
                                />
                                <div
                                  className="review-btnTestEngine"
                                  {...triggerHandler}
                                >
                                  View instruction
                                </div>
                              </div>
                            )}
                          </OverlayTrigger>
                        </div>
                      )}
                  </div>
                </div>
                <hr className="m-0" />
                <div>
                  {/* {QuestionList.QuestionData ?  */}
                  <TestData
                    timerStop={timerStop}
                    eyseEmatComplete={eyseEmatComplete}
                    QuesNumb={QuesNumb}
                    setQuesNumb={setQuesNumb}
                    QuestionList={QuestionList}
                    OptionList={OptionList}
                    PreviousHandler={PreviousHandler}
                    NextHandler={NextHandler}
                    resetHandler={resetHandler}
                    arrStatus={arrStatus}
                    SelectedOption={SelectedOption}
                    SelectedFiles={SelectedFiles}
                    arrStatus={arrStatus}
                    hitSubmitApi={hitSubmitApi}
                    currentIndex={currentIndex + 1}
                    questionStatus={questionStatus}
                    arrIsTimeup={arrIsTimeup}
                    arrAdaptiveData={arrAdaptiveData}
                    isAdaptiveTest={isAdaptiveTest}
                    paperName={paperName}
                    testName={testName}
                    setDemoTestModal={setDemoTestModal}
                    paperSubmit={paperSubmit}
                    data={[]} //{apiRes.paperJson.data}
                  />
                  {/* : "" }  */}
                </div>
              </div>
            </div>
          </div>

          <div className="test-engine-right-section">
            <div className="d-flex w-100 justify-content-center mb10">
              {totalTestTime == -1 ? (
                ""
              ) : (
                <TimeRemainView timeEnd={timeEnd} sec={totalTestTime} />
              )}
            </div>
            <div className="question-number-card">
              <div className="font-medium mb15 font16">Question No:</div>
              <div className="test-engine-questions-scroll-container">
                <div className="test-engine-questions-scroller">
                  <QuestionNumberList
                    totalQuestion={questionCount}
                    onClick={(index) => onClickQuestionNumber(index)}
                    qStatus={arrStatus}
                    currentIndex={currentIndex}
                  />
                </div>
              </div>
            </div>
            <br />
            {isProctoring ? (
              <Announcements arrAnnouncement={arrAnnouncement} />
            ) : (
              ""
            )}
            <br />
            {isProctoring && arrWarning.length > 0 ? (
              <Warnings arrWarning={arrWarning} />
            ) : (
              ""
            )}
            {isProctoring ? (
              <ChatModal
                messageData={arrChat}
                sendChatMessage={sendChatMessage}
                socket={socket}
                userId={props.loginData.isLoginUserData.content.user_id}
                assignId={props.testData.assign_auto_id}
                teacherId={teacherId}
              />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template;
