import React, { ReactNode, useState } from 'react';
import { GestureContextManager } from './GestureContextManager'
import PalmContextPreview from './PalmContextPreview';
import Grid from '@material-ui/core/Grid';
import EventsPreview from './EventsPreview';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import DetailsIcon from '@material-ui/icons/Details';
import GestureIcon from '@material-ui/icons/Gesture';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { Button } from '@material-ui/core';

export default function DeveloperMenuButton() {

  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <Button variant="contained" color="secondary" onClick={() => setDrawerOpen(true)}>Open developer tools</Button>
      <SwipeableDrawer anchor='right' open={drawerOpen} onClose={() => setDrawerOpen(false)} onOpen={() => setDrawerOpen(true)} >
        <Grid container spacing={2} direction="column" justify="center" alignItems="center">
          <Grid item xs={12}>
            <PalmContextPreview />
          </Grid>
          <Grid item >
            <AppSettings></AppSettings>
          </Grid>
        </Grid>
      </SwipeableDrawer>
    </>
  )
}

export const DeveloperMenu = () => {

  return (
    <Grid item container spacing={2} direction="column" justify="center" alignItems="center">
      <Grid item>
        <PalmContextPreview />
      </Grid>
      <Grid item xs={12} style={{width: '100%'}}>
        <AppSettings></AppSettings>
      </Grid>
    </Grid>
  )

}

function AppSettings() {
  const [value, setValue] = React.useState(0);

  return (
    <>
      <Tabs
        value={value}
        onChange={(_: React.ChangeEvent<{}>, newValue: number) => setValue(newValue)}
        variant="scrollable"
        scrollButtons="on"
        indicatorColor="primary"
        textColor="primary" >
        <Tab label="Context preview" icon={<DetailsIcon />} />
        <Tab label="Gestures" icon={<GestureIcon />} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <EventsPreview />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <GestureContextManager />
      </TabPanel>
    </>
  )

}

function TabPanel({ children, value, index }: { children: ReactNode, value: number, index: number }) {

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}