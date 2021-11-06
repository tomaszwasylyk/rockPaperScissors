import { Typography } from "@material-ui/core";
import React, { useState, useEffect, useContext, useRef } from "react";
import GestureEventButton from "../GestureButton";
import { GestureContext } from "../GestureContext";
import Grid from '@material-ui/core/Grid';

const COUNTDOWN_TIME_IN_SECONDS = 3;
const ACTIVE_TIME_MS = 1000;

type RockPaperScissorsAllowedGesture = "paper" | "rock" | "scissors";
const ROCK_PAPER_SCISSORS = ["paper", "rock", "scissors"] as RockPaperScissorsAllowedGesture[]

const SCORING_MATRIX: { [key: string]: { [key: string]: number } } = {
    "paper": {
        "rock": 1,
        "scissors": -1
    },
    "rock": {
        "scissors": 1,
        "paper": -1
    },
    "scissors": {
        "paper": 1,
        "rock": -1
    }
}


export default function PaperRockScissorsGame() {
    const [count, setCount] = useState(-1);
    const countRef = useRef(-1);

    const [active, setActive] = useState(false)

    const startButtonDisabledContainer = useRef(false);
    const [startButtonDisabled, setStartButtonDisabled] = useState(false)

    const setSynchronizedButtonDisabled = (buttonDisabled: boolean) => {
        startButtonDisabledContainer.current = buttonDisabled
        setStartButtonDisabled(buttonDisabled)
    }

    const gestureContext = useContext(GestureContext)

    const [playerGesture, setPlayerGesture] = useState<RockPaperScissorsAllowedGesture | null>(null)
    const [computerGesture, setComputerGesture] = useState<RockPaperScissorsAllowedGesture | null>(null)

    const [turn, setTurn] = useState<number>(0)


    const [playerScore, setPlayerScore] = useState<number>(0)
    const [computerScore, setComputerScore] = useState<number>(0)


 
    const startCountDown = (time: number) => {
        if(!startButtonDisabledContainer.current && !startButtonDisabled){

            setSynchronizedButtonDisabled(true)

            console.log("Start countdown")
            countRef.current = time
            setCount(time)
            const interval = setInterval(() => {
                if (countRef.current > 0) {
                    countRef.current = countRef.current - 1
                    
                    if (countRef.current === 0) {

                        setActive(true)
                        console.log("Time active")
                        setCount(0);
                        setTimeout(() => {
                            
                            setActive(false)
                            console.log("Active time ended")
                            setSynchronizedButtonDisabled(false)

                        }, ACTIVE_TIME_MS)
                        clearInterval(interval)
                    } else {
                        setCount(countRef.current);
                    }
                     
                }
            }, 1000);
            return interval
        }
    }


    const makeGesture = (gesture: RockPaperScissorsAllowedGesture) => {
        if (active && gesture && ROCK_PAPER_SCISSORS.includes(gesture)) {
            console.log("Triggered gesture: " + gesture)
            setActive(false)
            setPlayerGesture(gesture)
            setComputerGesture(ROCK_PAPER_SCISSORS[Math.floor(Math.random() * ROCK_PAPER_SCISSORS.length)])
            setTurn(turn + 1)
        }
    }

    useEffect(() => {
        if (playerGesture && computerGesture && computerGesture !== playerGesture) {
            const scoreChange = SCORING_MATRIX[playerGesture][computerGesture]
            if (scoreChange > 0) {
                setPlayerScore(playerScore + scoreChange)
            } else {
                setComputerScore(computerScore - scoreChange)
            }
        }
    }, [turn])

    return (
        <Grid container item direction="column" justify="center" alignItems="center" spacing={3} style={{ paddingTop: '20px' }}>
            <Grid item container justify="space-around">
                <Grid item><Typography>Player</Typography></Grid>
                <Grid item><Typography>Turn: {turn}</Typography></Grid>
                <Grid item><Typography>Computer</Typography></Grid>
            </Grid>
            <Grid item container justify="space-around">
                <Grid item><Typography>Score: {playerScore}</Typography></Grid>
                <Grid item></Grid>
                <Grid item><Typography>Score: {computerScore}</Typography></Grid>
            </Grid>
            <Grid item>
                <GestureEventButton disabled={startButtonDisabled} gestureEvent="rock" onClick={() => startCountDown(COUNTDOWN_TIME_IN_SECONDS)}>
                    <img width={100} height={100} src={gestureContext.state.savedGestures["rock"]?.previewUrl}></img>
                        Rock to start countdown
                </GestureEventButton>
            </Grid>
            <Grid container item justify="center" alignItems="center">
                <Typography>{count > 0 && <h1> {count} </h1>}</Typography>
                <Typography>{active && <h1>Make your choice now</h1>}</Typography>
            </Grid>
            <Grid item container justify="space-around">
                <Grid item container direction="column" alignItems="center" xs={6}>
                    {playerGesture &&
                        <>
                            <Grid item><img width={100} height={100} src={gestureContext.state.savedGestures[playerGesture]?.previewUrl}></img></Grid>
                            <Grid item><Typography>{playerGesture}</Typography></Grid>
                        </>
                    }
                </Grid>
                <Grid item container direction="column" alignItems="center" xs={6}>
                    {computerGesture &&
                        <>
                            <Grid item><img width={100} height={100} src={gestureContext.state.savedGestures[computerGesture]?.previewUrl}></img></Grid>
                            <Grid item><Typography>{computerGesture}</Typography></Grid>
                        </>
                    }
                </Grid>
            </Grid>
            { gestureContext.state &&
                <Grid item container justify="space-around">
                    {
                        ROCK_PAPER_SCISSORS.map(gestureName =>
                            <Grid item key={gestureName} >
                                <GestureEventButton disabled={!active} gestureEvent={gestureName} onClick={() => makeGesture(gestureName)}>
                                    <img style={{}} width={100} height={100} src={gestureContext.state.savedGestures[gestureName]?.previewUrl}></img>
                                    {gestureName}
                                </GestureEventButton>
                            </Grid>
                        )
                    }

                </Grid>
            }
        </Grid>
    );
}
