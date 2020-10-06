import React, { useState, useEffect } from 'react';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';


export default function PlayPause(props) {
  const [round, setRound] = useState(props.current_round);
  const [isActive, setIsActive] = useState(!props.pause_slider);
  const [speed, setSpeed] = useState(1)

  function toggle() {
    setIsActive(!isActive);
  }

   useEffect(() => {
      setIsActive(!props.pause_slider);
      console.log('here', props.pause_slider)
  }, [props.pauseSlider]);

  useEffect(() => {
      setRound(props.current_round);
  }, [props.current_round]);

  useEffect(() => {
    let interval = null;
    if (isActive && round <= props.num_rounds) {
      interval = setInterval(() => {
        setRound(round => round + 1);
      }, 1000/speed);
      props.setCurrentRound(round);
      if (round === props.num_rounds){
        setIsActive(false)}
    } else if (!isActive && round !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, round]);

  const handleSpeedChange = (event) => {
    setSpeed(event.target.value)
  }

  return (
      <div>
        <IconButton
            className={`button button-primary button-primary-${isActive ? 'active' : 'inactive'}`}
            onClick={toggle}
            style={{color:'white', backgroundColor:'#7d3f98'}}>
                {isActive ? <PauseIcon  /> : <PlayArrowIcon />}
        </IconButton>

        <FormControl style={{marginLeft:10}}>
           <InputLabel>Speed</InputLabel>
           <Select
              native
              style={{padding:0}}
              value={speed}
              onChange={handleSpeedChange}
              inputProps={{
                name: 'speed',
                id: 'filled-speed-native-simple',
              }}
            >
              <option value={.5}>.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={3}>3x</option>
              <option value={5}>5x</option>
              <option value={10}>10x</option>
            </Select>
        </FormControl>
      </div>
  );
};

