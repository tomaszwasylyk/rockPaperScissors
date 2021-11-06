import vec3 from "./vec3"


export interface IHandInfo {
  yaw: number,
  pitch: number,
  roll: number,
  indexFingerPitch: number,
  thumbFingerYaw: number,
  pinkyFingerPitch: number
};

export const getHandPalmLineX = (landmarks: Array<[number, number, number]>) => {
  const thumbBase = new vec3(landmarks[1])
  const indexBase = new vec3(landmarks[5])
  const indexMiddlePoint = thumbBase.add(indexBase).scale(0.5)

  const palmBase = new vec3(landmarks[0])
  const pinkyBase = new vec3(landmarks[17])
  const pinkyMiddlePoint = palmBase.add(pinkyBase).scale(0.5)

  const lineX = indexMiddlePoint.subtract(pinkyMiddlePoint)
  return [lineX, indexMiddlePoint, pinkyMiddlePoint]
}

export const getHandPalmLineY = (landmarks: Array<[number, number, number]>) => {
  const thumbBase = new vec3(landmarks[1])
  const palmBase = new vec3(landmarks[0])
  const lowerMiddlePoint = thumbBase.add(palmBase).scale(0.5)

  const middleBase = new vec3(landmarks[9])
  const ringBase = new vec3(landmarks[13])
  const upperMiddlePoint = middleBase.add(ringBase).scale(0.5)
      
  const handPalmLine = lowerMiddlePoint.subtract(upperMiddlePoint)
  return [handPalmLine, lowerMiddlePoint, upperMiddlePoint]
}

export const getHandInfo = (landmarks: Array<[number, number, number]>) => {
  const [handPalmLineY, _1] = getHandPalmLineY(landmarks)
  
  const handYaw = Math.atan2(handPalmLineY.x, handPalmLineY.y) * (180 / Math.PI)
  const handPitch = Math.atan2(handPalmLineY.z, handPalmLineY.y) * (180 / Math.PI)

  // const handBaseAngleX = Math.atan(handPalmLine.x / handPalmLine.y) * (180 / Math.PI)
  // const handBaseAngleZ = Math.atan(handPalmLine.z / handPalmLine.y) * (180 / Math.PI)

  const [handPalmLineX, _2] = getHandPalmLineX(landmarks)

  const roll = Math.atan2(handPalmLineX.z, handPalmLineX.x) * (180 / Math.PI)

  const tipOfIndexFinger = new vec3(landmarks[8])
  const pointOfIndexFinger = new vec3(landmarks[7])

  const indexFingerPointingLine = tipOfIndexFinger.subtract(pointOfIndexFinger)
  const indexFingerPitch = Math.atan2(indexFingerPointingLine.z, indexFingerPointingLine.y) * (180 / Math.PI)

  const tipOfThumbFinger = new vec3(landmarks[4])
  const pointOfThumbFinger = new vec3(landmarks[3])
  const thumbPointingLine = tipOfThumbFinger.subtract(pointOfThumbFinger)

  const thumbFingerYaw = Math.atan2(thumbPointingLine.x, thumbPointingLine.y) * (180 / Math.PI)

  // const indexFingerPointingAngleZ = Math.atan(indexFingerPointingLine.z / indexFingerPointingLine.y) * (180 / Math.PI)

  const tipOfPinkyFinger = new vec3(landmarks[20])
  const pointOfPinkyFinger = new vec3(landmarks[19])

  const pinkyFingerPointingLine = tipOfPinkyFinger.subtract(pointOfPinkyFinger)
  const pinkyFingerPitch = Math.atan2(pinkyFingerPointingLine.z, pinkyFingerPointingLine.y) * (180 / Math.PI)

  return {
    yaw: handYaw,
    pitch: handPitch,
    roll: roll,
    indexFingerPitch: indexFingerPitch,
    thumbFingerYaw: thumbFingerYaw,
    pinkyFingerPitch: pinkyFingerPitch
  } as IHandInfo
}