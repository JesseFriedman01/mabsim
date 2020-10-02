import React, { useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";
import SettingsEthernetIcon from "@material-ui/icons/SettingsEthernet";
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles({
  root: {
    width: "98%",
    marginLeft: "1%",
    marginRight: "1%",
    marginBottom: 30,
    marginTop: 20,
    paddingTop:0,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    border:'solid',
    borderWidth:'thin',
    borderColor:'#c7c7c7'
  },
  input: {
    width: 45
  }
});

export default function InputSlider(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(props.current_round);

  useEffect(() => {
      setValue(props.current_round);
   }, [props.current_round]);

  const handleSliderChange = (event, newValue) => {
  props.getCurrentRound(newValue);
    setValue(newValue);
  };

  const handleSliderCommit = (event, newValue) => {
  props.getCurrentRound(newValue);
    setValue(newValue);
//    props.getCurrentRound(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value))
    props.getCurrentRound(event.target.value === '' ? '' : Number(event.target.value))
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > props.num_rounds - 1) {
      setValue(props.num_rounds - 1);
    }
  };

  return (
        <Card className={classes.root} variant="outlined">
          <Typography id="input-slider" gutterBottom>
                <h4>Round Selector</h4>
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <Slider
                value={props.current_round}
                onChange={handleSliderChange}
                onChangeCommitted={handleSliderCommit}
                max={props.num_rounds - 1}
                aria-labelledby="input-slider"
              />
            </Grid>
            <Grid item>
              <Input
                className={classes.input}
                value={value}
                margin="dense"
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{
                  step: 1,
                  min: 0,
                  max: props.num_rounds - 1,
                  type: "number",
                  "aria-labelledby": "input-slider"
                }}
              />
            </Grid>
          </Grid>
          </Card>
  );
}
