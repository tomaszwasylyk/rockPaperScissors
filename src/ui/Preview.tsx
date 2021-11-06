import React, { useState, ReactNode } from "react";
import Typography from "@material-ui/core/Typography";
import Preview3D from "./Preview3D";
import CanvasContext from "./CanvasContext";
import Grid from "@material-ui/core/Grid";
import Switch from "@material-ui/core/Switch";

export const Preview = ({
  title,
  points,
  buttons,
  source,
}: {
  title?: string;
  points?: [number, number, number][];
  buttons?: ReactNode[];
  source?: HTMLVideoElement;
}) => {
  const [showPreview3D, setShowPreview3D] = useState(false);

  return (
    <Grid item container justify="center" alignItems="center" spacing={2}>
      {title && (
        <Grid item>
          <Typography variant="h5">{title}</Typography>
        </Grid>
      )}
      <Grid item>
        {showPreview3D ? (
          <Preview3D points={points} />
        ) : (
            <CanvasContext source={source} landmarks={points} />
          )}
      </Grid>
      <Grid item container spacing={2} justify="center" alignItems="center">
        <Grid item container component="label" justify="center" alignItems="center"   spacing={1}>
          <Grid item>2D</Grid>
          <Grid item>
            <Switch
              checked={showPreview3D}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setShowPreview3D(event.target.checked)
              }
              name="checkedC"
            />
          </Grid>
          <Grid item>3D</Grid>
        </Grid>
        <Grid item>{buttons}</Grid>
      </Grid>
    </Grid>
  );
};
