import { createTheme } from "@mui/material";

const colorBlue = "#005bcf";
const colorGray = "#999";
const colorDarkBg = "#012";
const buttonBase = {
  borderRadius: 1,
  color: "#fff",
  border: "1px solid #666",
};

export const theme = createTheme({
  palette: {
    primary: {
      main: colorDarkBg,
      contrastText: "#fff",
    },
    secondary: {
      main: "#ccc",
      light: colorGray,
      dark: "#0077b6",
    },
    success: {
      main: colorBlue,
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: `
       body {
         -webkit-font-smoothing: auto;
         background-image: url('https://tifi.net/bank/images/bgwelcome.png');
         background-size: auto;
           color:#fff;
           background-repeat: no-repeat;
          }
          input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;}
          input[type=number] {
  -moz-appearance: textfield;
}
        }
       
     `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "3px",
          padding: "4px 10px",
          fontWeight: 700,
          textTransform: "capitalize",
          color: "#fff",
          "&:hover": {
            backgroundColor: colorBlue,
          },
          "&$selected": {
            color: "white",
          },
        },
      },
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
    caption: {
      fontSize: "10px",
      color: "#adb5bd",
    },
    body: {
      fontSize: "14px",
      color: "#ffffff",
    },
  },
  custom: {
    palette: {},
    gradient: {
      pink: `linear-gradient(90deg, rgba(198,20,203,1) 32%, rgba(143,13,94,1) 88%)`,
      grey: `linear-gradient(90deg, #969797 0%, #1E2848 100%)`,
      green: `linear-gradient(90deg, #32CE27 0%, #2A4428 100%)`,
      blue: `linear-gradient(90deg, #1FC7D3 0%, #0A4428 100%)`,
      tifi: `linear-gradient(90deg, #1161b1 0%, #005bcf 100%)`,
    },
    swapButton: {
      ...buttonBase,
      backgroundColor: colorBlue,
      height: "50px",
      my: 2,
    },
    disabledButton: {
      ...buttonBase,
      backgroundColor: colorGray,
      height: "50px",
      my: 2,
    },
  },
});
