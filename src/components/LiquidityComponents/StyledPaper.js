import { ButtonBase, InputBase, Paper, styled } from "@mui/material";
import React from "react";

export const StyledPaper = styled(Paper)(({ theme, text }) => ({
  width: text ? "100%" : "100%",
  minWidth: "700px",
  [theme.breakpoints.down("md")]: {
    minWidth: "90vw",
  },
  padding: text ? "10px" : "10px 18px",
  borderRadius: "16px",
  background: "#161522",
  color: "grey",
}));
export const StyledChartPaper = styled(Paper)(({ theme, text }) => ({
  width: text ? "100%" : "100%",
  minWidth: "450px",
  padding: text ? "10px" : "10px 18px",
  borderRadius: "16px",
  background: "#161522",
  color: "grey",
}));
export const StyledInputPaper = styled(Paper)(({ text }) => ({
  width: text ? "100%" : "100%",
  // maxWidth: 700,
  // minWidth: text && "450px",
  padding: text ? "10px" : "10px 18px",
  borderRadius: "16px",
  background: "#161522",
  color: "grey",
}));

export const StyledInnerPaper = styled(Paper)(({ text }) => ({
  width: "100%",
  padding: text ? "16px" : "24px",
  borderRadius: text ? "16px" : "8px",
  border: text && "2px solid #161522",
  background: "#202231",
  color: "grey",
}));

export const StyleInput = styled(InputBase)(() => ({
  fontWeight: 800,
  fontSize: "24px",
  color: "#edf2f4",
  background: "#161522",
}));
export const StyledBtn = React.forwardRef(({ children, ...rest }, ref) => {
  return (
    <ButtonBase
      sx={{
        width: "80px",
        height: "50px",
        borderRadius: "8px",
        background:
          "linear-gradient(90deg, rgba(50,34,217,1) 12%, rgba(127,88,175,1) 51%, rgba(195,61,188,1) 96%)",
        color: "white",
        fontSize: "14px",
        fontWeight: 500,
      }}
    >
      {children}
    </ButtonBase>
  );
});
