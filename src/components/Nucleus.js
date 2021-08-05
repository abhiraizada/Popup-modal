import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Popover from "@material-ui/core/Popover";
import Slider from "@material-ui/core/Slider";
import makeStyles from "@material-ui/core/styles/makeStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import CheckIcon from "@material-ui/icons/Check";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Forward10Icon from "@material-ui/icons/Forward10";
import FullScreen from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import Replay10Icon from "@material-ui/icons/Replay10";
import VolumeDown from "@material-ui/icons/VolumeDown";
import VolumeMute from "@material-ui/icons/VolumeOff";
import VolumeUp from "@material-ui/icons/VolumeUp";
import axios from "axios";
import * as APP_CONSTANTS from "constants/appConstats";
import Url from "constants/urls";
import AppDrawer from "presentation_layer/Dashboard/ui/AppDrawer";
import AppDrawerTeacher from "presentation_layer/Dashboard/ui/AppDrawerTeacher";
import AppHeader from "presentation_layer/Dashboard/ui/AppHeader";
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { setLptDetail, showLoaderInLpt } from "redux/actions";
import {
  setProgressUpdateStatus,
  updateFreemiumArray,
} from "redux/actions/dashboard/freemium";
import screenful from "screenfull";
import { useTheme } from "styled-components";
import { getCurrentTheme, navigateToDashboard } from "utils/Utilities";
import backIcon from "../../assets/dashboard/back-icon.png";
import "../Dashboard/css/Learn.css";
import "./css/style.css";

const md5 = require("js-md5");

const useStyles = makeStyles((theme) => ({
  playerWrapper: {
    width: "100%",
    position: "relative",
  },
  controlsWrapper: {
    visibility: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,.4)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  topControls: {
    display: "flex",
    justifyContent: "flex-end",
    padding: theme.spacing(2),
  },
  middleControls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomWrapper: {
    display: "flex",
    flexDirection: "column",
    background: "rgba(255,0,0,1)",
    sheight: 60,
    padding: theme.spacing(2),
  },
  bottomControls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    // height:40,
  },
  button: {
    margin: theme.spacing(1),
  },
  controlIcons: {
    //color: "#777",
    color: "white",
    fontSize: 50,
    transform: "scale(0.9)",
    "&:nohover": {
      color: "#fff",
      transform: "scale(1)",
      marginTop: "100",
    },
  },
  bottomIcons: {
    color: "white",
    "&:nohover": {
      color: "#fff",
      marginTop: "100",
    },
  },
  volumeSlider: {
    width: 100,
    color: "white",
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  nucleusControlsContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
}));

const PrettoSlider = withStyles({
  root: {
    height: 6,
    color: "orange",
  },
  mark: {
    height: 10,
    width: 10,
    color: "green",
    borderRadius: 5,
  },
  thumb: {
    height: 20,
    width: 20,
    backgroundColor: "#f79548",
    border: "white",
    marginTop: -6,
    marginLeft: -12,
    "&:focus, &:nohover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 5,
    borderRadius: 4,
  },
  rail: {
    height: 5,
    borderRadius: 4,
  },
})(Slider);

