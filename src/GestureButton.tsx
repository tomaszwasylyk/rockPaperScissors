import React, { useRef, useState, ReactNode, useContext, useEffect, MutableRefObject } from 'react';
import Button, { ButtonProps} from '@material-ui/core/Button';
import { GestureContext } from './GestureContext';

interface GestureEventButtonProps extends ButtonProps {
  gesturePreview?: string
  gestureEvent: string
  children?: ReactNode 
}

export default function GestureEventButton(props: GestureEventButtonProps) {

  const [buttonClicked, setButtonClicked] = useState(false)
  const buttonElement: MutableRefObject<HTMLButtonElement | null>  = useRef(null);
  const gestureContext = useContext(GestureContext)

  useEffect(() => {
    if(!props.disabled && !buttonClicked && props.onClick && gestureContext.state.currentGesture === props.gestureEvent){
      setButtonClicked(true);
      buttonElement.current?.click();
    }
    else if(props.disabled && buttonClicked){
        setButtonClicked(false);
    }
  }, [props.disabled, gestureContext.state.currentGesture])

  
  if(props){
    const {gestureEvent, ...buttonProps} = props
    return (
      <Button variant="outlined"  color="secondary" ref={buttonElement}
        {...buttonProps}
      >
        {props?.gesturePreview && props.gesturePreview in gestureContext.state.savedGestures && gestureContext.state.savedGestures[props.gesturePreview] }
        {props?.children}
      </Button>
    );
  } else {
    return <Button variant="outlined"  color="secondary" ref={buttonElement}></Button>
  }
 
}