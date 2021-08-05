import { AimOutlined } from "@ant-design/icons";
import { Select } from "antd";
//import strings from "./LocaleSignUp";
import * as APP_CONSTANTS from "constants/appConstats";
import get from "lodash/get";
import Moment from "moment";
import React, { Component, lazy } from "react";
import {
  Dropdown,
  DropdownButton,
  Form,
  InputGroup,
  ListGroup,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Geocode from "react-geocode";
import { connect } from "react-redux";
import {
  changePassword,
  getCityList,
  getSchoolList,
  getStateList,
} from "redux/actions";
import { isNumberKey, removeNA } from "utils/Utilities";
import LazyLoadHoc from "utils/WrapperHoc";
import strings from "../Webpages/LoginModule/LocaleSignUp";
import tickIcon from "./em_resources/tick.png";
import untickIcon from "./em_resources/untick.png";
import "./Profiles.css";
const ProctoringDetailsMain = lazy(() => import("./ProctoringDetails"));
const ProctoringDetails = LazyLoadHoc(ProctoringDetailsMain);
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <button
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
        {children} {" "}
  </button>
));
const base64 = require("base-64");

const CustomMenu = React.forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    return (
      <div ref={ref} style={style} aria-labelledby={labeledBy}>
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter((child) =>
            child.props.children.toLowerCase()
          )}
        </ul>
      </div>
    );
  }
);

const md5 = require("js-md5");
const { Option } = Select;
//const { isLoginUserData } = useSelector((state) => state.login);
class ProfileDetails extends Component {
  constructor(props) {
    super(props);

    let customBoardsArray = [
      {
        board_id: 596,
        board_name: "JEE Mains",
        course_type: [
          {
            course_id: 1,
            course_name: "JEE - Main",
          },
          {
            course_id: 2,
            course_name: "JEE - Advanced",
          },
        ],
        classes: [
          {
            class_id: 673578,
            class_name: "Class 11",
            rack_type_id: 3,
            enable: 1,
          },
          {
            class_id: 673579,
            class_name: "Class 12",
            rack_type_id: 3,
            enable: 1,
          },
          {
            class_id: 768498,
            class_name: "Class 12+",
            rack_type_id: 3,
            enable: 1,
          },
        ],
      },
      {
        board_id: 445,
        board_name: "MEDICAL",
        course_type: [
          {
            course_id: 4,
            course_name: "NEET",
          },
        ],
        classes: [
          {
            class_id: 458453,
            class_name: "Class XI",
            rack_type_id: 3,
            enable: 1,
          },
          {
            class_id: 458454,
            class_name: "Class XII",
            rack_type_id: 3,
            enable: 1,
          },
          {
            class_id: 468880,
            class_name: "Class XII+",
            rack_type_id: 3,
            enable: 1,
          },
        ],
      },
    ];

    this.state = {
      name: this.props.currentState.firstName,
      school: this.props.currentState.school_name,
      nameActive: true,
      schoolActive: true,
      classTeacherName: this.props.currentState.classTeacherName,
      classTeacherNameActive: false,
      birthday: this.props.currentState.dob,
      birthdayActive: true,
      mobile: this.props.currentState.mobile,
      email: this.props.currentState.email,
      gender: this.props.currentState.gender,
      genderActive: true,
      city: this.props.currentState.city,
      pincode: this.props.currentState.postalcode,
      address: this.props.currentState.address,
      state_id: this.props.currentState.state_id,
      state: this.props.currentState.state,
      cityActive: true,
      isEditable: this.props.currentState.isEditEnabled,
      countryid: this.props.currentState.country_id,
      country: this.props.currentState.country,
      countryList: this.props.countryList,
      stateList: this.props.stateList,
      filteredCityList: this.props.cityList,
      isStateSelected: false,
      isBoardSelected: false,
      isClassSelected: false,
      isGenderSelected: false,
      boardList: this.props.boardList[0].boards_class_detail,
      selectedBoard: {
        id: this.props.currentState.customBoardId,
        name: this.props.currentState.board_name,
      },
      selectedClass: {
        id: this.props.currentState.class_id,
        name: this.props.currentState.class_name,
      },
      selectedCourse: {
        id: "",
        name: "",
      },
      genderList: [
        { gender: "Male", id: 1 },
        { gender: "Female", id: 2 },
        { gender: "Others", id: 3 },
      ],
      customBoardClass: customBoardsArray,
      error: this.props.currentState.error,
      classList: [],
      schoolID: this.props.currentState.school_code,
      cityID: this.props.currentState.city_id,
      isSchoolSelected: false,
      isCitySelected: false,
      isCountrySelected: false,
      password: "",
      newPassword: "",
      confirmPassword: "",
      passwordError: "",
      isTick: this.props.currentState.allowingParentToManageSchedule,
      shouldOpenCalender: false,
      selectedCustomBoard: this.props.currentState.selectedCustomBoard,
      courceName: customBoardsArray.find(
        (item) => item.board_id == this.props.currentState.customBoardId
      )
        ? "Course"
        : "Board",
      isGettingLocation: false,
      coordinate: {
        lat: "",
        long: "",
      },
      isCourseSelected: false,
      shouldShowCourseFiels:
        this.props.currentState.class_name == "XI" ||
        this.props.currentState.class_name == "XII"
          ? true
          : false,
    };
    Geocode.setApiKey(APP_CONSTANTS.REACT_APP_GEOCODE_KEY ?? "");
    Geocode.setLanguage("en");
    this.getschoolList();
    this.getCityList();
    this.getStateList();
    if (this.props.currentState.board_id.length > 0) {
      this.filterClassList(this.props.currentState.board_id);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      prevState.currentState != nextProps.currentState &&
      !nextProps.currentState.isEditEnabled
    ) {
      return {
        selectedCustomBoard: nextProps.currentState.selectedCustomBoard,
        name: nextProps.currentState.firstName,
        school: nextProps.currentState.school_name,
        nameActive: true,
        schoolActive: true,
        classTeacherName: nextProps.currentState.classTeacherName,
        classTeacherNameActive: false,
        birthday: nextProps.currentState.dob,
        birthdayActive: true,
        mobile: nextProps.currentState.mobile,
        email: nextProps.currentState.email,
        gender: nextProps.currentState.gender,
        genderActive: true,
        city: nextProps.currentState.city,
        state_id: nextProps.currentState.state_id,
        state: nextProps.currentState.state,
        cityActive: true,
        isEditable: nextProps.currentState.isEditEnabled,
        countryid: nextProps.currentState.country_id,
        country: nextProps.currentState.country,
        countryList: nextProps.countryList,
        stateList: nextProps.stateList,
        isStateSelected: false,
        isBoardSelected: false,
        isClassSelected: false,
        isGenderSelected: false,
        boardList: nextProps.boardList[0].boards_class_detail,
        selectedBoard: {
          id: nextProps.currentState.customBoardId,
          name: nextProps.currentState.board_name,
        },
        selectedClass: {
          id: nextProps.currentState.class_id,
          name: nextProps.currentState.class_name,
        },
        error: nextProps.currentState.error,
        classList: [],
        schoolID: nextProps.currentState.school_code,
        cityID: nextProps.currentState.city_id,
        isSchoolSelected: false,
        isCitySelected: false,
        isCountrySelected: false,
        password: "",
        newPassword: "",
        confirmPassword: "",
        passwordError: "",
        isTick: nextProps.currentState.allowingParentToManageSchedule,
      };
    }

    return null;
  }

  getClassNameByRoman = (className) => {
    switch (className) {
      case "XI":
        return "11";
        break;
      case "XII":
        return "12";
        break;
      case "XII+":
        return "12+";
        break;
      default:
        return className;
        break;
    }
  };

  getStateList() {
    let obj = {
      country_id: this.state.countryid,
      apikey: APP_CONSTANTS.API_KEY,
      checksum: "",
    };
    let checkSum = md5(
      obj.country_id + ":" + obj.apikey + ":" + APP_CONSTANTS.SALT
    );

    obj.checksum = checkSum;
    this.props.getStateList(obj);
  }
  showHideCalender = () => {
    this.setState({ shouldOpenCalender: !this.state.shouldOpenCalender });
  };
  getDobDate = (dob) => {
    this.setState({ birthday: dob });
    console.log(this.state.birthday);
  };
  getschoolList() {
    let obj = {
      text: this.state.school ? this.state.school : "",
      ipaddress: "",
      city: "",
      offset: "5",
      apikey: APP_CONSTANTS.API_KEY,
      checksum: "",
    };
    let checkSum = md5(
      obj.text +
        ":" +
        obj.ipaddress +
        ":" +
        obj.city +
        ":" +
        obj.offset +
        ":" +
        obj.apikey +
        ":" +
        APP_CONSTANTS.SALT
    );
    obj.checksum = checkSum;
    this.props.getSchoolList(obj);
  }

