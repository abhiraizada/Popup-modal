import React, { useState, useEffect } from "react";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  EmailIcon,
  EmailShareButton,
} from "react-share";
import { Button, Modal, InputGroup, FormControl } from "react-bootstrap";
import "./Share.css";

const Share = (props) => {
  const shareUrl =
    "https://www.extramarks.com/testprep/share-question/MTgzMzUzMS82NzM1Nzgvd2Vic2l0ZS8yMDI5MTUzMQ==";
  // const [text, setText] = useState(shareUrl);

  // const inputHandler = (event) => {
  //   setText(event.target.value);
  // };

  const copy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    props.setCopyClicked(true);
  };

  // useEffect(() => {
  //   console.log("runn");
  //   return () => setCopyClicked(false);
  // }, []);
  return (
    <div>
      <Modal
        className="sharepopup"
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        animation={false}
      >
        <Modal.Header closeButton>
          {/* <Modal.Title id="contained-modal-title-vcenter">
            Modal heading
          </Modal.Title> */}
        </Modal.Header>
        <Modal.Body>
          <FacebookShareButton
            url={shareUrl}
            quote="hieloo shha ajshf ahfo sss"
            hashtag={"#portfolia"}
          >
            <FacebookIcon size={40} round={true} />
          </FacebookShareButton>
          <WhatsappShareButton url={shareUrl}>
            <WhatsappIcon size={40} round={true} />
          </WhatsappShareButton>
          <TwitterShareButton url={shareUrl}>
            <TwitterIcon size={40} round={true} />
          </TwitterShareButton>
          <EmailShareButton url={shareUrl}>
            <EmailIcon size={40} round={true} />
          </EmailShareButton>

          {/* <input type="text" value={text} onChange={inputHandler} />
          <button onClick={copy} disabled={!text}>
            Copy To Clipboard
          </button> */}

          <InputGroup className="mb-1 mt-3" size="sm">
            <FormControl
              value={shareUrl}
              disabled
              placeholder=""
              aria-label="Small"
              aria-describedby="inputGroup-sizing-sm"
            />
            {console.log("hnji :", props.copyClicked)}
            <InputGroup.Text id="inputGroup-sizing-sm" onClick={() => copy()}>
              {!props.copyClicked ? "Copy" : "Copied!"}
            </InputGroup.Text>
          </InputGroup>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Share;
