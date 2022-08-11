import React from "react";
import { Card, CardContent, CardActions, Button, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import { ROOT_PATH } from "../../config/constants";
import useTranslation from "../../context/Localization/useTranslation";

const buttonStyle = {
  backgroundColor: "#005bcf",
  marginLeft: "auto",
  marginRight: 6,
  marginBottom: 5,
};
const Home = () => {
  const { t } = useTranslation();
  return (
    <>
      <h2>
        {t("Welcome to TiFi Bank!")}
        <br />
        {t("The First Decentralized Exchange for Allverse")}
      </h2>
      <br />
      <Grid container spacing={3}>
        <Grid item md={4} sm={6} xs={12}>
          <Card className="homecard">
            <CardContent>
              <Grid container spacing={0}>
                <Grid item xs={10}>
                  <h2>{t("Swap")}</h2>
                </Grid>
                <Grid item xs={2}>
                  <SwapHorizIcon fontSize="large" />
                </Grid>
              </Grid>
              <p>{t("Exchange Cryptos with other Cryptos")}</p>
            </CardContent>
            <CardActions>
              <Button
                component={Link}
                to={`${ROOT_PATH}/swap`}
                style={buttonStyle}
              >
                {t("GO TO SWAP")}
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item md={4} sm={6} xs={12}>
          <Card className="homecard">
            <CardContent>
              <Grid container spacing={0}>
                <Grid item xs={10}>
                  <h2>{t("Liquidity")}</h2>
                </Grid>
                <Grid item xs={2}>
                  <AccountBalanceIcon fontSize="large" />
                </Grid>
              </Grid>
              <p>{t("Enjoy Earning by Providing Liquidity")}</p>
            </CardContent>
            <CardActions>
              <Button
                component={Link}
                to={`${ROOT_PATH}/liquidity`}
                style={buttonStyle}
              >
                {t("GO TO LIQUIDITY")}
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item md={4} sm={12} xs={12}>
          <Card className="homecard">
            <CardContent>
              <Grid container spacing={0}>
                <Grid item xs={10}>
                  <h2>{t("Portfolio")}</h2>
                </Grid>
                <Grid item xs={2}>
                  <FindInPageIcon fontSize="large" />
                </Grid>
              </Grid>
              <p>{t("Provide Observerbility of Pool Portfolio")}</p>
            </CardContent>
            <CardActions>
              <Button
                component={Link}
                to={`${ROOT_PATH}/portfolio`}
                style={buttonStyle}
              >
                {t("GO TO PORTFOLIO")}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      <br />
      <Grid container justifyContent="center">
        <p>
          {t("We appeciate for any feedbacks, please submit your feedbacks")}{" "}
          <a href="https://forms.gle/UR75WgrFBLesj1HU9">{t("here")}</a>
          {t(", and you will have a chance to get TIFI airdrop!")}
        </p>
      </Grid>
    </>
  );
};

export default Home;
