import React, {  useContext } from 'react';
import { PalmContext } from '../PalmContext'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Preview } from './Preview'

export default function PalmContextPreview(){

  const poseContext = useContext(PalmContext)

  return (
    <>
      <Preview source={poseContext.source ? poseContext.source : undefined} points={poseContext.state?.landmarks}/>
      <Backdrop open={!poseContext.modelLoaded} style={{ zIndex: 5000, backgroundColor: "rgba(0, 0, 0, 0.95)" }}>
        <CircularProgress color="secondary" />
      </Backdrop>
    </>
      
  )
}
