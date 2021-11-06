import React, { useEffect, useContext, useRef, MutableRefObject } from 'react';
import { AppContext } from '../AppContext'
import { drawPoseOnCanvas } from '../utils/handPose';


export default function CanvasContext({ source, boundingBox, landmarks, annotations}: {
    source?: HTMLVideoElement;
    boundingBox?: {
      topLeft: Array<number>,
      bottomRight: Array<number>
    },
    landmarks?: Array<[number, number, number]>,
    annotations?: {
      thumb: Array<Array<number>>,
      indexFinger: Array<Array<number>>,
      middleFinger: Array<Array<number>>,
      ringFinger: Array<Array<number>>,
      pinky: Array<Array<number>>,
      palmBase: Array<Array<number>>
    }
}){
  
  const appContext = useContext(AppContext);
  const canvasElement: MutableRefObject<HTMLCanvasElement | null>  = useRef(null);
  
  useEffect(() => {
    if (canvasElement.current) {
      drawPoseOnCanvas(canvasElement.current, boundingBox, landmarks, appContext.state.preview, source)
    }
  }, [appContext.state.preview, boundingBox, landmarks, annotations, source])

  return <canvas ref={canvas => canvasElement.current = canvas as HTMLCanvasElement} />
}