  getCityList = () => {
    let obj = {
      action: "city",
      state_id: this.state.state_id,
      city_id: "",
      country_id: this.state.countryid,
      apikey: APP_CONSTANTS.API_KEY,
      checksum: "",
    };
    let checkSum = md5(
      obj.action +
        ":" +
        obj.state_id +
        ":" +
        "" +
        ":" +
        obj.country_id +
        ":" +
        obj.apikey +
        ":" +
        APP_CONSTANTS.SALT
    );

    obj.checksum = checkSum;
    this.props.getCityList(obj);
  };

  changePassword = () => {
    const { password, newPassword, confirmPassword } = this.state;
    if (!password) {
      this.setState({ passwordError: "Please fill current password." });
    } else if (!newPassword) {
      this.setState({ passwordError: "Please fill new password." });
    } else if (!confirmPassword) {
      this.setState({ passwordError: "Please fill confirm password." });
    } else if (confirmPassword != newPassword) {
      this.setState({
        passwordError: "New password and confirm password does not match.",
      });
    } else {
      let { adjustData, isLoginUserData } = this.props;
      this.setState({ passwordError: "" });
      let data = {
        action: "change_password",
        device_id: adjustData.device_id ? adjustData.device_id : "",
        app_name: "Learning App",
        source: adjustData.platform ? adjustData.platform : "website",
        operating_system_version: "",
        app_version: adjustData.app_version ? adjustData.app_version : "",
        change_pwd_details: {
          user_id: isLoginUserData.content.user_id,
          oldpwd: password,
          newpwd: newPassword,
        },
        api_details: {
          apikey: APP_CONSTANTS.API_KEY,
          checksum: "",
        },
      };

      data.api_details.checksum = md5(
        `${data.action}:${data.app_name}:${data.change_pwd_details.user_id}:${data.change_pwd_details.oldpwd}:${data.change_pwd_details.newpwd}:${data.api_details.apikey}:${APP_CONSTANTS.SALT}`
      );
      this.props.changePassword(data);
    }
  };
  filterClassList(data) {
    console.log(this.props, "arrarrarrarr");
    if (
      this.state.boardList != undefined &&
      this.state.boardList.length > 0 &&
      data
    ) {
      let arr = get(this.props, "boardList[0].boards_class_detail", []).filter(
        (menu) => data == menu.id
      );
      console.log(arr, "arrarrarrarr");
      if (arr.length > 0) {
        let totalClasses = arr[0].classes.options;
        if (!this.props.currentState.checkIsMobile) {
          let obj = {};

          if (
            ["CBSE", "ICSE", "CBSE Hindi"].find(
              (boardVal) => boardVal == arr[0].title
            )
          ) {
            console.log("object added", "totalClasses");
            obj = { rack_id: 39, rack_name: "XII+" };
          }

          let newObj = [
            ...new Map(
              [...totalClasses, obj].map((item) => [item["rack_id"], item])
            ).values(),
          ];
          this.setState({
            classList: newObj,
          });
        } else {
          console.log("else");
          let newObj = [...totalClasses];
          this.setState({
            classList: newObj,
          });
        }
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.city !== prevState.city) {
      let newCityList = this.props.cityList.filter((item) =>
        item.city_name.toLowerCase().startsWith(this.state.city.toLowerCase())
      );
      console.log("======", newCityList, "=======");
      newCityList.length > 0
        ? this.setState(
            {
              filteredCityList: newCityList,
            },
            this.handleRightCityUpdate
          )
        : this.setState(
            {
              filteredCityList: newCityList,
            },
            this.handleWrongCityUpdate
          );
    }
  }

  getLocation() {
    this.setState({ isGettingLocation: true });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          coordinate: {
            lat: position.coords.latitude,
            long: position.coords.longitude,
          },
        });

