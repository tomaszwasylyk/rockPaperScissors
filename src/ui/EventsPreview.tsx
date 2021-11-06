import React, { useContext } from 'react';
import { GestureEventContext } from '../GestureEventContext';
import { PalmContext } from '../PalmContext';
import { GestureContext } from '../GestureContext';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

export default function EventsPreview() {

  const palmContext = useContext(PalmContext)
  const gestureContext = useContext(GestureContext)
  const gestureEventContext = useContext(GestureEventContext)

  const roundNumber = (value: number | undefined) => {
    if (value) {
      return `${Math.round(value * 100) / 100}°`
    } else {
      return "None"
    }
  }

  return (
    <Grid item>
      <TableContainer >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                Current gesture
                </TableCell>
              <TableCell align="right">{gestureContext.state.currentGesture ? gestureContext.state.currentGesture : "No input"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Current events
                </TableCell>
              <TableCell align="right">{gestureEventContext.state.triggeredEvents != null ? gestureEventContext.state.triggeredEvents.join(', ') : "No input"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Hand Yaw
                </TableCell>
              <TableCell align="right">{roundNumber(palmContext.info?.handInfo?.yaw)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Hand Pitch
              </TableCell>
              <TableCell align="right">{roundNumber(palmContext.info?.handInfo?.pitch)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Hand Roll
              </TableCell>
              <TableCell align="right">{roundNumber(palmContext.info?.handInfo?.roll)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Index finger Pitch
              </TableCell>
              <TableCell align="right">{roundNumber(palmContext.info?.handInfo?.indexFingerPitch)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Pinky finger Pitch
              </TableCell>
              <TableCell align="right">{roundNumber(palmContext.info?.handInfo?.pinkyFingerPitch)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Thumb finger Pitch
              </TableCell>
              <TableCell align="right">{roundNumber(palmContext.info?.handInfo?.thumbFingerYaw)}</TableCell>
            </TableRow>

          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  )

}