import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { TOKENS } from "../../../config/token";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import * as tokenActions from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { ROOT_PATH } from "../../../config/constants";
import { encodedPairs, encodePair } from "../../../utils/tifi";
import useTranslation from "../../../context/Localization/useTranslation";

export const TYPE_SWAP = "TYPE_SWAP";
export const TYPE_LIQUIDITY = "TYPE_LIQUIDITY";

const TokenSearchModal = ({ open, handleClose, token_index, type }) => {
  if (!type) {
    type = TYPE_SWAP;
  }
  const dispatch = useDispatch();
  const { t } = useTranslation();
  let { token0, token1 } = useSelector(
    ({ tokenReducers }) => tokenReducers.token
  );
  const liquidity = useSelector(({ tokenReducers }) => tokenReducers.liquidity);
  if (type === TYPE_LIQUIDITY) {
    token0 = liquidity.token0; token1 = liquidity.token1;
  }
  const [searchString, setSearchString] = useState("");

  const handleChange = (e) => {
    setSearchString(e.target.value);
  };
  return (
    <Dialog
      open={open}
      PaperProps={{
        style: {
          width: "30%",
          minWidth: "300px",
          borderRadius: 3,
          border: "#666 1px solid",
          background: "#026",
          color: "white",
        },
      }}
      sx={{
        p: 6,
      }}
      onClose={handleClose}
    >
      <IconButton
        onClick={handleClose}
        sx={{ position: "absolute", top: 4, right: 4, color: "white" }}
      >
        <ClearOutlinedIcon />
      </IconButton>
      <DialogTitle>
        <Typography sx={{ mb: 4 }}>{
          type === TYPE_SWAP ? t(`Swap ${token_index === 0 ? "from" : "to"}`) : t(`Select the ${token_index === 0 ? "first" : "second"} token`)
        }</Typography>
        <Typography sx={{ mb: 4 }}>{
          (token_index === 0 && Object.keys(token0).length === 0) || (token_index === 1 && Object.keys(token1).length === 0) ? `${t("Only tokens that paired with ")}${token_index === 0 ? token1.title : token0.title}${t(" are listed")}` : t("The following tokens are listed in TiFi Bank")
        }</Typography>
        <TextField
          sx={{
            background: "white",
            border: "none",
            borderRadius: 6,
            color: "black",
          }}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon />
              </InputAdornment>
            ),
          }}
          value={searchString}
          onChange={(e) => handleChange(e)}
        />
      </DialogTitle>
      <DialogContent
        sx={{
          height: "400px",
          background: "#012",
          border: "#1E1E1E 1px solid",
          m: 2,
          p: 0,
          borderRadius: 2,
        }}
      >
        <List>
          {TOKENS.filter(item => {
            if (type === TYPE_LIQUIDITY) {
              if ((token_index === 0 && Object.keys(token0).length === 0 && (!encodedPairs.has(encodePair(item.title, token1.title)))) ||
                (token_index === 1 && Object.keys(token1).length === 0 && (!encodedPairs.has(encodePair(item.title, token0.title))))) {
                return false;
              }
            }

            let searchStr = searchString.toLowerCase();
            return (!((token_index === 0 && item.title === token1.title) || (token_index === 1 && item.title === token0.title)))
              && (item.title.toLowerCase().indexOf(searchStr) >= 0 || item.description.toLowerCase().indexOf(searchStr) >= 0);
          }).map((item, index) => (
            <ListItem
              key={index}
              sx={{
                "&: hover": {
                  background: "#3730A3",
                  borderRadius: 2,
                },
              }}
              onClick={() => {
                handleClose();
                if (token_index === 1) {
                  type === TYPE_LIQUIDITY ? dispatch(tokenActions.setTokens(Object.keys(token1).length === 0 ? token0 : {}, item)) : dispatch(tokenActions.selectToken(null, item));
                } else {
                  type === TYPE_LIQUIDITY ? dispatch(tokenActions.setTokens(item, Object.keys(token0).length === 0 ? token1 : {})) : dispatch(tokenActions.selectToken(item, null));
                }
                setSearchString("");
              }}
            >
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <img
                    width="35px"
                    height="35px"
                    src={`${ROOT_PATH}/images/tokens/${item.address}.png`}
                    alt={item.title}
                    style={{ borderRadius: "50%" }}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="caption">{item.description}</Typography>
                  <Typography>{item.title}</Typography>
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
        <Typography sx={{ color: "white" }}></Typography>
      </DialogContent>
    </Dialog>
  );
};

export default TokenSearchModal;
