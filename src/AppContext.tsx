import React, {ReactNode, useState} from 'react';

function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function isMobile() {
  return isAndroid() || isiOS();
}


export interface IAppContextState {
  mobile: boolean,
  source: string,
  recordingUrl: string,
  showSource: boolean,
  showFPS: boolean,
  preview: {
    show: boolean,
    showInput: boolean,
    showSkeleton: boolean,
    showKeypoints: boolean,
    showBoundingBox: boolean,
    width: number,
    height: number
  },
  handpose: {
    maxContinuousChecks: number,
    detectionConfidence: number,
    iouThreshold: number,
    scoreThreshold: number
  },
  pointer: {
    xMin: number,
    xMax: number,
    yMin: number,
    yMax: number,
    history: number
  },
  output: {
    showEventObservers: boolean,
  },
  net: null,
}


export const defaultState: IAppContextState = {
  mobile: isMobile(),
  source: 'recording',
  recordingUrl: 'rock_paper_scissors_an.webm',
  showSource: true,
  showFPS: true,
  preview: {
    show: true,
    showInput: false,
    showSkeleton: true,
    showKeypoints: true,
    showBoundingBox: false,
    width: 270,
    height: 480
  },
  handpose: {
    maxContinuousChecks: 1000,
    detectionConfidence: 0.8,
    iouThreshold: 0.3,
    scoreThreshold: 0.75
  },
  pointer: {
    xMin: -35,
    xMax: 10,
    yMin: 150,
    yMax: 180,
    history: 30
  },
  output: {
    showEventObservers: true,
  },
  net: null,
}

interface IAppContextActions {
  setState: (state: IAppContextState) => void
}

interface IAppContext {
  state: IAppContextState;
  actions: IAppContextActions;
}

export const AppContext = React.createContext({} as IAppContext);

export const AppContextProvider = ({ initialState, children } : {initialState?: Partial<IAppContextState>, children: ReactNode}) => {
  const [appContext, setAppContext] = useState(
    {
      ...defaultState, ...initialState
    }
  );

  const setState = (values: IAppContextState) => {
    setAppContext({ ...appContext, ...values })
  };

  return (
    <AppContext.Provider value={{
      state: appContext,
      actions: { setState }
    }} >
        {children}
     </AppContext.Provider>
  );
};