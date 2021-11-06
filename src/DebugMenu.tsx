import {useContext, useState} from 'react';
import { AppContext } from './AppContext'
import DatGui, { DatBoolean, DatNumber, DatButton, DatFolder, DatSelect, DatString } from 'react-dat-gui';
import 'react-dat-gui/dist/index.css';

export const DebugMenu = () => {
  const appContext = useContext(AppContext);
  const [windowOpened, setWindowOpened] = useState(false)

  return (
    <>
      {windowOpened ? 
        <>
          <DatGui data={appContext.state} onUpdate={appContext.actions.setState} style={{ zIndex: 1 }}>
            <DatSelect path='source' label='source' options={['recording', 'webcam']} />
            {appContext.state.source === 'recording' && <DatString path='recordingUrl' label="Recording URL" />}
            <DatBoolean path='showSource' label='show Source' />
            <DatBoolean path='preview.show' label='show preview' />
            <DatBoolean path='showFPS' label='show FPS' />
            <DatFolder closed={false} title="Preview">
              <DatBoolean path='preview.showInput' label='show input' /> 
              <DatBoolean path='preview.showKeypoints' label='show keypoints' />
              <DatBoolean path='preview.showSkeleton' label='show skeleton' />
              <DatBoolean path='preview.showBoundingBox' label='show boundingBox' />
              <DatNumber path='preview.width' label='Width' min={50} max={1000} step={1} />
              <DatNumber path='preview.height' label='Height' min={50} max={1000} step={1} />
            </DatFolder>
            <DatFolder closed={false} title="Handpose">
              <DatNumber path='handpose.maxContinuousChecks' label='maxContinuousChecks' min={0} max={1000} step={1} />
              <DatNumber path='handpose.detectionConfidence' label='detectionConfidence' min={0} max={1} step={0.01} />
              <DatNumber path='handpose.iouThreshold' label='iouThreshold' min={0} max={1} step={0.01} />
              <DatNumber path='handpose.scoreThreshold' label='scoreThreshold' min={0} max={1} step={0.01} />
            </DatFolder>
            <DatFolder closed={false} title="Pointer">
              <DatNumber path='pointer.xMin' label='xMin' min={-90} max={0} step={1} />
              <DatNumber path='pointer.xMax' label='xMax' min={0} max={90} step={1} />
              <DatNumber path='pointer.yMin' label='yMin' min={0} max={180} step={1} />
              <DatNumber path='pointer.yMax' label='yMax' min={0} max={180} step={1} />
              <DatNumber path='pointer.history' label='history' min={1} max={300} step={1} />
            </DatFolder>
            <DatFolder closed={false} title="Output">
              <DatBoolean path='output.showEventObservers' label='showEventObservers' />
            </DatFolder>
            <DatButton label="Close" onClick={() => setWindowOpened(false)} />
          </DatGui>
        </> : <button onClick={() => setWindowOpened(true)} style={{ position: 'fixed', right: '16px', top: 0, width: '280px', backgroundColor: '#1a1a1a', border: 0, color: "white" }}>App settings</button>}
    </>
  )
      
}

export default DebugMenu;