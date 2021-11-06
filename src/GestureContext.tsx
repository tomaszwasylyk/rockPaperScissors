import React, {ReactNode, MutableRefObject, useState, useContext, useRef, useEffect} from 'react';
import { PalmContext } from './PalmContext';
import GestrueClassifer from './classifier/Classifier'
import { createPoseUrl } from './utils/handPose';

export type Point = [number, number, number];
export type Gesture = Array<Point>;
export type GestureInfo = {
  previewUrl: string;
  gestures: Array<Gesture>
}

export interface SavedGestures { [key: string]: GestureInfo }

export interface IGestureContextState {
  currentGesture: string | null,
  savedGestures:  SavedGestures
}


export const defaultState: IGestureContextState = {
  currentGesture: null,
  savedGestures: {}
}

interface IGestureContextActions {
  addGesture: (gestureName: string, landmarks: Gesture) => void
  removeGesture: (gestureName: string, indexToRemove: number) => void
  setGestures: (savedGestures: SavedGestures) => void
}

interface IGestureContext {
  state: IGestureContextState;
  actions: IGestureContextActions;
}

export const GestureContext = React.createContext({} as IGestureContext);

export const GestureContextProvider = ({ children, initialState }: { children: ReactNode, initialState?: SavedGestures}) => {
  const palmContext = useContext(PalmContext)

  const [currentGesture, setCurrentGesture] = useState(null)
  const [savedGestures, setSavedGestures] = useState({} as SavedGestures)

  const classifier: MutableRefObject<GestrueClassifer | null> = useRef(null)
  
  useEffect(() => {
    if (initialState) {
      setGestures(initialState)
    }
  }, [initialState])

  useEffect(() => {
    if (Object.keys(savedGestures).length > 0) {
      classifier.current = new GestrueClassifer(savedGestures)
    }
  }, [savedGestures])

  useEffect(() => {
    if (classifier.current && palmContext.state?.landmarks) {
      const gestureName = classifier.current.predict(palmContext.state.landmarks)
      setCurrentGesture(gestureName)
    } else {
      setCurrentGesture(null)
    }
  }, [palmContext.state])

  const addGesture = (gestureName: string, landmarks: Gesture) => {
    if (gestureName in savedGestures) {
      const savedGesture = savedGestures[gestureName]
      setSavedGestures({
        ...savedGestures,
        [gestureName]:{
          ...savedGesture,
          gestures: [...savedGesture.gestures, landmarks]
        }
      })
    } else {
      setSavedGestures({
        ...savedGestures,
        [gestureName]: {
          previewUrl: createPoseUrl(landmarks, [300,300]),
          gestures: [landmarks]
        }
      })
    }
  }

  const removeGesture = (gestureName: string, indexToRemove: number) => {
    const savedGesture = savedGestures[gestureName]
    const newGesturesForKey = savedGesture.gestures.filter((_, index) => indexToRemove !== index)
    if (newGesturesForKey.length > 0) {
      setSavedGestures({
        ...savedGestures,
        [gestureName]: {
          ...savedGesture,
          gestures: newGesturesForKey
        }
      })
    } else {
      const newSavedGestures = {
        ...savedGestures
      }
      delete newSavedGestures[gestureName]
      setSavedGestures(newSavedGestures)
    }
  }

  const setGestures = (savedGestures: SavedGestures) => {
    setSavedGestures(savedGestures)
  }

  return (
    <GestureContext.Provider value={{
      state: {
        savedGestures,
        currentGesture,
      },
      actions: { addGesture, removeGesture, setGestures }
    }} >
      {children}
     </GestureContext.Provider>
  );
};
