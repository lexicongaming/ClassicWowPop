/* eslint-disable jsx-a11y/media-has-caption */
import React, { Component } from 'react';
import './BackgroundVideo.css';

class BackgroundVideo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      videoURL: 'videos/wowclassic.webm'
    };
  }

  render() {
    const { videoURL } = this.state;
    return (
      <div className="fullscreen-bg">
        <video className="video-bg" loop muted autoPlay poster="images/main.jpg">
          <source src={videoURL} type="video/webm" />
          <img
            src="/images/main.jpg"
            alt="Your browser does not support the <video> tag"
            title="Your browser does not support the <video> tag"
          />
        </video>
      </div>
    );
  }
}

export default BackgroundVideo;
