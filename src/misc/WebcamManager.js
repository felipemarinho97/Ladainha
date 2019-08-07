import React, { Component } from 'react'
import Webcam from 'react-webcam';

class WebcamManager extends Component {
    webcamRef = React.createRef();

    render() {
        return (
            // <Webcam
            //     className="react-webcam"
            //     audio={false}
            //     height={350}
            //     ref={this.webcamRef}
            //     screenshotFormat="image/jpeg"
            //     width={350}
            //     />
            <video 
                ref={(stream) => { this.videoStream = stream }}
                width='800'
                height='600'
                style={{display: 'auto'}}>
            </video>
        )
    }

}

export default WebcamManager;