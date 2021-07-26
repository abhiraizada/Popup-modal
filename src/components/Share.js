import React from "react";
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
import { Button, Modal } from "react-bootstrap";
import "./Share.css";

const Share = (props) => {
  const shareUrl =
    "https://www.extramarks.com/testprep/share-question/MTgzMzUzMS82NzM1Nzgvd2Vic2l0ZS8yMDI5MTUzMQ==";
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
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Share;
