import React, { ReactNode, useState, useEffect, useContext, useRef, MutableRefObject } from 'react';
import { AppContext } from './AppContext'

// @ts-ignore
import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-backend-webgl'
import '@tensorflow/tfjs-backend-cpu'
import Stats from 'stats.js'
import { IHandInfo, getHandInfo } from './utils/handInfo';

export interface IHandInfoContext {
  handInfo?: IHandInfo,
  timeContext: number
}

export interface IPoseContextState {
  handInViewConfidence: number,
  boundingBox: {
    topLeft: Array<number>,
    bottomRight: Array<number>
  },
  landmarks: Array<[number, number, number]>,
  annotations: {
    thumb: Array<Array<number>>,
    indexFinger: Array<Array<number>>,
    middleFinger: Array<Array<number>>,
    ringFinger: Array<Array<number>>,
    pinky: Array<Array<number>>,
    palmBase: Array<Array<number>>
  }
}

export const defaultState: IPoseContextState | null = null

interface IPoseContextActions {
  setState: (state: IPoseContextState) => void
  setSource: (source: HTMLVideoElement | null) => void
}

interface IHandPose {
  estimateHands: (node: any) => Promise<Array<IPoseContextState>>
}


interface IPoseContext {
  state: IPoseContextState | null;
  info: IHandInfoContext | null;
  actions: IPoseContextActions;
  source: HTMLVideoElement | null;
  modelLoaded: boolean;
}

export const PalmContext = React.createContext({} as IPoseContext);

export const PalmContextProvider = ({ children }: { children: ReactNode }) => {
  const [poseContext, setPoseContext] = useState<IPoseContextState | null>(defaultState);
  const [handInfo, sethandInfo] = useState<IHandInfoContext | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false)
  const [sourceLoaded, setSourceLoaded] = useState(false)

  const videoElement: MutableRefObject<HTMLVideoElement | null> = useRef(null);

  const appContext = useContext(AppContext);
  const loopStarted = useRef(false);
  const stats: MutableRefObject<Stats | null> = useRef(null);

  const model: MutableRefObject<IHandPose | null> = useRef(null);

  useEffect(() => {
    if (appContext.state.showFPS) {
      stats.current = new Stats()
      stats.current.showPanel(0);
      document.body.appendChild(stats.current.dom);
      return () => {
        if (stats.current) {
          document.body.removeChild(stats.current.dom);
          stats.current = null;
        }
      }
    } else {
      if (stats.current) {
        return;
      }
    }
  }, [appContext.state.showFPS]);

  useEffect(() => {
    const loadModel = async () => {
      const result = await handpose.load({
        detectionConfidence: appContext.state.handpose.detectionConfidence,
        iouThreshold: appContext.state.handpose.iouThreshold,
        maxContinuousChecks: appContext.state.handpose.maxContinuousChecks,
        scoreThreshold: appContext.state.handpose.scoreThreshold
      });
      model.current = result
      setModelLoaded(true)
    }
    loadModel();
  }, [appContext.state.handpose.detectionConfidence, appContext.state.handpose.iouThreshold, appContext.state.handpose.maxContinuousChecks, appContext.state.handpose.scoreThreshold]);

  useEffect(() => {
    const setupVideo: () => Promise<HTMLVideoElement | null> = async () => {
      const video = videoElement.current;
      if (video) {
        video.width = appContext.state.preview.width;
        video.height = appContext.state.preview.height;
        switch (appContext.state.source) {
          case 'recording':
            video.srcObject = null;
            video.setAttribute('src', appContext.state.recordingUrl);
            break;
          case 'webcam':
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
              throw new Error(
                'Browser API navigator.mediaDevices.getUserMedia not available');
            }
            navigator.mediaDevices.getUserMedia({
              'audio': false,
              'video': {
                facingMode: 'user',
                width: { exact: 320 },
                height: { exact: 240 },
              },
            }).then((stream) => {
              video.srcObject = stream;
            }).catch(e => {
              appContext.actions.setState({
                ...appContext.state,
                source: 'recording'
              })
            });
            break;
        }
        return new Promise((resolve) => {
          video.onloadedmetadata = () => {
            resolve(video);
          };
        });
      }
      else {
        return null
      }
    };

    const loadVideo = async () => {
      setSourceLoaded(false)
      const video = await setupVideo()

      if (appContext.state.source === "recording" && video) {
        appContext.actions.setState({
          ...appContext.state,
          preview: {
            ...appContext.state.preview,
            width: video.videoWidth,
            height: video.videoHeight
          }
        })
      }

      if (video && appContext.state.source === 'webcam') {
        video.play();
      }
      setSourceLoaded(true)
    }
    loadVideo()
  }, [appContext.state.source, appContext.state.recordingUrl, appContext.state.mobile, appContext.state.preview.width, appContext.state.preview.height]);

  useEffect(() => {
    if (sourceLoaded && !loopStarted.current) {
      const makePrediction = async (time: number) => {
        if (stats.current) {
          stats.current.begin();
        }
        // !videoElement.current.paused
        if (model.current && videoElement.current && videoElement.current.readyState >= 2) {
          const predictions = await model.current.estimateHands(videoElement.current)
          if (predictions.length > 0) {
            setState(predictions[0]);
            sethandInfo({
              handInfo: getHandInfo(predictions[0].landmarks),
              timeContext: time
            })
          } else {
            setState(null)
            sethandInfo({ timeContext: time })
          }
        }
        if (stats.current) {
          stats.current.end();
        }
        requestAnimationFrame(makePrediction);
      }
      requestAnimationFrame(makePrediction);
      loopStarted.current = true;
    }
  }, [sourceLoaded])


  const setSource = (video: HTMLVideoElement | null) => {
    videoElement.current = video
  }


  const setState = (values: IPoseContextState | null) => {
    setPoseContext(values)
  };

  return (
    <PalmContext.Provider value={{ state: poseContext, info: handInfo, actions: { setState, setSource }, source: videoElement.current, modelLoaded: modelLoaded }} >
      {children}
    </PalmContext.Provider>
  );
};


export const PalmContextVideo = () => {
  const appContext = useContext(AppContext);
  const poseContext = useContext(PalmContext)

  return (
    <>
      {appContext.state.source === 'recording' && <h2>You can switch to webcam in App settings. 
        The application works only in the browser. 
        Nothing is being sent to the backend</h2>}
      {appContext.state.source === 'webcam' && <h2>the application works only in the browser. Nothing is being sent to the backend</h2>}
      <video id="palm-context-provider-video" ref={video => poseContext.actions.setSource(video as HTMLVideoElement)}
        controls={appContext.state.source === 'recording'}
        style={{ display: appContext.state.showSource ? 'initial' : 'none' }}
      />
    </>
    
  )

}