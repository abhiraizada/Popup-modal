import React, { useState } from "react";
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
  const [text, setText] = useState(shareUrl);

  const inputHandler = (event) => {
    setText(event.target.value);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    alert("Text copied: ", text);
    console.log(text);
  };

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
              value={text}
              onChange={(e) => inputHandler(e)}
              placeholder=""
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
            />

            <InputGroup.Text onClick={() => copy()} id="basic-addon2">
              Copy
            </InputGroup.Text>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Share;
