import React, {  useState, useContext } from 'react';
import { PalmContext } from '../PalmContext';
import { Preview } from './Preview';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { GestureContext, GestureInfo, SavedGestures } from '../GestureContext'
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import IconButton from '@material-ui/core/IconButton';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import { Avatar } from '@material-ui/core';

export const GestureContextManager = () => {
  const gestureContext = useContext(GestureContext)
  const palmContext = useContext(PalmContext)

  const [currentGestureName, setCurrentGesture] = useState("")
  const [currentPreview, setCurrentPreview] = useState(null as { key: string, index: number } | null)
  
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const saveGesture = () => {
    if (palmContext.state) {
      gestureContext.actions.addGesture(currentGestureName, palmContext.state.landmarks)
    }
  }

  const removeGesture = () => {
    if (currentPreview) {
      gestureContext.actions.removeGesture(currentPreview.key, currentPreview.index)
      setCurrentPreview(null)
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target && e.target.files) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = e => {
        if (e.target && e.target.result) {
          const result = JSON.parse(e.target.result as string) as SavedGestures;
          gestureContext.actions.setGestures(result);
        }
      };
    }
  };

  const savedGestures = Object.keys(gestureContext.state.savedGestures)

  return (
    <Grid item container direction="column" spacing={1}>
      <Grid container item>
        <Grid item>
          <input type="file" onChange={(e) => handleChange(e)} />
        </Grid>
        <Grid item>
          <Link href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(gestureContext.state.savedGestures))}`} download="gestures.json">
            Export gestures
          </Link>
        </Grid>
      </Grid>
      <Grid item>
        <TextField
          label={"Gesture Name"}
          value={currentGestureName}
          onChange={e => setCurrentGesture(e.target.value)}
          InputProps={{
            endAdornment:
              <Button
                variant="contained"
                color="secondary"
                size="small"
                disabled={palmContext.state == null || currentGestureName === ""}
                onClick={saveGesture}>
                Save
                </Button>
          }}
        />
      </Grid>

      { savedGestures.length > 0 &&
        <Grid item>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Preview</TableCell>
                <TableCell>Gesture</TableCell>
                <TableCell>Samples number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                  ? savedGestures.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : savedGestures
                ).map((key) =>
                  <Row
                    key={key}
                    name={key}
                    gestureInfo={gestureContext.state.savedGestures[key]}
                    onItemClick={() => setCurrentGesture(key)}
                    setPreview={(index: number) => setCurrentPreview({ key: key, index: index })}></Row>
                )
              }
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 15, { label: 'All', value: -1 }]}
                  colSpan={3}
                  count={savedGestures.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true,
                  }}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </Grid>
      }

      {currentPreview &&
        <Dialog maxWidth={false} fullWidth={false} onClose={() => setCurrentPreview(null)} open={currentPreview != null}>
          <DialogTitle>{`${currentPreview.key} - ${currentPreview.index + 1}`}</DialogTitle>
          <DialogContent>
            <Preview points={gestureContext.state.savedGestures[currentPreview.key].gestures[currentPreview.index]} />
          </DialogContent>
          <DialogActions>
            <Button onClick={removeGesture}>Remove</Button>
          </DialogActions>
        </Dialog>
      }
    </Grid>
  )
}

function Row(
  {
    name,
    gestureInfo,
    onItemClick = () => { },
    setPreview = (_) => { } }:
    {
      name: string,
      gestureInfo: GestureInfo,
      onItemClick?: () => void,
      setPreview?: (index: number) => void
    }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell><Avatar variant="square" alt="Gesture preview" src={gestureInfo.previewUrl} /></TableCell>
        <TableCell><Button onClick={onItemClick}>{name}</Button></TableCell>
        <TableCell align="center" >{gestureInfo.gestures.length}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              {gestureInfo.gestures.map((_, index) =>
                <Button key={index} onClick={() => setPreview(index)}>
                  {index + 1}
                </Button>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}