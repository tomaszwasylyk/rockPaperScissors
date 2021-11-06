import React, {ReactNode, useState, useContext, useEffect, useMemo} from 'react';
import { GestureContext } from './GestureContext';

export interface SavedEvents { [key: string]: Array<string>  }

export interface IGestureEventContextState {
  triggeredEvents: string[] | null
  gesturesNames: Array<string>
  gestureEventMapping:  SavedEvents
}


export const defaultState: IGestureEventContextState = {
  triggeredEvents: [],
  gesturesNames: [],
  gestureEventMapping: {}
}

interface IGestureEventContextActions {
  addEvent: (eventName: string) => void,
  removeEvent: (eventName: string) => void,
  setEventMapping: (eventList: SavedEvents) => void
  setEventGestures: (eventName: string, eventList: Array<string>) => void
}

interface IGestureEventContext {
  state: IGestureEventContextState;
  actions: IGestureEventContextActions;
}

export const GestureEventContext = React.createContext({} as IGestureEventContext);

export const GestureEventContextProvider = ({ children, initialState }: { children: ReactNode, initialState: SavedEvents }) => {
  const gestureContext = useContext(GestureContext)

  const [gestureEventMapping, setGestureEventMapping] = useState({} as SavedEvents)

  const [gesturesNames, setGesturesNames] = useState([] as Array<string>)
  
  useEffect(() => {
    if (initialState) {
      setGestureEventMapping(initialState)
    }
  }, [initialState])


  useEffect(() => {
    setGesturesNames(Object.keys(gestureContext.state.savedGestures))
  }, [gestureContext.state.savedGestures])


  const addEvent = (eventName: string) => {
    if (!(eventName in gestureEventMapping)) {
      setGestureEventMapping({...gestureEventMapping, [eventName]: []})
    } 
  }

  const removeEvent = (eventName: string) => {
    if (eventName in gestureEventMapping) {
      const newSavedGestures = {
        ...gestureEventMapping
      }
      delete newSavedGestures[eventName]
      setGestureEventMapping(newSavedGestures)
    }
  }

  const setEventMapping = (eventList: SavedEvents ) => {
    setGestureEventMapping(eventList)
  }

  const setEventGestures = (eventName: string, eventList: Array<string>) => {
    setGestureEventMapping({...gestureEventMapping, [eventName]: eventList})
  }

  const getCurrentTriggeredEvents = () => {
    const reversedMapping = {} as SavedEvents
    for (let entry of Object.entries(gestureEventMapping)) {
      const key = entry[0]
      const values = entry[1]
      for (let value of values) {
        if (!(value in reversedMapping)) {
          reversedMapping[value] = []
        } 
        reversedMapping[value].push(key)
      }
    }
    return reversedMapping
  }

  const reversedMapping = useMemo(getCurrentTriggeredEvents, [gestureEventMapping])

  const currentGesture = gestureContext.state.currentGesture;
  

  let triggeredEvents = null;
  if (currentGesture) {
    triggeredEvents = currentGesture in reversedMapping ? reversedMapping[currentGesture] : [];
  }

  return (
    <GestureEventContext.Provider value={{
      state: {
        triggeredEvents, gestureEventMapping, gesturesNames
      },
      actions: { addEvent, removeEvent, setEventMapping, setEventGestures }
    }} >
      {children}
     </GestureEventContext.Provider>
  );
};