        Geocode.fromLatLng(
          position.coords.latitude,
          position.coords.longitude
        ).then(
          (response) => {
            const address = response.results[0].formatted_address;
            let city, state, country;
            for (
              let i = 0;
              i < response.results[0].address_components.length;
              i++
            ) {
              for (
                let j = 0;
                j < response.results[0].address_components[i].types.length;
                j++
              ) {
                switch (response.results[0].address_components[i].types[j]) {
                  case "locality":
                    city = response.results[0].address_components[i].long_name;
                    break;
                  case "administrative_area_level_1":
                    state = response.results[0].address_components[i].long_name;
                    break;
                  case "country":
                    country =
                      response.results[0].address_components[i].long_name;
                    break;
                }
              }
            }
            // this.setState({
            //   city: city,
            //   country: country,
            //   state: state,
            //   address: address,
            // });
            let city_id_array = this.props.cityList.filter(
              (item) => item.city_name == city
            );
            this.setState(
              {
                city: city,
                country: country,
                state: state,
                address: address,
                state_id: city_id_array.state_id,
                cityID: city_id_array.id,
              },
              () => {
                this.props.updateInfo({
                  ...this.props.currentState,
                  ...{
                    city: this.state.city,
                    country: this.state.country,
                    state: this.state.state,
                    state_id: this.state.state_id,
                    city_id: this.state.cityID,
                    address: this.state.address,
                    error: {
                      errorName: "",
                      errorMessage: "",
                    },
                  },
                });
              }
            );

            console.log(city, state, country);
            console.log(address);
            this.setState({ isGettingLocation: false });
          },
          (error) => {
            console.error(error);
            this.setState({ isGettingLocation: false });
          }
        );
      },
      (error) => {
        alert(error.message);
        this.setState({ isGettingLocation: false });
      }
    );
  }

  render() {
    console.log("this.state.classList", this.state.classList, "data=====");
    console.log(
      "mydate",
      new Date(Moment(this.state.birthday, "DD-MM-YYYY")._d)
    );
    console.log("this.state", this.state);
    console.log(
      "value",
      removeNA(Moment(Date(this.state.birthday)).format("DD-MM-YYYY"))
    );
    let mydate = new Date(Moment(this.state.birthday, "DD-MM-YYYY")._d);
    console.log("value2", removeNA(Moment(mydate).format("DD-MM-YYYY")));
    const classValue = removeNA(
      this.state.selectedClass.name.includes("+")
        ? "XII+"
        : this.state.selectedClass.name
    );
    const selectedGender = removeNA(this.state.gender)
      ? this.state.gender
      : "Please Select Gender";
    const newCityList = this.props.cityList.filter((item) =>
      item.city_name.toLowerCase().startsWith(this.state.city.toLowerCase())
    );
    console.log(newCityList, this.state.filteredCityList);
    const selectedClass = classValue || "Please Select Class";
    const boardPlaceHolder =
      this.state.courceName == "Board" ? "Select Board" : "Select Course";
    const selectedBoard = removeNA(this.state.selectedBoard.name)
      ? this.state.selectedBoard.name
      : boardPlaceHolder;
    const selectedCountry = removeNA(this.state.country)
      ? this.state.country
      : "Enter Country";
    const selectedState = removeNA(this.state.state_id)
      ? this.state.state_id
      : "Enter State";
    const selectedCity = removeNA(this.state.city)
      ? this.state.city
      : "Enter City";
    console.log("board name", this.state.selectedBoard.name);

    return (
      <div className="profileDetails">
        <div className="row">
          <Form.Group className="d-flex profile-details-formgroup">
            <div className="col-sm-3">
              {/* <span>
              <img
                src={logo}
                alt="Logo"
                style={{ height: "30px", width: "30px", marginTop: "15px" }}
              />
            </span> */}
              <span>Name</span>
            </div>
            <div className="col-sm-9">
              <InputGroup hasValidation>
                <Form.Control
                  className={`profile-details-input ${
                    this.props.currentState.isEditEnabled ? "edit-enabled" : ""
                  }`}
                  placeholder={"Enter Name"}
                  autoComplete={"off"}
                  name="name"
                  type="text"
                  value={removeNA(this.state.name).trim()}
                  disabled={
                    this.props.currentState.isEditEnabled ? "" : "disabled"
                  }
                  onChange={(e) => {
                    this.setState({ name: e.target.value });
                    this.handleChange(e);
                  }}
                  isInvalid={this.props.currentState.error.errorName == "name"}
                  // feedback={this.state.this.state.error.errorMessage}
                />

                <Form.Control.Feedback type="invalid">
                  {this.props.currentState.error.errorName == "name" &&
                    this.props.currentState.error.errorMessage}
                </Form.Control.Feedback>
              </InputGroup>
            </div>
          </Form.Group>

          {this.props.currentState.checkIsMobile ? null : (
            <Form.Group className="d-flex profile-details-formgroup">
              <div className="col-sm-3">
                <span>{this.state.courceName}</span>
              </div>
              <div className="col-sm-9 drodown_class_button">
                {/* <InputGroup hasValidation>
                <Form.Control
                  className={`profile-details-input ${
                    this.props.currentState.isEditEnabled ? "edit-enabled" : ""
                  }`}
                  placeholder={
                    this.state.courceName == "Board"
                      ? "Select Board"
                      : "Select Course"
                  }
                  name="board"
                  autoComplete={"off"}
                  type="text"
                  value={removeNA(this.state.selectedBoard.name)}
                  disabled={
                    this.props.currentState.isEditEnabled ? "" : "disabled"
                  }
                  onClick={(e) => {
                    if (this.state.courceName == "Board") {
                      this.setState({
                        boardList: this.props.boardList[0].boards_class_detail,
                      });
                    } else {
                      this.setState({
                        boardList: this.state.customBoardClass,
                      });
                    }
                    this.setState({ isBoardSelected: true });
                  }}
                  onChange={(e) => {
                    this.setState({
                      selectedBoard: {
                        id: e.target.value,
                      },
                    });
                    this.setState({ isBoardSelected: true });
                    //this.setState({ countryid: e.target.value });
                    //this.setState({ isCountrySelected: true });
                    //this.handleChange(e);
                  }}
                  isInvalid={this.props.currentState.error.errorName == "board"}
                />

                <Form.Control.Feedback type="invalid">
                  {this.props.currentState.errorName == "board" &&
                    this.props.currentState.error.errorMessage}
                </Form.Control.Feedback>
              </InputGroup>
              <ListGroup>
                {this.state.isBoardSelected &&
                  this.state.boardList.length > 0 &&
                  this.state.boardList.slice(0, 5).map((item) => {
                    return (
                      <ListGroup.Item
                        onClick={() => {
                          this.setState({ isBoardSelected: false });

                          if (this.state.courceName == "Board") {
                            this.setState(
                              {
                                selectedBoard: {
                                  id: item.id,
                                  name: item.title,
                                },
                              },
                              () => {
                                this.props.updateInfo({
                                  ...this.props.currentState,
                                  ...{
                                    board_id: item.id,
                                    board_name: item.title,
                                  },
                                });
                              }
                            );
                            this.setState({
                              selectedClass: {
                                id: "",
                                name: "",
                              },
                            });
                            this.filterClassList(item.id);
                          } else if (this.state.courceName == "Course") {
                            this.setState(
                              {
                                selectedBoard: {
                                  id: item.board_id,
                                  name: item.board_name,
                                },
                              },
                              () => {
                                console.log(
                                  "x mmmmmmm=",
                                  this.state.selectedClass.name
                                );
                                console.log("x mmmmmmm=", item);

                                let courseObj = item.classes.find(
                                  (menu) =>
                                    menu.class_name.includes(
                                      this.state.selectedClass.name
                                    ) ||
                                    menu.class_name.includes(
                                      this.getClassNameByRoman(
                                        this.state.selectedClass.name
                                      )
                                    )
                                );
                                console.log("x ppppppppp=", courseObj);
                                if (courseObj != undefined) {
                                  this.setState({
                                    selectedCustomBoard: item.board_id,
                                  });
                                  this.props.updateInfo({
                                    ...this.props.currentState,
                                    ...{
                                      course_id: item.course_type[0].course_id,
                                      course_class_id: courseObj.class_id,
                                      selectedCustomBoard: item.board_id,
                                    },
                                  });
                                }
                              }
                            );
                          }
                        }}
                      >
                        {this.state.courceName == "Course"
                          ? "" + item.board_name
                          : "" + item.title}
                      </ListGroup.Item>
                    );
                  })}
              </ListGroup> */}

                {this.props.currentState.errorName == "board" ? (
                  <span>{this.props.currentState.error.errorMessage}</span>
                ) : null}
                <DropdownButton
                  disabled={
                    this.props.currentState.isEditEnabled ? false : true
                  }
                  title={selectedBoard}
                  onClick={(e) => {
                    if (this.state.courceName == "Board") {
                      this.setState({
                        boardList: this.props.boardList[0].boards_class_detail,
                      });
                    } else {
                      this.setState({
                        boardList: this.state.customBoardClass,
                      });
                    }
                    this.setState({ isBoardSelected: true });
                  }}
                  className="new_custom_dropdown new_signup_deropdown profile"
                >
                  {this.state.isBoardSelected &&
                    this.state.boardList.length > 0 &&
                    this.state.boardList.slice(0, 5).map((item) => {
                      return (
                        <Dropdown.Item
                          eventKey={item.id}
                          onClick={() => {
                            this.setState({ isBoardSelected: false });
                            this.setState({ isClassSelected: false });
                            if (this.state.courceName == "Board") {
                              this.setState(
                                {
                                  selectedBoard: {
                                    id: item.id,
                                    name: item.title,
                                  },
                                },
                                () => {
                                  this.props.updateInfo({
                                    ...this.props.currentState,
                                    ...{
                                      class_id: "",
                                      class_name: "",
                                      board_id: item.id,
                                      board_name: item.title,
                                    },
                                  });
                                }
                              );
                              this.setState({
                                selectedClass: {
                                  id: "",
                                  name: "",
                                },
                              });
                              this.filterClassList(item.id);
                            } else if (this.state.courceName == "Course") {
                              this.setState(
                                {
                                  selectedBoard: {
                                    id: item.board_id,
                                    name: item.board_name,
                                  },
                                },
                                () => {
                                  console.log(
                                    "x mmmmmmm=",
                                    this.state.selectedClass.name
                                  );
                                  console.log("x mmmmmmm=", item);

                                  let courseObj = item.classes.find(
                                    (menu) =>
                                      menu.class_name.includes(
                                        this.state.selectedClass.name
                                      ) ||
                                      menu.class_name.includes(
                                        this.getClassNameByRoman(
                                          this.state.selectedClass.name
                                        )
                                      )
                                  );
                                  console.log("x ppppppppp=", courseObj);
                                  if (courseObj != undefined) {
                                    this.setState({
                                      selectedCustomBoard: item.board_id,
                                    });
                                    this.props.updateInfo({
                                      ...this.props.currentState,
                                      ...{
                                        course_id:
                                          item.course_type[0].course_id,
                                        course_class_id: courseObj.class_id,
                                        selectedCustomBoard: item.board_id,
                                      },
                                    });
                                  }
                                }
                              );
                            }
                          }}
                        >
                          {this.state.courceName == "Course"
                            ? "" + item.board_name
                            : "" + item.title}
                        </Dropdown.Item>
                      );
                    })}
                </DropdownButton>
              </div>
            </Form.Group>
          )}
        </div>
        {this.props.currentState.checkIsMobile ? null : (
          <>
            <Form.Group className="d-flex profile-details-formgroup">
              <div className="col-sm-3">
                <span>Class</span>
              </div>
              <div className="col-sm-9 drodown_class_button customized">
                {/* <InputGroup hasValidation>
                  <Form.Control
                    autoComplete={"off"}
                    className={`profile-details-input ${
                      this.props.currentState.isEditEnabled
                        ? "edit-enabled"
                        : ""
                    }`}
                    placeholder={"Enter class"}
                    name="class"
                    type="text"
                    value={removeNA(
                      this.state.selectedClass.name.includes("+")
                        ? "XII+"
                        : this.state.selectedClass.name
                    )}
                    disabled={
                      this.props.currentState.isEditEnabled ? "" : "disabled"
                    }
                    onClick={(e) => {
                      this.filterClassList(
                        this.state.customBoardClass.find(
                          (item) => item.board_id == this.state.selectedBoard.id
                        )
                          ? 180
                          : this.state.selectedBoard.id
                      );
                      this.setState({ isClassSelected: true });
                    }}
                    onChange={(e) => {
                      console.log("Class Value", e.target.value);
                      this.setState({
                        selectedClass: {
                          id: e.target.value,
                          name: e.target.value,
                        },
                      });

                      this.setState({ isClassSelected: true });
                    }}
                    isInvalid={
                      this.props.currentState.error.errorName == "class"
                    }
                  />

                  <Form.Control.Feedback type="invalid">
                    {this.props.currentState.error.errorName == "class" &&
                      this.props.currentState.error.errorMessage}
                  </Form.Control.Feedback>
                </InputGroup>
                <ListGroup>
                  {this.state.isClassSelected &&
                    this.state.classList.length > 0 &&
                    this.state.classList.slice(0, 16).map((item) => {
                      return (
                        <ListGroup.Item
                          onClick={() => {
                            this.setState({ isClassSelected: false });

                            if (
                              item.rack_name == "XI" ||
                              item.rack_name == "XII"
                            ) {
                              this.setState({
                                shouldShowCourseFiels: true,
                                courceName: "Board",
                              });

                              if (
                                this.state.customBoardClass.find(
                                  (item) =>
                                    item.board_name ==
                                    this.state.selectedBoard.name
                                )
                              ) {
                                this.setState({
                                  selectedBoard: {
                                    id: "",
                                    name: "",
                                  },
                                });
                              }
                              this.setState(
                                {
                                  selectedCustomBoard: "",
                                  selectedClass: {
                                    id: item.rack_id,
                                    name: item.rack_name,
                                  },
                                },
                                () => {
                                  console.log("inside XI condition:", item);
                                  this.props.updateInfo({
                                    ...this.props.currentState,
                                    ...{
                                      class_id: item.rack_id,
                                      class_name: item.rack_name,
                                    },
                                  });
                                }
                              );
                            } else if (item.rack_name == "XII+") {
                              this.setState({
                                shouldShowCourseFiels: false,
                                courceName: "Course",
                                boardList: this.state.customBoardClass,
                              });
                              this.setState({
                                selectedBoard: {
                                  id: "",
                                  name: "",
                                },
                              });

                              let arrNewBrd = this.props.boardList[0]
                                .boards_class_detail;
                              if (this.state.boardList != arrNewBrd) {
                                this.setState({
                                  shouldShowCourseFiels: false,
                                  courceName: "Board",
                                  boardList: this.props.boardList[0]
                                    .boards_class_detail,
                                });
                                this.setState({
                                  selectedBoard: {
                                    id: "",
                                    name: "",
                                  },
                                });
                              }
                              this.setState(
                                {
                                  selectedClass: {
                                    id: item.rack_id,
                                    name: item.rack_name,
                                  },
                                },
                                () => {
                                  console.log(
                                    "inside XII+ condition:",
                                    item.rack_id
                                  );
                                  this.props.updateInfo({
                                    ...this.props.currentState,
                                    ...{
                                      class_id: item.rack_id,
                                      class_name: item.rack_name,
                                    },
                                  });
                                }
                              );
                              // this.props.updateInfo({
                              //   ...this.props.currentState,
                              //   ...{
                              //     board_id: 180,
                              //     board_name: "CBSC",
                              //   },
                              // });
                            } else {
                              console.log("inside other condition");
                              this.setState({
                                shouldShowCourseFiels: false,
                                courceName: "Board",
                                boardList: this.props.boardList[0]
                                  .boards_class_detail,
                              });

                              if (
                                this.state.customBoardClass.find(
                                  (item) =>
                                    item.board_name ==
                                    this.state.selectedBoard.name
                                )
                              ) {
                                this.setState({
                                  selectedBoard: {
                                    id: "",
                                    name: "",
                                  },
                                });
                              }

                              let arrNewBrd = this.props.boardList[0]
                                .boards_class_detail;
                              if (this.state.boardList != arrNewBrd) {
                                this.setState({
                                  shouldShowCourseFiels: false,
                                  courceName: "Board",
                                  boardList: this.props.boardList[0]
                                    .boards_class_detail,
                                });
                                this.setState({
                                  selectedBoard: {
                                    id: "",
                                    name: "",
                                  },
                                });
                              }
                              this.setState(
                                {
                                  selectedClass: {
                                    id: item.rack_id,
                                    name: item.rack_name,
                                  },
                                },
                                () => {
                                  this.props.updateInfo({
                                    ...this.props.currentState,
                                    ...{
                                      class_id: item.rack_id,
                                      class_name: item.rack_name,
                                    },
                                  });
                                }
                              );
                            }
                            this.setState({
                              selectedCourse: {
                                id: "",
                                name: "",
                              },
                            });
                          }}
                        >
                          {"" + item.rack_name}
                        </ListGroup.Item>
                      );
                    })}
                </ListGroup> */}

                {this.props.currentState.error.errorName == "class" ? (
                  <span className="">
                    {this.props.currentState.error.errorMessage}
                  </span>
                ) : null}
                <DropdownButton
                  disabled={
                    this.props.currentState.isEditEnabled ? false : true
                  }
                  title={selectedClass}
                  onClick={(e) => {
                    this.filterClassList(
                      this.state.customBoardClass.find(
                        (item) => item.board_id == this.state.selectedBoard.id
                      )
                        ? 180
                        : this.state.selectedBoard.id
                    );
                    this.setState({ isClassSelected: true });
                  }}
                  onSelect={(e) => {
                    {
                      console.log(e);
                    }
                    this.setState(
                      {
                        selectedClass: {
                          id: e,
                          name: e,
                        },
                      },
                      () => {
                        this.props.updateInfo({
                          ...this.props.currentState,
                          ...{
                            class_id: e,
                            class_name: e,
                            course_id: "",
                          },
                        });
                      }
                    );

                    this.setState({ isClassSelected: true });
                  }}
                  className="new_custom_dropdown new_signup_deropdown profile"
                >
                  {this.state.isClassSelected &&
                    this.state.classList.length > 0 &&
                    this.state.classList.slice(0, 16).map((item) => {
                      return (
                        <Dropdown.Item
                          eventKey={item.rack_name}
                          onClick={() => {
                            this.setState({ isClassSelected: false });

                            if (
                              item.rack_name == "XI" ||
                              item.rack_name == "XII"
                            ) {
                              this.setState({
                                shouldShowCourseFiels: true,
                                courceName: "Board",
                              });

                              if (
                                this.state.customBoardClass.find(
                                  (item) =>
                                    item.board_name ==
                                    this.state.selectedBoard.name
                                )
                              ) {
                                this.setState({
                                  selectedBoard: {
                                    id: "",
                                    name: "",
                                  },
                                });
                              }
                              this.setState(
                                {
                                  selectedCustomBoard: "",
                                  selectedClass: {
                                    id: item.rack_id,
                                    name: item.rack_name,
                                  },
                                },
                                () => {
                                  console.log("inside XI condition:", item);
                                  this.props.updateInfo({
                                    ...this.props.currentState,
                                    ...{
                                      class_id: item.rack_id,
                                      class_name: item.rack_name,
                                    },
                                  });
                                }
                              );
                            } else if (item.rack_name == "XII+") {
                              this.setState({
                                shouldShowCourseFiels: false,
                                courceName: "Course",
                                boardList: this.state.customBoardClass,
                              });
                              this.setState({
                                selectedBoard: {
                                  id: "",
                                  name: "",
                                },
                              });

                              let arrNewBrd = this.props.boardList[0]
                                .boards_class_detail;
                              if (this.state.boardList != arrNewBrd) {
                                this.setState({
                                  shouldShowCourseFiels: false,
                                  courceName: "Board",
                                  boardList: this.props.boardList[0]
                                    .boards_class_detail,
                                });
                                this.setState({
                                  selectedBoard: {
                                    id: "",
                                    name: "",
                                  },
                                });
                              }
                              this.setState(
                                {
                                  selectedClass: {
                                    id: item.rack_id,
                                    name: item.rack_name,
                                  },
                                },
                                () => {
                                  console.log(
                                    "inside XII+ condition:",
                                    item.rack_id
                                  );
                                  this.props.updateInfo({
                                    ...this.props.currentState,
                                    ...{
                                      class_id: item.rack_id,
                                      class_name: item.rack_name,
                                    },
                                  });
                                }
                              );
                              // this.props.updateInfo({
                              //   ...this.props.currentState,
                              //   ...{
                              //     board_id: 180,
                              //     board_name: "CBSC",
                              //   },
                              // });
                            } else {
                              console.log("inside other condition");
                              this.setState({
                                shouldShowCourseFiels: false,
                                courceName: "Board",
                                boardList: this.props.boardList[0]
                                  .boards_class_detail,
                              });

                              if (
                                this.state.customBoardClass.find(
                                  (item) =>
                                    item.board_name ==
                                    this.state.selectedBoard.name
                                )
                              ) {
                                this.setState({
                                  selectedBoard: {
                                    id: "",
                                    name: "",
                                  },
                                });
                              }

                              let arrNewBrd = this.props.boardList[0]
                                .boards_class_detail;
                              if (this.state.boardList != arrNewBrd) {
                                this.setState({
                                  shouldShowCourseFiels: false,
                                  courceName: "Board",
                                  boardList: this.props.boardList[0]
                                    .boards_class_detail,
                                });
                                this.setState({
                                  selectedBoard: {
                                    id: "",
                                    name: "",
                                  },
                                });
                              }
                              this.setState(
                                {
                                  selectedClass: {
                                    id: item.rack_id,
                                    name: item.rack_name,
                                  },
                                },
                                () => {
                                  this.props.updateInfo({
                                    ...this.props.currentState,
                                    ...{
                                      class_id: item.rack_id,
                                      class_name: item.rack_name,
                                    },
                                  });
                                }
                              );
                            }
                            this.setState({
                              selectedCourse: {
                                id: "",
                                name: "",
                              },
                            });
                          }}
                        >
                          {"" + item.rack_name}
                        </Dropdown.Item>
                      );
                    })}
                </DropdownButton>
              </div>
            </Form.Group>

            {this.state.shouldShowCourseFiels ? (
              <Form.Group className="d-flex profile-details-formgroup">
                <div className="col-sm-3">
                  <span>Course</span>
                </div>
                <div className="col-sm-9 edited_class">
                  <InputGroup hasValidation>
                    <Form.Control
                      autoComplete={"off"}
                      className={`profile-details-input ${
                        this.props.currentState.isEditEnabled
                          ? "edit-enabled"
                          : ""
                      }`}
                      placeholder={"Enter course"}
                      name="class"
                      type="text"
                      value={removeNA(
                        this.state.customBoardClass.find(
                          (item) =>
                            item.board_id == this.state.selectedCustomBoard
                        )
                          ? this.state.customBoardClass.find(
                              (item) =>
                                item.board_id == this.state.selectedCustomBoard
                            ).board_name
                          : ""
                      )}
                      disabled={
                        this.props.currentState.isEditEnabled ? "" : "disabled"
                      }
                      onClick={(e) => {
                        this.filterClassList(this.state.selectedCourse.id);
                        this.setState({ isCourseSelected: true });
                      }}
                      onChange={(e) => {
                        this.setState({
                          selectedCourse: {
                            id: e.target.value,
                            name: e.target.value,
                          },
                        });
                        this.setState({ isCourseSelected: true });
                      }}
                      isInvalid={
                        this.props.currentState.error.errorName == "course"
                      }
                    />

                    <Form.Control.Feedback type="invalid">
                      {this.props.currentState.error.errorName == "course" &&
                        this.props.currentState.error.errorMessage}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <ListGroup>
                    {this.state.isCourseSelected &&
                      this.state.customBoardClass.length > 0 &&
                      this.state.customBoardClass.slice(0, 5).map((item) => {
                        return (
                          <ListGroup.Item
                            onClick={() => {
                              this.setState({ isCourseSelected: false });

                              this.setState(
                                {
                                  selectedCourse: {
                                    id: item.board_id,
                                    name: item.board_name,
                                  },
                                },
                                () => {
                                  console.log(
                                    "x mmmmmmm=",
                                    this.state.selectedClass.name
                                  );
                                  console.log("x mmmmmmm=", item);

                                  let courseObj = item.classes.find(
                                    (menu) =>
                                      menu.class_name.includes(
                                        this.state.selectedClass.name
                                      ) ||
                                      menu.class_name.includes(
                                        this.getClassNameByRoman(
                                          this.state.selectedClass.name
                                        )
                                      )
                                  );
                                  console.log("x ppppppppp=", courseObj);
                                  if (courseObj != undefined) {
                                    this.setState({
                                      selectedCustomBoard: item.board_id,
                                    });
                                    this.props.updateInfo({
                                      ...this.props.currentState,
                                      ...{
                                        course_id:
                                          item.course_type[0].course_id,
                                        course_class_id: courseObj.class_id,
                                        selectedCustomBoard: item.board_id,
                                      },
                                    });
                                  }
                                }
                              );
                            }}
                          >
                            {"" + item.board_name}
                          </ListGroup.Item>
                        );
                      })}
                  </ListGroup>
                </div>
              </Form.Group>
            ) : null}
          </>
        )}

        <Form.Group className="d-flex profile-details-formgroup">
          <div className="col-sm-3">
            <span>Gender</span>
          </div>
          <div className="col-sm-9 drodown_class_button">
            {/* <InputGroup hasValidation>
              <Form.Control
                autoComplete={"off"}
                className={`profile-details-input ${
                  this.props.currentState.isEditEnabled ? "edit-enabled" : ""
                }`}
                placeholder={"Please select gender"}
                name="gender"
                type="text"
                value={removeNA(this.state.gender)}
                disabled={
                  this.props.currentState.isEditEnabled ? "" : "disabled"
                }
                onClick={(e) => {
                  this.setState({ isGenderSelected: true });
                }}
                onChange={(e) => {
                  this.setState({ gender: e.target.value });

                  this.setState({ isGenderSelected: true });
                }}
                isInvalid={this.props.currentState.error.errorName == "gender"}
              />

              <Form.Control.Feedback type="invalid">
                {this.props.currentState.error.errorName == "gender" &&
                  this.props.currentState.error.errorMessage}
              </Form.Control.Feedback>
            </InputGroup>
            <ListGroup>
              {this.state.genderList.length > 0 &&
                this.state.genderList &&
                this.state.isGenderSelected &&
                this.state.genderList.slice(0, 5).map((item) => {
                  return (
                    <ListGroup.Item
                      onClick={() => {
                        this.setState({ gender: item.gender });
                        this.setState({ isGenderSelected: false });
                        this.props.updateInfo({
                          ...this.props.currentState,
                          ...{ gender: item.gender },
                        });
                      }}
                    >
                      {item.gender}
                    </ListGroup.Item>
                  );
                })}
            </ListGroup> */}
            {this.props.currentState.error.errorName == "gender" ? (
              <span className="">
                {this.props.currentState.error.errorMessage}
              </span>
            ) : null}
            <DropdownButton
              onClick={(e) => {
                this.setState({ isGenderSelected: true });
              }}
              title={selectedGender}
              disabled={this.props.currentState.isEditEnabled ? false : true}
              onSelect={(e) => {
                this.setState({ gender: e });

                this.setState({ isGenderSelected: true });
              }}
              className="new_custom_dropdown new_signup_deropdown profile"
            >
              {/* <Dropdown.Menu as={CustomMenu}> */}
              {this.state.genderList.length > 0 &&
                this.state.genderList &&
                this.state.isGenderSelected &&
                this.state.genderList.slice(0, 5).map((item) => {
                  return (
                    <Dropdown.Item
                      eventKey={item.gender}
                      onClick={() => {
                        this.setState({ gender: item.gender });
                        this.setState({ isGenderSelected: false });
                        this.props.updateInfo({
                          ...this.props.currentState,
                          ...{ gender: item.gender },
                        });
                      }}
                    >
                      {item.gender}
                    </Dropdown.Item>
                  );
                })}
              {/* </Dropdown.Menu> */}
            </DropdownButton>
          </div>
        </Form.Group>

        <Form.Group className="d-flex profile-details-formgroup">
          <div className="col-sm-3">
            <span>DOB</span>
          </div>
          {/* <div className="col-sm-9"> */}
          {/* <div className="col-lg-3 md-form m-2"> */}
          <div className="col-sm-9 editdte">
            <DatePicker
              className={`profile-details-input calnedericon ${
                this.props.currentState.isEditEnabled ? "edit-enabled" : ""
              }`}
              maxDate={new Date().setDate(new Date().getDate() - 1)}
              dateFormat="DD-MM-YYYY"
              value={removeNA(Moment(mydate).format("DD-MM-YYYY"))}
              open={this.state.shouldOpenCalender}
              onClickOutside={this.showHideCalender}
              disabled={this.props.currentState.isEditEnabled ? "" : "disabled"}
              onChange={(date) => {
                this.showHideCalender();
                let convertedDate = Moment(date).format("DD-MM-YYYY");
                this.setState({ birthday: convertedDate });
                this.props.updateInfo({
                  ...this.props.currentState,
                  ...{ dob: convertedDate },
                });
              }}
            />
            {this.props.currentState.error.errorName == "birthday" &&
            this.props.currentState.error.errorMessage ? (
              <span className="dob-error-msg">
                {this.props.currentState.error.errorMessage}
              </span>
            ) : null}
            {this.props.currentState.isEditEnabled ? (
              <span
                className="fa fa-calendar font20"
                onClick={this.showHideCalender}
              />
            ) : null}
            {/* </div> */}
            {/* </div> */}
          </div>
        </Form.Group>

        <Form.Group className="d-flex profile-details-formgroup">
          <div className="col-sm-3">
            <span>School Name/Code</span>
          </div>
          <div className="col-sm-9 edited_class">
            <InputGroup hasValidation>
              <Form.Control
                autoComplete={"off"}
                className={`profile-details-input ${
                  this.props.currentState.isEditEnabled ? "edit-enabled" : ""
                }`}
                placeholder={strings.SIGNUP_SCHOOL}
                name="school"
                type="text"
                value={removeNA(this.state.school).trim()}
                disabled={
                  this.props.currentState.isEditEnabled ? "" : "disabled"
                }
                onChange={(e) => {
                  // this.setState({ school: e.target.value });
                  this.props.updateInfo({
                    ...this.props.currentState,
                    ...{ isSchoolSelected: true },
                  });
                  this.setState({ isSchoolSelected: true });
                  this.setState({ school: e.target.value }, () => {
                    this.props.updateInfo({
                      ...this.props.currentState,
                      ...{ isSchoolSelected: true },
                      ...{
                        school_name: this.state.school,
                        school_code: "",
                      },
                    });
                  });
                  //isSchoolSelected
                  console.log("school typing...");
                  this.getschoolList();
                  //this.handleChange(e);
                }}
                isInvalid={this.props.currentState.error.errorName == "school"}
              />

              <Form.Control.Feedback type="invalid">
                {this.props.currentState.error.errorName == "school" &&
                  this.props.currentState.error.errorMessage}
              </Form.Control.Feedback>
            </InputGroup>
            <ListGroup>
              {this.state.countryid == 99 &&
                this.state.school &&
                this.state.school.length > 0 &&
                this.props.schoolList &&
                this.state.isSchoolSelected &&
                this.props.schoolList.length > 0 &&
                this.props.schoolList.slice(0, 5).map((item) => {
                  return (
                    <ListGroup.Item
                      onClick={() => {
                        // this.setState({ school: item.text });
                        this.setState({ schoolID: item.school_id });
                        this.setState({ isSchoolSelected: false });

                        this.setState({ school: item.text }, () => {
                          this.props.updateInfo({
                            ...this.props.currentState,
                            ...{
                              school_name: item.text,
                              school_code: item.id,
                              isSchoolSelected: false,
                            },
                          });
                        });
                      }}
                    >
                      {item.text}
                      {","} {item.school_address}
                    </ListGroup.Item>
                  );
                })}
            </ListGroup>
          </div>
        </Form.Group>

        <Form.Group className="d-flex profile-details-formgroup">
          <div className="col-sm-3">
            <span>Class Teacher</span>
          </div>
          <div className="col-sm-9">
            <InputGroup hasValidation>
              <Form.Control
                autoComplete={"off"}
                className={`profile-details-input ${
                  this.props.currentState.isEditEnabled ? "edit-enabled" : ""
                }`}
                placeholder={"Class Teacher"}
                name="classTeacher"
                type="text"
                value={removeNA(this.state.classTeacherName).trim()}
                disabled={
                  this.props.currentState.isEditEnabled ? "" : "disabled"
                }
                onChange={(e) => {
                  this.setState({ classTeacherName: e.target.value }, () => {
                    this.props.updateInfo({
                      ...this.props.currentState,
                      ...{
                        classTeacherName: this.state.classTeacherName,
                      },
                    });
                  });

                  this.handleChange(e);
                }}
                isInvalid={this.props.currentState.error.errorName == "teacher"}
              />

              <Form.Control.Feedback type="invalid">
                {this.props.currentState.error.errorName == "teacher" &&
                  this.props.currentState.error.errorMessage}
              </Form.Control.Feedback>
            </InputGroup>
          </div>
        </Form.Group>

        {/* mobile and email space */}

        {/* <Form.Group className="d-flex profile-details-formgroup">
          <div className="col-sm-3">
            <span>Gender</span>
          </div>
          <div className="col-sm-9">
            <InputGroup hasValidation>
              <Form.Control
                className={`profile-details-input ${this.props.currentState.isEditEnabled ? "edit-enabled" : ""}`}
                placeholder={"gender"}
                name="gender"
                type="text"
                value={this.state.gender}
                disabled={
                  this.props.currentState.isEditEnabled ? "" : "disabled"
                }
                onChange={(e) => {
                  this.setState({ gender: e.target.value });
                  this.handleChange(e);
                }}
                isInvalid={this.props.currentState.error.errorName == "gender"}
              />

              <Form.Control.Feedback type="invalid">
                {this.props.currentState.error.errorName == "gender" &&
                  this.props.currentState.error.errorMessage}
              </Form.Control.Feedback>
            </InputGroup>
          </div>
        </Form.Group> */}

        <Form.Group className="d-flex profile-details-formgroup">
          <div className="col-sm-3">
            <span>Address</span>
          </div>
          <div className="col-sm-9">
            <InputGroup hasValidation>
              <Form.Control
                autoComplete={"off"}
                className={`profile-details-input ${
                  this.props.currentState.isEditEnabled ? "edit-enabled" : ""
                }`}
                placeholder={"Enter Address"}
                name="address"
                type="text"
                value={removeNA(this.state.address).trim()}
                disabled={
                  this.props.currentState.isEditEnabled ? "" : "disabled"
                }
                onChange={(e) => {
                  this.setState({ address: e.target.value });
                  this.props.updateInfo({
                    ...this.props.currentState,
                    ...{ address: e.target.value },
                  });
                }}
                isInvalid={this.props.currentState.error.errorName == "address"}
                // feedback={this.state.this.state.error.errorMessage}
              />

              <Form.Control.Feedback type="invalid">
                {this.props.currentState.error.errorName == "address" &&
                  this.props.currentState.error.errorMessage}
              </Form.Control.Feedback>
            </InputGroup>
          </div>
        </Form.Group>

        <Form.Group className="d-flex profile-details-formgroup">
          {/* <span>
            <img
              src={countryicon}
              alt="Logo"
              style={{ height: "30px", width: "30px", marginTop: "15px" }}
            />
          </span> */}
          <div className="col-sm-3">
            <span>Country</span>
          </div>
          <div className="col-sm-9 edited_class">
            <InputGroup hasValidation>
              <Form.Control
                autoComplete={"off"}
                className={`profile-details-input ${
                  this.props.currentState.isEditEnabled ? "edit-enabled" : ""
                }`}
                placeholder={"Enter Country"}
                name="country"
                type="text"
                value={removeNA(this.state.country)}
                onClick={(e) => {
                  this.setState({ isCountrySelected: true });
                }}
                disabled={
                  this.props.currentState.isEditEnabled ? "" : "disabled"
                }
                onChange={(e) => {
                  this.setState({ countryid: "" });
                  this.setState({ country: e.target.value });
                  this.setState({ isCountrySelected: true });
                  //this.handleChange(e);
                }}
                isInvalid={this.props.currentState.error.errorName == "country"}
              />

              <Form.Control.Feedback type="invalid">
                {this.props.currentState.error.errorName == "country" &&
                  this.props.currentState.error.errorMessage}
              </Form.Control.Feedback>
            </InputGroup>
            <ListGroup>
              {this.state.country &&
                this.state.isCountrySelected &&
                this.props.countryList.length > 0 &&
                this.props.countryList
                  .filter((item) =>
                    item.title
                      .toLowerCase()
                      .includes(this.state.country.toLowerCase())
                  )
                  .slice(0, 3)
                  .map((item) => {
                    return (
                      <ListGroup.Item
                        onClick={() => {
                          // this.setState({ countryid: item.title });
                          this.setState({
                            isCountrySelected: false,
                            country: item.title,
                            city: "",
                            state: "",
                          });
                          this.setState(
                            { countryid: item.id, state_id: "", city_id: "" },
                            () => {
                              this.getCityList();
                              this.getStateList();
                              this.props.updateInfo({
                                ...this.props.currentState,
                                ...{ country_id: item.id, country: item.title },
                              });
                            }
                          );

                          // this.props.updateInfo({
                          //   ...this.props.currentState,
                          //   ...{ country_id: item.id },
                          // });
                        }}
                      >
                        <span role="img" aria-label={"" + item.title}>
                          <img
                            src={item.flag}
                            style={{ verticalAlign: "-webkit-baseline-middle" }}
                          />
                        </span>{" "}
                        <span className="ml-2">{"" + item.title}</span>
                      </ListGroup.Item>
                    );
                  })}
            </ListGroup>

            {this.props.currentState.error.errorName == "country" ? (
              <span className="">
                {this.props.currentState.error.errorMessage}
              </span>
            ) : null}
            {/* <DropdownButton
              title={selectedCountry}
              onClick={(e) => {
                this.setState({ isCountrySelected: true });
              }}
              disabled={this.props.currentState.isEditEnabled ? false : true}
              className="new_custom_dropdown new_signup_deropdown profile"
            >
              {this.state.countryid &&
                this.state.isCountrySelected &&
                this.state.countryList.length > 0 &&
                this.props.countryList
                  .filter((item) =>
                    item.title
                      .toLowerCase()
                      .includes(this.state.country.toLowerCase())
                  )
                  .slice(0, 3)
                  .map((item) => {
                    return (
                      <Dropdown.Item
                        onClick={() => {
                          // this.setState({ countryid: item.title });
                          this.setState({
                            isCountrySelected: false,
                            country: item.title,
                          });
                          this.setState({ countryid: item.id }, () => {
                            this.props.updateInfo({
                              ...this.props.currentState,
                              ...{ country_id: item.id, country: item.title },
                            });
                          });

                          // this.props.updateInfo({
                          //   ...this.props.currentState,
                          //   ...{ country_id: item.id },
                          // });
                        }}
                      >
                        <span role="img" aria-label={"" + item.title}>
                          <img src={item.flag} />
                        </span>{" "}
                        {"" + item.title}
                      </Dropdown.Item>
                    );
                  })}
            </DropdownButton>
         */}
          </div>
        </Form.Group>

        <Form.Group className="d-flex profile-details-formgroup">
          {/* <span>
            <img
              src={logo}
              alt="Logo"
              style={{ height: "30px", width: "30px", marginTop: "15px" }}
            />
          </span> */}
          <div className="col-sm-3">
            <span>State</span>
          </div>
          <div className="col-sm-9 edited_class">
            <InputGroup hasValidation>
              <Form.Control
                autoComplete={"off"}
                className={`profile-details-input ${
                  this.props.currentState.isEditEnabled ? "edit-enabled" : ""
                }`}
                placeholder={"Enter State"}
                name="state"
                type="text"
                value={removeNA(this.state.state)}
                disabled={
                  this.props.currentState.isEditEnabled ? "" : "disabled"
                }
                onClick={(e) => {
                  this.setState({ isStateSelected: true });
                }}
                onChange={(e) => {
                  this.setState({ state: e.target.value });
                  this.setState({ isStateSelected: true });
                  //this.handleChange(e);
                }}
                isInvalid={this.props.currentState.error.errorName == "state"}
              />

              <Form.Control.Feedback type="invalid">
                {this.props.currentState.error.errorName == "state" &&
                  this.props.currentState.error.errorMessage}
              </Form.Control.Feedback>
            </InputGroup>
            <ListGroup>
              {this.state.state &&
                this.state.isStateSelected &&
                this.props.stateList.length > 0 &&
                this.props.stateList
                  .filter((item) =>
                    item.title
                      .toLowerCase()
                      .startsWith(this.state.state.toLowerCase())
                  )
                  .slice(0, 3)
                  .map((item) => {
                    return (
                      <ListGroup.Item
                        onClick={() => {
                          this.setState({ isStateSelected: false });
                          this.setState(
                            { state_id: item.id, state: item.title, city: "" },
                            () => {
                              this.getCityList();
                              this.props.updateInfo({
                                ...this.props.currentState,
                                ...{ state_id: item.id, state: item.title },
                              });
                            }
                          );
                        }}
                      >
                        {item.title}
                      </ListGroup.Item>
                    );
                  })}
            </ListGroup>

            {this.props.currentState.error.errorName == "state" ? (
              <span className="">
                {this.props.currentState.error.errorMessage}
              </span>
            ) : null}
            {/* <DropdownButton
              title={selectedState}
              disabled={this.props.currentState.isEditEnabled ? false : true}
              onClick={(e) => {
                this.setState({ isStateSelected: true });
              }}
              className="new_custom_dropdown new_signup_deropdown two"
            >
              {this.state.state_id &&
                this.state.isStateSelected &&
                this.state.stateList.length > 0 &&
                this.props.stateList
                  .filter((item) =>
                    item.title
                      .toLowerCase()
                      .includes(this.state.state.toLowerCase())
                  )
                  .slice(0, 3)
                  .map((item) => {
                    return (
                      <Dropdown.Item
                        onClick={() => {
                          this.setState({ isStateSelected: false });
                          this.setState({ state_id: item.title }, () => {
                            this.props.updateInfo({
                              ...this.props.currentState,
                              ...{ state_id: item.id },
                            });
                          });
                        }}
                      >
                        {item.title}
                      </Dropdown.Item>
                    );
                  })}
            </DropdownButton>
          */}
          </div>
        </Form.Group>

        <Form.Group className="d-flex profile-details-formgroup">
          <div className="col-sm-3">
            <span>City</span>
          </div>
          <div className="col-sm-9 edited_class">
            <InputGroup hasValidation>
              <Form.Control
                className={`profile-details-input locationiocn ${
                  this.props.currentState.isEditEnabled ? "edit-enabled" : ""
                }`}
                placeholder={"Enter City"}
                name="city"
                autoComplete={"off"}
                type="text"
                value={removeNA(this.state.city)}
                disabled={
                  this.props.currentState.isEditEnabled ? "" : "disabled"
                }
                onClick={(e) => {
                  this.setState({ isCitySelected: true });
                }}
                onChange={(e) => {
                  this.setState({ isCitySelected: true, city: e.target.value });
                  // this.setState({filteredCityList: this.props.cityList.filter((item) =>
                  //   item.city_name.toLowerCase().startsWith(this.state.city.toLowerCase())
                  //   ),})

                  // this.state.filteredCityList.length > 0
                  //   ? this.setState(
                  //       { city: e.target.value },
                  //       this.handleRightCityUpdate
                  //     )
                  //   : this.setState(
                  //       {
                  //         city: e.target.value,
                  //       },
                  //       this.handleWrongCityUpdate
                  //     );
                }}
                isInvalid={this.props.currentState.error.errorName == "city"}
              />
              {this.props.currentState.isEditEnabled ? (
                <div className="editPasswordButton">
                  <InputGroup.Append>
                    <InputGroup.Text style={{ marginBottom: 9 }}>
                      {this.props.isGettingLocation ? (
                        <img
                          tabindex="7"
                          alt="loader"
                          src="//cdn1.xtramarx.com/stagelocal/images/netLoader.gif"
                        />
                      ) : (
                        <AimOutlined
                          onClick={() => {
                            this.getLocation();
                          }}
                          style={{ color: "rgba(0,0,0,.45)" }}
                        />
                      )}
                    </InputGroup.Text>
                  </InputGroup.Append>
                </div>
              ) : null}

              <Form.Control.Feedback type="invalid">
                {this.props.currentState.error.errorName == "city" &&
                  this.props.currentState.error.errorMessage}
              </Form.Control.Feedback>
            </InputGroup>
            <ListGroup>
              {this.state.city &&
                this.state.city.length > 0 &&
                this.state.isCitySelected &&
                this.props.cityList
                  .filter((item) =>
                    item.city_name
                      .toLowerCase()
                      .startsWith(this.state.city.toLowerCase())
                  )
                  .slice(0, 3)
                  .map((item) => {
                    return (
                      <ListGroup.Item
                        onClick={() => {
                          this.setState({ cityID: item.id });
                          this.setState({ isCitySelected: false });
                          this.setState({ city: item.city_name }, () => {
                            this.props.updateInfo({
                              ...this.props.currentState,
                              ...{
                                city: item.city_name,
                                city_id: item.id,
                                error: {
                                  errorName: "",
                                  errorMessage: "",
                                },
                              },
                            });
                          });
                        }}
                      >
                        {item.city_name}
                      </ListGroup.Item>
                    );
                  })}
            </ListGroup>

            {/* {this.props.currentState.error.errorName == "city" ? (
              <span className="">
                {this.props.currentState.error.errorMessage}
              </span>
            ) : null} */}
            {/* <DropdownButton
              title={selectedCity}
              disabled={this.props.currentState.isEditEnabled ? false : true}
              onClick={(e) => {
                this.setState({ isCitySelected: true });
              }}
              className="new_custom_dropdown new_signup_deropdown two"
            >
              {this.state.city &&
               this.state.city.length > 0 &&
                this.state.isCitySelected &&
                this.props.cityList
                  .filter((item) =>
                    item.city_name
                      .toLowerCase()
                      .includes(this.state.city.toLowerCase())
                  )
                  .slice(0, 3)
                  .map((item) => {
                    return (
                      <Dropdown.Item
                        onClick={() => {
                          this.setState({ cityID: item.id });
                          this.setState({ isCitySelected: false });
                          this.setState({ city: item.city_name }, () => {
                            this.props.updateInfo({
                              ...this.props.currentState,
                              ...{ city: item.city_name, city_id: item.id },
                            });
                          });
                        }}
                      >
                        {item.city_name}
                      </Dropdown.Item>
                    );
                  })}
            </DropdownButton>
          */}
          </div>
        </Form.Group>

        <Form.Group className="d-flex profile-details-formgroup">
          <div className="col-sm-3">
            {/* <span>
              <img
                src={logo}
                alt="Logo"
                style={{ height: "30px", width: "30px", marginTop: "15px" }}
              />
            </span> */}
            <span>Pincode</span>
          </div>
          <div className="col-sm-9">
            <InputGroup hasValidation>
              <Form.Control
                autoComplete={"off"}
                className={`profile-details-input ${
                  this.props.currentState.isEditEnabled ? "edit-enabled" : ""
                }`}
                placeholder={"Enter pincode"}
                name="pincode"
                type="text"
                value={removeNA(this.state.pincode).trim()}
                disabled={
                  this.props.currentState.isEditEnabled ? "" : "disabled"
                }
                onChange={(e) => {
                  if (e.target.value.length > 6) {
                    this.setState({ pincode: e.target.value.slice(0, 6) });
                    this.props.updateInfo({
                      ...this.props.currentState,
                      ...{ postalcode: e.target.value.slice(0, 6) },
                    });
                  } else {
                    this.setState({ pincode: e.target.value.slice(0, 6) });
                    this.props.updateInfo({
                      ...this.props.currentState,
                      ...{ postalcode: e.target.value.slice(0, 6) },
                    });
                  }
                  //this.handleChange(e);
                }}
                onKeyPress={(e) => {
                  if (!isNumberKey(e)) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                onPaste={(e) => {
                  e.preventDefault();
                }}
                isInvalid={this.props.currentState.error.errorName == "pincode"}
                // feedback={this.state.this.state.error.errorMessage}
              />

              <Form.Control.Feedback type="invalid">
                {this.props.currentState.error.errorName == "pincode" &&
                  this.props.currentState.error.errorMessage}
              </Form.Control.Feedback>
            </InputGroup>
          </div>
        </Form.Group>
        <div className="d-flex flex-wrap">
          <div className="col-sm-3"></div>
          <div className="col-sm-9">
            {this.props.currentState.isEditEnabled ? (
              <div className="font14 mt15">
                <span className="d-inline-block">
                  <img
                    src={this.state.isTick ? tickIcon : untickIcon}
                    onClick={() => {
                      this.setState({ isTick: !this.state.isTick }, () => {
                        this.props.updateInfo({
                          ...this.props.currentState,
                          ...{
                            allowingParentToManageSchedule: this.state.isTick,
                          },
                        });
                      });
                    }}
                    alt="tick"
                    style={{ height: "15px", width: "15px", marginRight: 15 }}
                  />
                </span>
                <label
                  style={{ fontWeight: 400, fontSize: 14 }}
                  className={this.state.genderActive ? "active" : ""}
                >
                  Allow Parent/mentor to manage schedule
                </label>
              </div>
            ) : null}
          </div>
        </div>
        <ProctoringDetails
          user_id={this.props.isLoginUserData.content.user_id}
        />
      </div>
    );
  }

  markTick = () => {
    this.setState({ isTick: !this.state.isTick });
  };

  activateField = (e) => {
    console.log();
    this.setState({
      [`${e.target.name}Active`]: true,
    });
  };

  disableField = (e) => {
    this.setState({
      [`${e.target.name}Active`]: false,
    });
  };

  disableFocus = (e) => {
    if (e.target.value === "") {
      this.disableField(e);
    }
  };

  handleWrongCityUpdate = (e) => {
    this.props.updateInfo({
      ...this.props.currentState,
      ...{
        error: {
          errorName: "city",
          errorMessage: "Please enter valid city.",
        },
      },
    });
  };

  handleRightCityUpdate = (e) => {
    this.props.updateInfo({
      ...this.props.currentState,
      ...{
        error: {
          errorName: "",
          errorMessage: "",
        },
      },
    });
  };

  handleChange = (e) => {
    if (e.target.name == "name") {
      this.props.updateInfo({
        ...this.props.currentState,
        ...{ firstName: e.target.value },
      });
    } else if (e.target.name == "school") {
      this.props.updateInfo({
        ...this.props.currentState,
        ...{ school_name: e.target.value },
      });
    } else if (e.target.name == "classTeacherName") {
      this.props.updateInfo({
        ...this.props.currentState,
        ...{ classTeacherName: e.target.value },
      });
    } else if (e.target.name == "gender") {
      this.props.updateInfo({
        ...this.props.currentState,
        ...{ gender: e.target.value },
      });
    } else if (e.target.name == "mobile") {
      this.props.updateInfo({
        ...this.props.currentState,
        ...{ mobile: e.target.value, isOTPVerified: false },
      });
    } else if (e.target.name == "email") {
      this.props.updateInfo({
        ...this.props.currentState,
        ...{ email: e.target.value },
      });
    } else if (e.target.name == "city") {
      // this.props.updateInfo({
      //   ...this.props.currentState,
      //   ...{ city: e.target.value },
      // });
    } else if (e.target.name == "state") {
      this.props.updateInfo({
        ...this.props.currentState,
        ...{ state_id: e.target.value },
      });
    } else if (e.target.name == "birthday") {
      this.props.updateInfo({
        ...this.props.currentState,
        ...{ dob: e.target.value },
      });
    }

    this.setState({
      [e.target.name]: e.target.value,
    });
    if (e.target.value === "") {
      this.disableField(e);
    } else {
      this.activateField(e);
    }
  };
}

function mapStateToProps(state, ownProps) {
  return {
    cityList: state.signup.cityList,
    countryList: state.login.countryList,
    boardList: state.signup.boardList,
    schoolList: state.signup.schoolList,
    stateList: state.signup.stateList,
    adjustData: state.login.adjustData,
    isLoginUserData: state.login.isLoginUserData,
  };
}

export default connect(mapStateToProps, {
  getSchoolList,
  changePassword,
  getCityList,
  getStateList,
})(ProfileDetails);
