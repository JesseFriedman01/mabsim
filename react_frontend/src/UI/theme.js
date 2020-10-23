import { createMuiTheme } from '@material-ui/core/styles';

const aetnaPurple = '#7d3f98'
const white = '#FFFFFF'

export default createMuiTheme({
      palette: {
        common:{
            main: white
        },
        primary:{
            main: aetnaPurple
        },
        secondary:{
            main: "#ffe6ff"
        }
      },
      typography: {
        h1:{
            fontColor: aetnaPurple
        },
        h2:{
            fontColor: aetnaPurple
        },
      }
});