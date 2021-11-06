import React, {
  ReactNode,
  useEffect,
  useState,
} from "react";
import "./App.css";
import {
  AppContextProvider,
  IAppContextState,
} from "./AppContext";
import DebugMenu from "./DebugMenu";
import { SavedEvents } from "./GestureEventContext";
import { GestureContextProvider, SavedGestures } from "./GestureContext";
import { GestureEventContextProvider } from "./GestureEventContext";
import { PalmContextProvider, PalmContextVideo } from "./PalmContext";
import Pointer from "./ui/Pointer";
import { DeveloperMenu } from "./ui/DeveloperMenu";
import { Button } from "@material-ui/core";
import PaperRockScissorsGame from "./examples/rockPaperScissors";
import Grid from '@material-ui/core/Grid';

export default function App() {
  const [developerMode, setdeveloperMode] = useState(false);
  const [paperRockGameMode, setPaperRockGameMode] = useState(true);

  return (
    <div>
      {!(developerMode || paperRockGameMode) && (
        <Grid container direction="row" justify="space-around" alignItems="center" style={{ paddingTop: '50px' }}>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setdeveloperMode(!developerMode)}>
              Application designer
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setPaperRockGameMode(!paperRockGameMode)}>
              Play paper, rock, scissors
            </Button>
          </Grid>
        </Grid>
      )}
      {developerMode && (
        <ApplicationDesigner />
      )}
      {paperRockGameMode && (
        <PaperRockScissors />
      )}
      <Pointer />
    </div>
  );
}

export const ApplicationDesigner = () => {

  return (
    <ApplicationHandposeContext appSettings={{ source: 'recording' }} appContextDebug>
      <Grid container spacing={3} justify="space-between" >
        <Grid item>
          <PalmContextVideo />
        </Grid>
        <Grid item>
          <DeveloperMenu />
        </Grid>
      </Grid>
    </ApplicationHandposeContext>
  )
}

export const PaperRockScissors = ({ developerMenu = true }: { developerMenu?: boolean }) => {

  const [gestures, setGestures] = useState<SavedGestures | null>(null)

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    readContextFromJson('paper_rock_scissors_gestures.json')
  }, [])

  const readContextFromJson = (url: string) => {
    fetch(url)
      .then(response => response.json())
      .then(json => setGestures(json)).catch(error => setErrorMessage("Something went wrong when loading initial gestures"))
  }

  return (
    <div>
      { errorMessage && <h1>{errorMessage}</h1>}
      {
        (gestures || errorMessage) &&
        <ApplicationHandposeContext appSettings={{ source: 'webcam' }} gestures={gestures || {}} appContextDebug>
          <Grid container>
            <Grid item xs={12} lg={4}>
              <PalmContextVideo />
            </Grid>
            <Grid item xs={12} lg={4}>
              <PaperRockScissorsGame />
            </Grid>
            <Grid item xs={12} lg={4}>
              <DeveloperMenu />
            </Grid>
          </Grid>
        </ApplicationHandposeContext>
      }
    </div>
  )
}


export const ApplicationHandposeContext = ({
  gestures,
  events,
  children,
  appContextDebug = false,
  appSettings = {}
}: {
  gestures?: SavedGestures;
  events?: SavedEvents;
  appContextDebug?: boolean;
  children: ReactNode;
  appSettings?: Partial<IAppContextState>;
}) => {
  return (
    <AppContextProvider initialState={appSettings}>
      {appContextDebug && <DebugMenu />}
      <PalmContextProvider>
        <GestureContextProvider
          initialState={gestures || ({} as SavedGestures)}>
          <GestureEventContextProvider
            initialState={events || ({} as SavedEvents)}>
            {children}
          </GestureEventContextProvider>
        </GestureContextProvider>
      </PalmContextProvider>
    </AppContextProvider>
  );
};
