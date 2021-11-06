import React, {ReactNode, MutableRefObject, useState, useContext, useRef, useEffect} from 'react';
import { GestureEventContext } from '../GestureEventContext';
import { PalmContext } from '../PalmContext';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Grid, { GridSpacing } from '@material-ui/core/Grid';

import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';

export const GestureEventContextManager = () => {
  const gestureEventContext = useContext(GestureEventContext)
  const [eventName, setEventName] = useState("")
  const [errorMessage, setErrorMessage] = useState(null as string | null)



  const addEvent = (eventName: string) => {
    if (!Object.keys(gestureEventContext.state.gestureEventMapping).includes(eventName)) {
      gestureEventContext.actions.addEvent(eventName);
      setEventName("")
    } else {
      setErrorMessage("Duplicated Item")
    }
  }

  const onChange = (eventName: string) => {
    setEventName(eventName)
    if (errorMessage) {
      setErrorMessage(null)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const fileReader = new FileReader();
    const e = event as React.ChangeEvent<HTMLInputElement>;
    if (e.target && e.target.files) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = e => {
        if (e.target && e.target.result) {
          const result = JSON.parse(e.target.result as string) as { [key: string]: Array<string> }
          gestureEventContext.actions.setEventMapping(result);
        }
      };
    }

  };

  return (
    <Grid item container direction="column" spacing={1}>
      <Grid item>
        <input type="file" onChange={(e) => handleChange(e)} />
        <Link href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(gestureEventContext.state.gestureEventMapping))}`} download="events.json">
          Export Events
        </Link>
      </Grid>
      <Grid item>
        <TextField
          error={errorMessage != null}
          label={"New event name"}
          value={eventName}
          onChange={e => onChange(e.target.value)}
          helperText={errorMessage}
          InputProps={{endAdornment: <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => addEvent(eventName)}>
            Add
        </Button>}}
        />
        
      </Grid>
      <Grid item container direction="column" justify="flex-start" spacing={1}>
        {
          Object.entries(gestureEventContext.state.gestureEventMapping).map((eventEntry) => 
            <Grid item key={eventEntry[0]}>
              <MultipleSelect
                name={eventEntry[0]}
                gestures={eventEntry[1]}
                allGestures={gestureEventContext.state.gesturesNames}
                setGestures={(gestures: string[]) => gestureEventContext.actions.setEventGestures(eventEntry[0], gestures)}
              />
              <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={() => gestureEventContext.actions.removeEvent(eventEntry[0])}
                >
                Delete
              </Button>
            </Grid>
          )
        }
      </Grid>
    </Grid>
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      width: '100%',
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
  }),
);




export default function MultipleSelect({ name, allGestures, gestures, setGestures}: { name: string, allGestures: Array<string>, gestures: Array<string>, setGestures: (gestures: string[]) => void }) {
  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setGestures(event.target.value as string[]);
  };

  return (
    <Grid item>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-mutiple-chip-label">{name}</InputLabel>
        <Select
          labelId="demo-mutiple-chip-label"
          id="demo-mutiple-chip"
          multiple
          value={gestures}
          onChange={handleChange}
          input={<Input id="select-multiple-chip" />}
          renderValue={(selected) => (
            <div className={classes.chips}>
              {(selected as string[]).map((value) => (
                <Chip key={value} label={value} className={classes.chip} />
              ))}
            </div>
          )}
        >
          {allGestures.map((gesture) => (
            <MenuItem key={gesture} value={gesture}>
              {gesture}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
}