const Slidepointer = withStyles({
  root1: {
    height: 20,
    color: "green",
  },
  thumb1: {
    height: 40,
    width: 40,
    // backgroundColor: "#fff",
    // border: "white",
    marginTop: -20,
    marginLeft: -40,
    "&:focus, &:nohover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

const format = (seconds) => {
  if (isNaN(seconds)) {
    return `00:00`;
  }
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, "0");
  if (hh) {
    return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
  }
  return `${mm}:${ss}`;
};

let count = 0;
/**
 * {<Nucleus videoInfo={""}/>}
 * @param  props
 */
const Nucleus = (props) => {
  const moment = require("moment");
  const [videoInfo, setVideoInfo] = useState(
    // "https://emtempupload.s3.ap-south-1.amazonaws.com/emnuclear_player/symmetry.mp4"
    "http://developer.extramarks.com/uploads/staticvideo/total-learning-summit-Jaipur.mp4"
  );
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const theme = useTheme();

  const startTime = moment().toDate().getTime();
  const [contentEndTime, setContentEndTime] = useState(0);
  const { isLoginUserData } = useSelector((state) => state.login);
  const contentDetail = useSelector((state) => state.dashboard.contentDetail);
  const { freemiumDetail } = useSelector((state) => state.freemium);
  const dashboardReduxData = useSelector(
    (state) => state.dashboard.boardClassData
  );
  const freemiumModelArray = useSelector(
    (state) => state.freemium.freemiumArray
  );
  const [themeData, setThemeData] = useState("AppDashboard day-theme");
  const [isOpen, setOpen] = useState(true);
  const { signup } = useSelector((state) => state);
  const { boardList } = signup;
  const [isPopupOpen, setPopupOpen] = useState(true);
  const [isNavOpen, setNavOpen] = useState(false);
  const lptDetail = useSelector((state) => state.dashboard.lptDetail);

  var iscousecontent;

  // if (props.location.state.iscousecontent) {
  //   iscousecontent = props.location.state.iscousecontent;
  // } else {
  //   iscousecontent = false;
  // }

  // useEffect(() => {
  //   if (props.location.state.selectedTab) {
  //     lptDetail.default_screen = props.location.state.selectedTab;
  //     dispatch(setLptDetail(lptDetail));
  //   }
  // }, [lptDetail]);

  useEffect(() => {
    dispatch(
      setProgressUpdateStatus({
        status: false,
        calledFrom: "player",
      })
    );
    let accessedContentAnalytics = document.getElementById(
      "accessed_content_analytics"
    );
    accessedContentAnalytics.click();

    setThemeData(getCurrentTheme);
  }, []);

  const navigateToChapterScreen = () => {
    if (lptDetail.topic_name) {
      history.go(-4);
      history.replace("/chapter-listing");
    } else {
      history.go(-2);
      history.replace("/chapter-listing");
    }
  };

  const navigateToTopic = () => {
    if (lptDetail.topic_name) {
      history.go(-3);
      history.replace("/topic-listing");
    } else {
      moveBack();
    }
  };

  const moveBack = () => {
    history.goBack();
  };
  console.log("reachin nucleuse");

  console.log("yooo ", videoInfo);

  useEffect(() => {
    console.log("location at nucleus: ", location);
    if (location.state === undefined || location.state.url === undefined) {
      return;
    }
    const _videoinfo = location.state.url;
    console.log("videoinfo at nucleus: ", _videoinfo);
    setVideoInfo(_videoinfo);
  }, [videoInfo]);

  useEffect(() => {
    console.log("nucleus mounted");
    return () => {
      if (!iscousecontent) {
        dispatch(showLoaderInLpt(true));
        handleBackPress();
      }
    };
  }, []);

  const handleFreemiumCount = () => {
    console.log("Nucleus::::freemium detail", freemiumDetail);
    if (freemiumDetail && freemiumDetail.freemiumContentCount > 0) {
      let addToFreemium = true; // initial value
      let addSameItem = false;
      let position = -1;
      let elapsedTimeInSeconds = 0;
      let freemiumModel = {};

      let contentConsumeTime = moment().toDate().getTime() - startTime;
      elapsedTimeInSeconds = moment.duration(contentConsumeTime).seconds();

      let contentId = contentDetail.contentId;
      let chapterId = props.location.state.chapterId;

      console.log("Nucleus::::", "freemium array exists ", freemiumModelArray);

      // if array already exists
      if (freemiumModelArray.length > 0) {
        for (let i = 0; i < freemiumModelArray.length; i++) {
          let value = freemiumModelArray[i];
          let contentIdFromModel = value.contentId + "";
          if (
            contentIdFromModel.indexOf(contentId) != -1 &&
            value.chapterId == chapterId
          ) {
            addSameItem = false;
            addToFreemium = false;
            position = i;
            break;
          } else if (
            value.chapterId == chapterId &&
            contentIdFromModel !== contentId
          ) {
            addToFreemium = false;
            addSameItem = true;
            position = i;
            break;
          } else {
            addToFreemium = true;
          }
        }
      }

      if (addToFreemium) {
        freemiumModel["chapterId"] = chapterId; //  add chap id here
        freemiumModel["contentId"] = contentId; // add contentId here

        // add to freemium only when user has consumed content > 30s
        if (
          freemiumDetail.contentMinPlaybackTime &&
          freemiumDetail.contentMinPlaybackTime !== "null"
        ) {
          if (elapsedTimeInSeconds > freemiumDetail.contentMinPlaybackTime) {
            freemiumModel[
              "freemiumContentCount"
            ] = --freemiumDetail.freemiumContentCount;
            freemiumModel[
              "freemiumTotalCount"
            ] = ++freemiumDetail.freemiumTotalCount;
          } else {
            freemiumModel["freemiumContentCount"] =
              freemiumDetail.freemiumContentCount;
            freemiumModel[
              "freemiumTotalCount"
            ] = ++freemiumDetail.freemiumTotalCount;
          }
        }
        freemiumModelArray.push(freemiumModel);

        console.log("Nucleus::::this is a new item", freemiumModelArray);
      } else if (addSameItem) {
        freemiumModel = freemiumModelArray[position];
        if (freemiumModel.contentId != contentId) {
          freemiumModel.contentId = freemiumModel.contentId + "," + contentId;
        }
        if (
          freemiumDetail.contentMinPlaybackTime &&
          freemiumDetail.contentMinPlaybackTime !== "null"
        ) {
          if (elapsedTimeInSeconds > freemiumDetail.contentMinPlaybackTime) {
            freemiumModel[
              "freemiumContentCount"
            ] = --freemiumDetail.freemiumContentCount;
            freemiumModel[
              "freemiumTotalCount"
            ] = ++freemiumDetail.freemiumTotalCount;
          } else {
            freemiumModel["freemiumContentCount"] =
              freemiumDetail.freemiumContentCount;
            freemiumModel[
              "freemiumTotalCount"
            ] = ++freemiumDetail.freemiumTotalCount;
          }
        }

        freemiumModelArray.splice(position, 0, freemiumModel);

        console.log(
          "Nucleus::::add same item is true , so we are updating this item",
          freemiumModelArray
        );
      } else {
        freemiumModel = freemiumModelArray[position];

        freemiumModel.freemiumTotalCount = ++freemiumDetail.freemiumTotalCount;
        if (
          freemiumDetail.contentMinPlaybackTime &&
          freemiumDetail.contentMinPlaybackTime !== "null"
        ) {
          freemiumModel.freemiumContentCount = --freemiumDetail.freemiumContentCount;
          if (elapsedTimeInSeconds > freemiumDetail.contentMinPlaybackTime) {
          }
        }
        freemiumModelArray.splice(position, 0, freemiumModel);

        console.log("Nucleus::::this is the third case", freemiumModelArray);
      }

      // save this freemium model array in redux
      // this will be accessed in lpt learn/ practice and test

      console.log(
        "Nucleus::::elapsed time =",
        elapsedTimeInSeconds,
        "freemium array",
        freemiumModelArray
      );
      console.log("Nucleus::::freemium model  = ", freemiumModel);
      dispatch(updateFreemiumArray(freemiumModelArray));
    }
  };

  const handleBackPress = () => {
    let closeTime = moment().toDate().getTime();
    let contentConsumeTime = closeTime - startTime;
    let tempTime = moment.duration(contentConsumeTime);
    let h = tempTime.hours();
    let min = tempTime.minutes();
    let sec = tempTime.seconds();

    let overallTime =
      h +
      ":" +
      (min > 10 ? min : "0" + min) +
      ":" +
      (sec > 10 ? sec : "0" + sec);
    console.log("overall time = " + overallTime);
    setContentEndTime(closeTime);
    sendVideoInfo(overallTime);
  };

  const sendVideoInfo = (overallTime) => {
    let obj = {
      user_id: isLoginUserData.content.user_id,
      learning_mode: contentDetail.learningMode,
      board_id: props.location.state.boardId,
      container_id: JSON.stringify(props.location.state.chapterId),
      service_id: JSON.stringify(contentDetail.serviceId),
      totalTime: overallTime,
      content_id: JSON.stringify(contentDetail.contentId),
      product_name: "Learning App",
      app_version: "6.4.9.2",
      os: "Android",
      os_version: "9",
      api_key: APP_CONSTANTS.API_KEY,
      checksum: "",
    };

    let checkSum = md5(
      obj.user_id +
        ":" +
        obj.learning_mode +
        ":" +
        obj.board_id +
        ":" +
        obj.container_id +
        ":" +
        obj.service_id +
        ":" +
        obj.totalTime +
        ":" +
        obj.content_id +
        ":" +
        obj.product_name +
        ":" +
        obj.app_version +
        ":Android:" +
        obj.os_version +
        ":" +
        obj.api_key +
        ":" +
        APP_CONSTANTS.SALT
    );

    obj.checksum = checkSum;
    console.log("progress report api    ", obj);

    const instance = axios.create({
      baseURL: Url.BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    instance
      .post(Url.BASE_URL + Url.ADD_PROGRESS_REPORT, obj)
      .then((response) => {
        console.log("response  ###### Nucleus    ", response.data);
        if (response.data && response.data.status === 1) {
          // dispatch(setContentConsumeTime(""));
          handleFreemiumCount();
          dispatch(
            setProgressUpdateStatus({
              status: true,
              calledFrom: "player",
            })
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //    //var url="https://emtempupload.s3.ap-south-1.amazonaws.com/emnuclear_player/symmetry.mp4"

  const classes = useStyles();
  // const [count, setCount] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [timeDisplayFormat, setTimeDisplayFormat] = React.useState("normal");
  const [bookmarks] = useState([]);
  const [state, setState] = useState({
    pip: false,
    playing: true,
    controls: false,
    light: false,
    muted: false,
    played: 0,
    duration: 0,
    playbackRate: 1.0,
    volume: 1,
    loop: false,
    seeking: false,
  });

  var playerRef = useRef(null);
  var playerContainerRef = useRef(null);
  var controlsRef = useRef(null);
  var canvasRef = useRef(null);
  const {
    playing,
    light,
    muted,
    loop,
    playbackRate,
    pip,
    played,
    volume,
  } = state;

  // useEffect(()=>{
  //   convertToMarks()
  // })

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setState({ ...state, playing: !state.playing });
    }
  };
  const handlePlayPause = () => {
    setState({ ...state, playing: !state.playing });
  };

  const handleRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
  };

  const handleFastForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
  };

  //Slide Reverse & forward

  const handleReverseslide = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 40);
  };

  const handleFastFocrwardslide = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 40);
  };

  const handleProgress = (changeState) => {
    try {
      if (count > 3) {
        controlsRef.current.style.visibility = "hidden";
        count = 0;
      }
      if (controlsRef.current.style.visibility === "visible") {
        count += 1;
      }
      if (!state.seeking) {
        setState({ ...state, ...changeState });
      }
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  const handleSeekChange = (e, newValue) => {
    console.log({ newValue });
    setState({ ...state, played: parseFloat(newValue / 100) });
  };

  const handleSeekMouseDown = (e) => {
    setState({ ...state, seeking: true });
  };

  const handleSeekMouseUp = (e, newValue) => {
    console.log({ value: e.target });
    setState({ ...state, seeking: false });
    // console.log(sliderRef.current.value)
    playerRef.current.seekTo(newValue / 100, "fraction");
  };

  const handleDuration = (duration) => {
    setState({ ...state, duration });
  };

  const handleVolumeSeekDown = (e, newValue) => {
    setState({ ...state, seeking: false, volume: parseFloat(newValue / 100) });
  };
  const handleVolumeChange = (e, newValue) => {
    // console.log(newValue);
    setState({
      ...state,
      volume: parseFloat(newValue / 100),
      muted: newValue === 0 ? true : false,
    });
  };

  const toggleFullScreen = () => {
    if (screenful.isEnabled) screenful.toggle(playerContainerRef.current);
  };

  const handleMouseMove = () => {
    console.log("mousemove");
    try {
      controlsRef.current.style.visibility = "visible";
      count = 0;
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  const hanldeMouseLeave = () => {
    try {
      controlsRef.current.style.visibility = "hidden";
      count = 0;
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  const handleDisplayFormat = () => {
    setTimeDisplayFormat(
      timeDisplayFormat === "normal" ? "remaining" : "normal"
    );
  };

  const handlePlaybackRate = (rate) => {
    setState({ ...state, playbackRate: rate });
  };

  const hanldeMute = () => {
    setState({ ...state, muted: !state.muted });
  };

  const currentTime =
    playerRef && playerRef.current
      ? playerRef.current.getCurrentTime()
      : "00:00";

  const duration =
    playerRef && playerRef.current ? playerRef.current.getDuration() : "00:00";
  const elapsedTime1 =
    timeDisplayFormat === "normal"
      ? format(currentTime)
      : `-${format(duration - currentTime)}`;

  const totalDuration = format(duration);

  const elapsedTime = elapsedTime1 + " / " + totalDuration;

  const [update, forceUpdate] = useState(false);

  if (screenful.isEnabled) {
    screenful.on("change", () => {
      forceUpdate(!update);
    });
  }
  const controller = () => {
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
      <div
        ref={controlsRef}
        className={`hello ` + classes.controlsWrapper}
        onKeyPress={(e) => handleKeyPress(e)}
      >
        <Grid className={classes.nucleusControlsContainer}>
          <Grid className="nucleus-controls-body">
            <Grid item>
              <Typography variant="h5" style={{ color: "#fff" }}></Typography>
            </Grid>
            {
              <Grid item alignItems="center">
                <IconButton
                  // onClick={() => setState({ ...state, muted: !state.muted })}
                  onClick={hanldeMute}
                  className={`${classes.bottomIcons} ${classes.volumeButton}`}
                >
                  {muted ? (
                    <VolumeMute fontSize="large" />
                  ) : volume > 0.5 ? (
                    <VolumeUp fontSize="large" />
                  ) : (
                    <VolumeDown fontSize="large" />
                  )}
                </IconButton>
                <Slider
                  min={0}
                  max={100}
                  value={muted ? 0 : volume * 100}
                  onChange={handleVolumeChange}
                  aria-labelledby="input-slider"
                  className={classes.volumeSlider}
                  onMouseDown={handleSeekMouseDown}
                  onChangeCommitted={handleVolumeSeekDown}
                />
                <IconButton
                  onClick={toggleFullScreen}
                  className={classes.bottomIcons}
                >
                  {screenful.isEnabled && screenful.isFullscreen ? (
                    <FullscreenExitIcon fontSize="large" />
                  ) : (
                    <FullScreen fontSize="large" />
                  )}
                </IconButton>
              </Grid>
            }
          </Grid>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item xs={12}>
              <div
                className="pretto_slider_custom_mob"
                style={{
                  marginLeft: "20px",
                  marginRight: "20px",
                  marginBottom: "-10px",
                }}
              >
                <PrettoSlider
                  //marks={marks}
                  className="nucleus-seek-slider"
                  min={0}
                  max={100}
                  //Tooltip hide
                  // ValueLabelComponent={(props) => (
                  //   <ValueLabelComponent {...props} value={elapsedTime} />
                  // )}
                  aria-label="custom thumb label"
                  value={played * 100}
                  onChange={handleSeekChange}
                  onMouseDown={handleSeekMouseDown}
                  onChangeCommitted={handleSeekMouseUp}
                  onDuration={handleDuration}
                />
              </div>
            </Grid>
            <Grid item>
              <Grid container alignItems="center">
                <IconButton
                  onClick={handleRewind}
                  className={classes.controlIcons}
                  aria-label="rewind"
                >
                  {/* <FastRewindIcon
                    className={classes.controlIcons}
                    fontSize="large"
                  /> */}
                  <Replay10Icon
                    className={classes.controlIcons}
                    fontSize="large"
                  />
                </IconButton>
                <IconButton
                  onClick={handlePlayPause}
                  className={classes.controlIcons}
                  aria-label="play"
                >
                  {playing ? (
                    <PauseIcon fontSize="inherit" />
                  ) : (
                    <PlayArrowIcon fontSize="inherit" />
                  )}
                </IconButton>
                <IconButton
                  onClick={handleFastForward}
                  className={classes.controlIcons}
                  aria-label="forward"
                >
                  {/* <FastForwardIcon fontSize="inherit" /> */}
                  <Forward10Icon fontSize="inherit" />
                </IconButton>
                {/* <IconButton
                  onClick={handleReverseslide}
                  className={classes.controlIcons}
                  aria-label="rewind"
                >
                  <FastRewindIcon
                    className={classes.controlIcons}
                    fontSize="inherit"
                  />
                </IconButton>
                <IconButton
                  onClick={handleFastFocrwardslide}
                  className={classes.controlIcons}
                  aria-label="forward"
                >
                  <FastForwardIcon fontSize="inherit" />
                </IconButton> */}
                <Button variant="text">
                  <Typography
                    variant="body1"
                    style={{ color: "#fff", marginLeft: 16 }}
                  >
                    {elapsedTime}
                  </Typography>
                </Button>
              </Grid>
            </Grid>
            <Grid item>
              <Button
                onClick={handleClick}
                aria-describedby={id}
                className={classes.bottomIcons}
                variant="text"
              >
                <Typography>{playbackRate}X</Typography>

                {open ? (
                  <ExpandLessIcon fontSize="24px" marginLeft="15px" />
                ) : (
                  <ExpandMoreIcon fontSize="24px" marginLeft="15px" />
                )}
              </Button>
              <Popover
                container={
                  controlsRef === undefined ? null : controlsRef.current
                }
                open={open}
                id={id}
                onClose={handleClose}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Grid container direction="column-reverse">
                  {[0.5, 1, 1.5, 2].map((rate) => (
                    <Button
                      className="speed_wrap"
                      key={rate}
                      //   onClick={() => setState({ ...state, playbackRate: rate })}
                      onClick={() => handlePlaybackRate(rate)}
                      variant="text"
                    >
                      <span className="speed_tick_icon">
                        {rate === playbackRate ? (
                          <CheckIcon fontSize="inherit" />
                        ) : null}
                      </span>
                      <Typography
                        color={rate === playbackRate ? "secondary" : "inherit"}
                      >
                        {`${rate}x`}
                      </Typography>
                    </Button>
                  ))}
                </Grid>
              </Popover>
            </Grid>
          </Grid>
        </Grid>
        {/*  */}
        <Grid container style={{ marginTop: -180 }} spacing={3}>
          {bookmarks.map((bookmark, index) => (
            <Grid key={index} item>
              <Paper
                onClick={() => {
                  playerRef.current.seekTo(bookmark.time);
                  controlsRef.current.style.visibility = "visible";

                  setTimeout(() => {
                    controlsRef.current.style.visibility = "hidden";
                  }, 1000);
                }}
                elevation={3}
              >
                <img crossOrigin="anonymous" src={bookmark.image} />
                <Typography variant="body2" align="center">
                  bookmark at {bookmark.display}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <canvas ref={canvasRef} />
        {/*  */}
      </div>
    );
    // }
    // );
  };
  console.log(("printi small screen ", props.location.state.smallScreen));
  if ((props.location.state.smallScreen = "true")) {
    return (
      <Container maxWidth="md" className="m-0">
        <p className="center-container next-page heading_bold">
          {/* {props.location.state.title} */}
          Small Screen
        </p>

        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={hanldeMouseLeave}
          ref={playerContainerRef}
          className={classes.playerWrapper}
        >
          <ReactPlayer
            ref={playerRef}
            width="100%"
            height="100%"
            url={videoInfo}
            pip={pip}
            playing={playing}
            controls={false}
            light={light}
            loop={loop}
            playbackRate={playbackRate}
            volume={volume}
            muted={muted}
            onProgress={handleProgress}
            //Hide defult player of Ios
            playsinline
          />
          {controller()}
        </div>
      </Container>
    );
  }
  return (
    <div className={themeData}>
      {isLoginUserData.content?.user_type === "Student" ||
      Object.keys(isLoginUserData).length === 0 ? (
        <AppDrawer
          isDrawerOpen={isOpen}
          user_name={
            isLoginUserData.content
              ? isLoginUserData.content.display_name
              : "Guest"
          }
          user_pic={
            isLoginUserData.content
              ? isLoginUserData.content.user_photo
              : "//emstage.extramarks.com/images/website_v5/avatar_v5.png"
          }
          user_type={
            isLoginUserData.content
              ? isLoginUserData.content.user_type
              : "Student"
          }
          showPopupRequest={"undefined"}
        />
      ) : (
        <AppDrawerTeacher
          isDrawerOpen={isOpen}
          user_name={isLoginUserData.content.display_name}
          user_pic={isLoginUserData.content.user_photo}
          user_type={isLoginUserData.content.user_type}
        />
      )}

      <div className="dashboardContent edited_class">
        <AppHeader
          isDrawerOpen={isNavOpen}
          isPopupOpen={false}
          boardClassData={dashboardReduxData}
          boardListProp={boardList}
          navigationStatus={() => navigateToDashboard(history, isLoginUserData)}
        />

        <div className="mainBg-Container">
          <div className="mainBg-Content customized">
            <div className="mainBg nucleus-player-page star-theme">
              <div className="d-flex">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-10 ml-auto mr-auto">
                  <div className="top-heading customized_Nucleus_heading mt10 mb10">
                    <img
                      className="back-btn-icon"
                      onClick={() => moveBack()}
                      src={backIcon}
                      alt="back"
                    />
                    <span
                      className="center-container"
                      onClick={() =>
                        navigateToDashboard(history, isLoginUserData)
                      }
                    >
                      {"Study"}
                    </span>
                    <span className="breadcrumb-icon center-container" />
                    {!iscousecontent && (
                      <>
                        <span
                          className="center-container"
                          onClick={() => navigateToChapterScreen()}
                        >
                          {lptDetail.subject_name}
                        </span>
                        <span className="breadcrumb-icon center-container" />
                        <span
                          className="center-container next-page"
                          onClick={() => navigateToTopic()}
                        >
                          {lptDetail.chapter_name}
                        </span>
                        {lptDetail.topic_name && (
                          <>
                            <span className="breadcrumb-icon center-container" />
                            <span
                              className="center-container next-page"
                              onClick={() => moveBack()}
                            >
                              {lptDetail.topic_name}
                            </span>
                            {/* <span className="breadcrumb-icon center-container" /> */}
                          </>
                        )}
                      </>
                    )}
                    {/* <span className="center-container next-page">
                      {props.location.state.title}
                    </span> */}
                    <a
                      id="accessed_content_analytics"
                      style={{ display: "none" }}
                      className="accessed_content"
                      onClick={() =>
                        console.log("hello analytics accessed content")
                      }
                    />
                  </div>
                  <AppBar position="fixed"></AppBar>
                  <Toolbar />
                  <Container maxWidth="md" className="m-0">
                    <p className="center-container next-page heading_bold">
                      {/* {props.location.state.title} */}
                      Code to be uncommented here
                    </p>

                    <div
                      onMouseMove={handleMouseMove}
                      onMouseLeave={hanldeMouseLeave}
                      ref={playerContainerRef}
                      className={classes.playerWrapper}
                    >
                      <ReactPlayer
                        ref={playerRef}
                        width="100%"
                        height="100%"
                        url={videoInfo}
                        pip={pip}
                        playing={playing}
                        controls={false}
                        light={light}
                        loop={loop}
                        playbackRate={playbackRate}
                        volume={volume}
                        muted={muted}
                        onProgress={handleProgress}
                        //Hide defult player of Ios
                        playsinline
                      />
                      {controller()}
                    </div>
                  </Container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Nucleus;
