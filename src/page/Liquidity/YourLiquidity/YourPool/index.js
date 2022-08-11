import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Button, CircularProgress, Grid, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { TOKENS } from "../../../../config/token";
import * as liquidityActions from "../../../../store/actions";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { minABI } from "../../../../config/TiFi_min_abi";
import { ROOT_PATH } from "../../../../config/constants";
import { toFixed } from "../../../../utils/tifi";
import useTranslation from "../../../../context/Localization/useTranslation";

export default function YourPool({ loading }) {
  const { t } = useTranslation();
  const { balances } = useSelector(
    ({ tokenReducers }) => tokenReducers.liquidity
  );
  const { provider } = useSelector(
    ({ authReducers }) => authReducers.auth.auth
  );
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  const [expanded, setExpanded] = React.useState(false);
  const [pool0, setPool0] = React.useState();
  const [pool1, setPool1] = React.useState();
  const [total, setTotal] = React.useState();
  const handleClick = (pair) => async (event, isExpanded) => {
    setExpanded(isExpanded ? pair.address : false);

    const signer = provider.getSigner();
    let contract = new ethers.Contract(pair.address, minABI, signer);

    let totalLp = await contract.totalSupply();
    setTotal(totalLp / 10 ** 18);
    let contaract0 = new ethers.Contract(pair.token0Address, minABI, signer);
    let contaract1 = new ethers.Contract(pair.token1Address, minABI, signer);
    let pooledToken0 = await contaract0.balanceOf(pair.address);
    let pooledToken1 = await contaract1.balanceOf(pair.address);
    setPool0(pooledToken0 / 10 ** 18);
    setPool1(pooledToken1 / 10 ** 18);
  };
  return (
    <div style={{ width: "100%" }}>
      {balances.length > 0 ? (
        balances.map((item, index) => (
          <Accordion
            sx={{ borderRadius: 16 }}
            key={index}
            expanded={expanded === item.address}
            onChange={handleClick(item)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#ffffff" }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{ background: "#202231", color: "#ffffff" }}
            >
              <Grid container direction="column">
                <Grid item>
                  <Grid container columnGap={2} alignItems="center">
                    <Grid item>
                      <img
                        src={`${ROOT_PATH}/images/tokens/${
                          TOKENS[
                            _.findIndex(TOKENS, function (o) {
                              return o.title === item.token0Title;
                            })
                          ].address
                        }.png`}
                        alt="coins"
                        width="30px"
                      />
                    </Grid>
                    <Grid item>
                      <img
                        src={`${ROOT_PATH}/images/tokens/${
                          TOKENS[
                            _.findIndex(TOKENS, function (o) {
                              return o.title === item.token1Title;
                            })
                          ].address
                        }.png`}
                        alt="coins1"
                        width="30px"
                      />
                    </Grid>
                    <Grid item>
                      <Typography>
                        {item.token0Title}/{item.token1Title}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid item>{t("Liquidity Pool Token Balance")}</Grid>
                  <Grid item>{toFixed(item.balance)}</Grid>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails sx={{ background: "#202231", color: "#ffffff" }}>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>
                  <Grid container alignItems="center">
                    <img
                      src={`${ROOT_PATH}/images/tokens/${
                        TOKENS[
                          _.findIndex(TOKENS, function (o) {
                            return o.title === item.token0Title;
                          })
                        ].address
                      }.png`}
                      alt="coins"
                      width="30px"
                    />
                    <Typography sx={{ ml: 2 }}>
                      {t("Pooled")} {item.token0Title}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item>
                  <Typography>
                    {toFixed((pool0 * item.balance) / total)}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                justifyContent="space-between"
                sx={{ mt: 2 }}
                alignItems="center"
              >
                <Grid item>
                  <Grid container alignItems="center">
                    <img
                      src={`${ROOT_PATH}/images/tokens/${
                        TOKENS[
                          _.findIndex(TOKENS, function (o) {
                            return o.title === item.token1Title;
                          })
                        ].address
                      }.png`}
                      alt="coins"
                      width="30px"
                    />
                    <Typography sx={{ ml: 2 }}>
                      {t("Pooled")} {item.token1Title}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item>
                  <Typography>
                    {toFixed((pool1 * item.balance) / total)}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                justifyContent="space-between"
                sx={{ mt: 2 }}
                alignItems="center"
              >
                <Typography>{t("Share of pool")}</Typography>
                <Typography>
                  {toFixed((100 * item.balance) / total) + "%"}
                </Typography>
              </Grid>
              <Grid container justifyContent="center">
                <Button
                  disabled={!pool0 || !pool1}
                  fullWidth
                  variant="contained"
                  sx={{
                    background: theme.custom.gradient.pink,
                    height: "50px",
                    mt: 3,
                    borderRadius: 1,
                  }}
                  onClick={() => {
                    item.pool0 = pool0;
                    item.pool1 = pool1;
                    item.total = total;
                    dispatch(liquidityActions.setRemove(item));
                  }}
                >
                  {t("Remove")}
                </Button>
              </Grid>
              <Grid container justifyContent="center">
                <Button
                  startIcon={<AddIcon />}
                  fullWidth
                  sx={{
                    height: "50px",
                    mt: 3,
                    color: "#fff",
                    background: theme.custom.gradient.tifi,
                  }}
                  onClick={() => {
                    dispatch(
                      liquidityActions.setTokens(
                        TOKENS[
                          _.findIndex(
                            TOKENS,
                            (o) => o.title === item.token0Title
                          )
                        ],
                        TOKENS[
                          _.findIndex(
                            TOKENS,
                            (o) => o.title === item.token1Title
                          )
                        ]
                      )
                    );
                    navigate("add");
                  }}
                >
                  {t("Add liquidity instead")}
                </Button>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          //   direction="column"
          rowGap={2}
        >
          <Grid item>
            {loading ? (
              <CircularProgress />
            ) : (
              <Typography>{t("No liquidity found")}</Typography>
            )}
          </Grid>
        </Grid>
      )}
    </div>
  );
}
