import React, { useContext, useRef, useEffect } from 'react';
import { PalmContext } from '../PalmContext'
import { AppContext } from '../AppContext'
import { GestureEventContext } from '../GestureEventContext';

import { IHandInfo } from './../utils/handInfo';

export interface PointerAxisPreset {
  'func': (handInfo: IHandInfo, min: number, max: number) => number
  'min': number,
  'max': number
}

const roundNumber = (degrees: number) => {
  return Math.round(degrees * 10) / 10
}


const presets = {
  'handYaw': {
    min: -35,
    max: 50,
    func: (handInfo: IHandInfo, min: number, max: number) => {
      const range = max - min;
      let positionRelative = (roundNumber(handInfo.yaw) * -1 - min) / range
      positionRelative = Math.max(0, positionRelative)
      positionRelative = Math.min(1, positionRelative)
      return positionRelative
    }
  } as PointerAxisPreset,
  'handYawReversed': {
    min: 30,
    max: 60,
    func: (handInfo: IHandInfo, min: number, max: number) => {
      const range = max - min;
      let positionRelative = (roundNumber(handInfo.yaw) * -1 - min) / range
      positionRelative = Math.max(0, positionRelative)
      positionRelative = Math.min(1, positionRelative)
      return positionRelative
    }
  } as PointerAxisPreset,
  'indexFingerPitch': {
    min: 90,
    max: 120,
    func: (handInfo: IHandInfo, min: number, max: number) => {
      const range = max - min;
      let positionRelative = (Math.abs(roundNumber(handInfo.indexFingerPitch)) - min) / range
      positionRelative = Math.max(0, positionRelative)
      positionRelative = Math.min(1, positionRelative)
      return positionRelative
    }
  } as PointerAxisPreset,
  'pinkyFingerPitch': {
    min: 150,
    max: 175,
    func: (handInfo: IHandInfo, min: number, max: number) => {
      const range = max - min;
      let positionRelative = (Math.abs(roundNumber(handInfo.pinkyFingerPitch)) - min) / range
      positionRelative = Math.max(0, positionRelative)
      positionRelative = Math.min(1, positionRelative)
      return positionRelative
    }
  } as PointerAxisPreset,
  'handRoll': {
    min: 5,
    max: 50,
    func: (handInfo: IHandInfo, min: number, max: number) => {
      const range = max - min;
      let positionRelative = (Math.abs(roundNumber(handInfo.roll)) - min) / range
      positionRelative = Math.max(0, positionRelative)
      positionRelative = Math.min(1, positionRelative)
      return positionRelative
    }
  } as PointerAxisPreset,
  'handPitch': {
    min: -5,
    max: 15,
    func: (handInfo: IHandInfo, min: number, max: number) => {
      const range = max - min;
      let positionRelative = (roundNumber(handInfo.yaw) * -1 - min) / range
      positionRelative = Math.max(0, positionRelative)
      positionRelative = Math.min(1, positionRelative)
      return positionRelative
    }
  } as PointerAxisPreset,
  'thumbFingerYaw': {
    min: 100,
    max: 160,
    func: (handInfo: IHandInfo, min: number, max: number) => {
      const range = max - min;
      let positionRelative = (Math.abs(roundNumber(handInfo.thumbFingerYaw)) - min) / range
      positionRelative = Math.max(0, positionRelative)
      positionRelative = Math.min(1, positionRelative)
      return positionRelative
    }
  } as PointerAxisPreset,
}


export const POINTER_ELEMENT_ID = "pointer"

export default function Pointer({xPreset  = presets['handPitch'], yPreset  = presets['indexFingerPitch']}: {xPreset?: PointerAxisPreset, yPreset?: PointerAxisPreset}){
  const appContext = useContext(AppContext)
  const poseContext = useContext(PalmContext)

  const xHistory = useRef<number[]>([])
  const yHistory = useRef<number[]>([])

  if (poseContext.info && poseContext.info.handInfo) {
    let positionXRelative = xPreset.func(poseContext.info.handInfo, xPreset.min, xPreset.max)
    positionXRelative = 1 - positionXRelative
    let X = positionXRelative * window.screen.availWidth;

    let positionYRelative = yPreset.func(poseContext.info.handInfo, yPreset.min, yPreset.max)
    positionYRelative = 1 - positionYRelative
    let Y = positionYRelative * window.screen.availHeight;

    const historySize = appContext.state.pointer.history

    if (xHistory.current.length === historySize) {
      xHistory.current.shift()
      yHistory.current.shift()
    }
  
    xHistory.current.push(X)
    yHistory.current.push(Y)
  
    X = xHistory.current.reduce((a, b) => a + b) / xHistory.current.length
    Y = yHistory.current.reduce((a, b) => a + b) / yHistory.current.length

    return <PointerElement x={Y} y={X} />
  } else {
    return <></>
  }
}

export const PointerElement = ({ x, y }: { x: number, y: number }) => {

  const eventContext = useContext(GestureEventContext)

  const clickTriggeredRecently = useRef(false)

  useEffect(() => {
    if (eventContext.state.triggeredEvents?.includes("click")) {
      if (!clickTriggeredRecently.current) {

        clickTriggeredRecently.current = true
        const elements = document.elementsFromPoint(x, y)

        const hoveredElement = elements.find(element => element.id !== POINTER_ELEMENT_ID && element instanceof HTMLElement) as HTMLElement
        if (hoveredElement) {
          hoveredElement.click()
        }
      }
    } else if (clickTriggeredRecently.current) {
      clickTriggeredRecently.current = false
    }

  }, [eventContext.state.triggeredEvents])

  if (eventContext.state.triggeredEvents) {
    return (
      <div id={POINTER_ELEMENT_ID} style={{position: 'fixed', top: x, zIndex: 1000, left: y, backgroundColor: 'black', width: '20px', height: '2 0px'}}></div>
    )
  } else {
    return <></>
  }
  
  
}
