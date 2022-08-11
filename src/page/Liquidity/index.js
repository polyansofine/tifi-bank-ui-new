import {
  Alert,
  Button,
  CircularProgress,
  ClickAwayListener,
  Collapse,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  StyledInnerPaper,
  StyledInputPaper,
  StyledPaper,
  StyleInput,
} from "../../components/LiquidityComponents/StyledPaper";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import coin from "../../assets/image/coin.gif";
import { Box } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import TokenSearchModal, { TYPE_LIQUIDITY } from "../Swap/TokenSearchModal";
import { motion } from "framer-motion/dist/framer-motion";
import { CONTRACT_ADDRESS } from "../../config/contract_address";
import getPrice from "../../config/abi/GetPrice.json";
import { ethers } from "ethers";
import * as fuseActions from "../../store/actions";
import { minABI } from "../../config/TiFi_min_abi";
import metamask from "../../assets/image/Metamask-icon.svg";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RouterABI from "../../config/abi/TiFiRouter.json";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ROOT_PATH } from "../../config/constants";
import { useNavigate } from "react-router-dom";
import WalletConnect from "../../components/WalletConnect";
import {
  toFixed,
  getTokenPriceUsingAmount,
  getErrorMessage,
  extendToBigNumber,
} from "../../utils/tifi";
import { BASE_BSC_SCAN_URLS } from "../../components/WalletConnectButton/config/index";
import useTranslation from "../../context/Localization/useTranslation";

const transition = {
  duration: 1,
  ease: [0.43, 0.13, 0.23, 0.96],
};
const imageVariants = {
  exit: { y: "10%", opacity: 0, transition },
  enter: {
    y: "0%",
    opacity: 1,
    transition,
  },
};
const Liquidity = () => {
  const { t } = useTranslation();
  const { reserve0, reserve1 } = useSelector(
    ({ tokenReducers }) => tokenReducers.token
  );
  const { token0, token1 } = useSelector(
    ({ tokenReducers }) => tokenReducers.liquidity
  );
  const { address, provider } = useSelector(
    ({ authReducers }) => authReducers.auth.auth
  );
  const [token_index, setTokenIndex] = useState(0);
  const [open, setOpen] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [price0, setPrice0] = useState("");
  const [price1, setPrice1] = useState("");
  const theme = useTheme();
  const [balance, setBalance] = useState();
  const [balance1, setBalance1] = useState();
  const [copy, setCopy] = useState(false);
  const [perPrice, setPerPrice] = useState([]);
  const [allow0_price, setAllowPrice0] = useState();
  const [allow1_price, setAllowPrice1] = useState();
  const [allow0, setAllow0] = useState(false);
  const [allow1, setAllow1] = useState(false);
  const [available_balance, setAvailableBalance] = useState(true);
  const [status, setStatus] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getTokenReserves = React.useCallback(
    async (address0, address1) => {
      if (provider) {
        const signer = provider.getSigner();
        let contractPrice = new ethers.Contract(
          CONTRACT_ADDRESS.GET_PRICE_ADDRESS,
          getPrice.abi,
          signer
        );
        if (address1 && address0 && address !== null) {
          try {
            const PriveVal = await contractPrice.getReserves(
              address0,
              address1
            );
            dispatch(
              fuseActions.getReserves(
                PriveVal[0] / 10 ** 18,
                PriveVal[1] / 10 ** 18
              )
            );
          } catch (error) {
            dispatch(
              fuseActions.showMessage({
                message: t(getErrorMessage(error)),
                variant: "error",
              })
            );
          }
        }
      }
    },
    [address, dispatch, provider, t]
  );

  const handleChange = (e, index) => {
    let tmpval = e.target.value ? e.target.value : 0;
    if (tmpval < 0 || isNaN(tmpval)) {
      tmpval = index === 0 ? price0 : price1;
    } else if (
      !(
        typeof tmpval === "string" &&
        (tmpval.endsWith(".") || tmpval.startsWith("."))
      )
    ) {
      tmpval = Number(e.target.value.toString());
    }

    if (index === 0) {
      if (tmpval > balance) {
        setAvailableBalance(false);
      } else {
        setAvailableBalance(true);
      }
      setPrice0(tmpval);
      setPrice1(toFixed((tmpval * reserve1) / reserve0));
      if (allow0_price > tmpval || token0.title === "BNB") {
        setAllow0(false);
      } else {
        setAllow0(true);
      }
      if (
        allow1_price > (tmpval * reserve1) / reserve0 ||
        token1.title === "BNB"
      ) {
        setAllow1(false);
      } else {
        setAllow1(true);
      }
    } else {
      if (tmpval > balance1) {
        setAvailableBalance(false);
      } else {
        setAvailableBalance(true);
      }
      setPrice1(tmpval);
      setPrice0(toFixed((tmpval * reserve0) / reserve1));
      if (allow1_price > tmpval || token1.title === "BNB") {
        setAllow1(false);
      } else {
        setAllow1(true);
      }
      if (
        allow0_price > (tmpval * reserve0) / reserve1 ||
        token0.title === "BNB"
      ) {
        setAllow0(false);
      } else {
        setAllow0(true);
      }
    }
  };

  const getBalance = React.useCallback(
    async (token, index) => {
      if (Object.keys(token).length === 0) {
        if (index === 0) {
          setBalance(0);
        } else {
          setBalance1(0);
        }
        return 0;
      }
      const signer = provider.getSigner();
      let contract = new ethers.Contract(token.address, minABI, signer);
      try {
        if (address != null) {
          const token0Bal = await contract.balanceOf(address);
          const token0Decimals = await contract.decimals();
          if (token.title === "BNB") {
            const bnbBalbuf = await provider.getBalance(address);
            const balBNB = ethers.utils.formatUnits(bnbBalbuf, "ether");
            if (index === 0) {
              setBalance(Number(balBNB));
            } else {
              setBalance1(Number(balBNB));
            }
            return Number(balBNB);
          } else {
            if (index === 0) {
              setBalance(Number(token0Bal._hex) / Number(10 ** token0Decimals));
            } else {
              setBalance1(
                Number(token0Bal._hex) / Number(10 ** token0Decimals)
              );
            }
            return Number(token0Bal._hex) / Number(10 ** token0Decimals);
          }
        } else {
          return 0;
        }
      } catch (error) {
        return 0;
      }
    },
    [address, provider]
  );
  const handleAddToken = async (index) => {
    try {
      let decimal;
      let contract;
      const signer = provider.getSigner();
      if (index === 0) {
        contract = new ethers.Contract(token0.address, minABI, signer);
      } else {
        contract = new ethers.Contract(token1.address, minABI, signer);
      }
      decimal = await contract.decimals();
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: index === 0 ? token0.address : token1.address, // The address that the token is at.
            symbol: index === 0 ? token0.title : token1.title, // A ticker symbol or shorthand, up to 5 chars.
            decimals: decimal,
          },
        },
      });
      if (wasAdded) {
        dispatch(
          fuseActions.showMessage({
            message: `${index === 0 ? token0.title : token1.title} ${t(
              "successful added"
            )}`,
            variant: "success",
          })
        );
      } else {
        dispatch(
          fuseActions.showMessage({
            message: `${index === 0 ? token0.title : token1.title} ${t(
              "added failed"
            )}`,
            variant: "error",
          })
        );
      }
    } catch (error) {
      dispatch(
        fuseActions.showMessage({
          message: t(getErrorMessage(error)),
          variant: "error",
        })
      );
    }
  };

  const getPerPrice = (reserve0, reserve1) => {
    const perPrice0 = getTokenPriceUsingAmount(reserve0, reserve1, 1);
    const perPrice1 = getTokenPriceUsingAmount(reserve1, reserve0, 1);
    setPerPrice([toFixed(perPrice0), toFixed(perPrice1)]);
  };

  const handleCopy = async (index) => {
    navigator.clipboard
      .writeText(index === 0 ? token0.address : token1.address)
      .then(
        function () {
          setCopy(index === 0 ? 0 : 1);
          setTimeout(() => setCopy(false), 1000);
        },
        function (err) {
          console.error("Async: Could not copy text: ", err);
          setCopy(false);
        }
      );
  };

  const checkAllowance = React.useCallback(
    async (address0, address1) => {
      if (
        Object.keys(token0).length === 0 ||
        Object.keys(token1).length === 0
      ) {
        setAllow0(false);
        setAllow1(false);
        setAllowPrice0(0);
        setAllowPrice1(1);
        return;
      }
      const signer = provider.getSigner();
      if (token0.title === "BNB") {
        setAllow0(false);
        setAllowPrice0(0);
      } else {
        let contract0 = new ethers.Contract(address0, minABI, signer);
        const allow_price0 = await contract0.allowance(
          address,
          CONTRACT_ADDRESS.ROUTER_ADDRESS
        );
        setAllowPrice0(allow_price0 / 10 ** 18);
      }
      if (token1.title === "BNB") {
        setAllow1(false);
        setAllowPrice1(0);
      } else {
        let contract1 = new ethers.Contract(address1, minABI, signer);

        const allow_price1 = await contract1.allowance(
          address,
          CONTRACT_ADDRESS.ROUTER_ADDRESS
        );
        setAllowPrice1(allow_price1 / 10 ** 18);
      }
    },
    [address, provider, token0, token1]
  );
  useEffect(() => {
    const getData = async () => {
      setPrice0(0);
      setPrice1(0);
      setAllow0(false);
      setAllow1(false);
      await getBalance(token0, 0);
      await getBalance(token1, 1);
      await getTokenReserves(token0.address, token1.address);
      await checkAllowance(token0.address, token1.address);
      getPerPrice(reserve0, reserve1);
    };
    if (address && provider) {
      getData();
    }
  }, [
    address,
    provider,
    token0,
    token1,
    reserve0,
    reserve1,
    checkAllowance,
    getBalance,
    getTokenReserves,
  ]);
  const handleTooltipClose = () => {
    setCopy(false);
  };
  const handleApprove = async (address, index) => {
    setStatus(true);
    try {
      const signer = provider.getSigner();
      let contract0 = new ethers.Contract(address, minABI, signer);

      let tx = await contract0.approve(
        CONTRACT_ADDRESS.ROUTER_ADDRESS,
        "1000000000000000000000000000000000000"
      );
      await tx.wait();
      dispatch(
        fuseActions.showMessage({
          message: t("Approved! Now you can add liquidity."),
          href: BASE_BSC_SCAN_URLS[tx.chainId] + "/tx/" + tx.hash,
          title: t("Check Transaction on BSCScan"),
          variant: "success",
        })
      );
      if (index === 0) {
        setAllow0(false);
      } else {
        setAllow1(false);
      }
    } catch (error) {
      dispatch(
        fuseActions.showMessage({
          message: t(getErrorMessage(error)),
          variant: "error",
        })
      );
    }
    setStatus(false);
  };

  const handleSupply = async () => {
    setStatus(true);
    const signer = provider.getSigner();
    let contractPrice = new ethers.Contract(
      CONTRACT_ADDRESS.ROUTER_ADDRESS,
      RouterABI.abi,
      signer
    );
    let dateInAWeek = new Date();
    const deadline = Math.floor(dateInAWeek.getTime() / 1000) + 1000000;
    if (address != null) {
      try {
        let tx;
        if (token0.title === "BNB") {
          let _amount = extendToBigNumber(price1);
          tx = await contractPrice.addLiquidityETH(
            token1.address,
            _amount,
            0,
            0,
            address,
            deadline,
            {
              value: ethers.utils.parseUnits(Number(price0).toString(), "ether")
                ._hex,
            }
          );
        } else if (token1.title === "BNB") {
          let _amount = extendToBigNumber(price0);
          tx = await contractPrice.addLiquidityETH(
            token0.address,
            _amount,
            0,
            0,
            address,
            deadline,
            {
              value: ethers.utils.parseUnits(Number(price1).toString(), "ether")
                ._hex,
            }
          );
        } else {
          let _amount = extendToBigNumber(price0);
          let _amount1 = extendToBigNumber(price1);
          tx = await contractPrice.addLiquidity(
            token0.address,
            token1.address,
            _amount,
            _amount1,
            0,
            0,
            address,
            deadline
          );
        }
        dispatch(
          fuseActions.showMessage({
            message: t("Transaction Submitted!"),
            href: BASE_BSC_SCAN_URLS[tx.chainId] + "/tx/" + tx.hash,
            title: t("Check Transaction on BSCScan"),
            variant: "info",
          })
        );
        await tx.wait();
        setPrice0(0);
        setPrice1(0);
        dispatch(
          fuseActions.showMessage({
            message: t("Liquidity Provision Success!"),
            href: BASE_BSC_SCAN_URLS[tx.chainId] + "/tx/" + tx.hash,
            title: t("Check Transaction on BSCScan"),
            variant: "success",
          })
        );
        await getBalance(token0, 0);
        await getBalance(token1, 1);
        await getTokenReserves(token0.address, token1.address);
        getPerPrice(reserve0, reserve1);
        setStatus(false);
      } catch (error) {
        setPrice0(0);
        setPrice1(0);
        dispatch(
          fuseActions.showMessage({
            message: t(getErrorMessage(error)),
            variant: "error",
          })
        );
        setStatus(false);
      }
    }
  };
  let sharePercent = (price0 / (reserve0 + price0)) * 100;
  sharePercent = isNaN(sharePercent) ? 0 : sharePercent;
  return (
    <motion.div initial="exit" animate="enter" exit="exit">
      <motion.div variants={imageVariants}>
        <Grid container justifyContent="center">
          <Grid item md={8}>
            <Box sx={{ width: "100%" }}>
              <Collapse in={open}>
                <Alert
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                  sx={{
                    mb: 2,
                    background: "#012",
                    color: "white",
                    borderRadius: 2,
                  }}
                >
                  {t(
                    "Tip: By adding liquidity you'll earn 0.18% of all trades on this pair proportional to your share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity."
                  )}
                </Alert>
              </Collapse>
            </Box>
          </Grid>
        </Grid>
        <Grid container justifyContent="center">
          <Grid item md={8}>
            {address ? (
              <StyledPaper>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ my: 3 }}
                >
                  <Grid item>
                    <IconButton
                      onClick={() => {
                        navigate(`${ROOT_PATH}/liquidity`, { replace: true });
                      }}
                    >
                      <ArrowBackIcon color="secondary" />
                    </IconButton>{" "}
                  </Grid>
                </Grid>
                <StyledInnerPaper>
                  <Grid container columnSpacing={4}>
                    <Grid item md={4}>
                      <Grid container alignItems="center" columnSpacing={1}>
                        <Grid item>
                          {token0.title ? (
                            <img
                              src={`${ROOT_PATH}/images/tokens/${token0.address}.png`}
                              alt={token0.title}
                              width="50px"
                            />
                          ) : (
                            <Box
                              sx={{
                                background: "#2E3348",
                                borderRadius: "8px",
                                p: 1,
                              }}
                            >
                              <img
                                src={coin}
                                alt={token1?.title}
                                width="40px"
                              />
                            </Box>
                          )}
                        </Grid>
                        <Grid item>
                          <Typography sx={{ ml: 2, fontSize: "14px" }}>
                            {t("Input")}
                          </Typography>
                          {token0.title ? (
                            <Button
                              onClick={() => {
                                setOpenModal(true);
                                setTokenIndex(0);
                              }}
                              endIcon={<KeyboardArrowDownIcon />}
                            >
                              {token0.title}
                            </Button>
                          ) : (
                            <Button
                              onClick={() => {
                                setOpenModal(true);
                                setTokenIndex(0);
                              }}
                              variant="outlined"
                              size="small"
                            >
                              {t("Select a token")}
                            </Button>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={8}>
                      <Grid container direction="column" rowSpacing={1}>
                        <Grid item>
                          <StyledInputPaper>
                            <StyleInput
                              placeholder="0.0"
                              value={price0}
                              onChange={(e) => handleChange(e, 0)}
                            />
                          </StyledInputPaper>
                        </Grid>
                        <Grid item>
                          <Grid
                            container
                            direction="row-reverse"
                            alignItems="center"
                            columnSpacing={1}
                          >
                            <Grid item>
                              <Typography>
                                {t("Balance")}: {balance}
                              </Typography>
                            </Grid>
                            <Grid item>
                              {token0.title !== "BNB" && (
                                <ClickAwayListener
                                  onClickAway={handleTooltipClose}
                                >
                                  <Tooltip
                                    open={copy === 0}
                                    title={t("copied")}
                                    placement="top"
                                    arrow
                                    disableFocusListener
                                    disableHoverListener
                                    disableTouchListener
                                    PopperProps={{
                                      disablePortal: true,
                                    }}
                                  >
                                    <IconButton
                                      size="small"
                                      onClick={() => handleCopy(0)}
                                    >
                                      <ContentCopyIcon
                                        fontSize="small"
                                        color="secondary"
                                        sx={{ color: "grey" }}
                                      />
                                    </IconButton>
                                  </Tooltip>
                                </ClickAwayListener>
                              )}
                            </Grid>
                            <Grid item>
                              {token0.title !== "BNB" && (
                                <IconButton onClick={() => handleAddToken(0)}>
                                  <img
                                    src={metamask}
                                    alt="MetaMask"
                                    width="20px"
                                    height="20px"
                                  />
                                </IconButton>
                              )}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </StyledInnerPaper>
                <div style={{ position: "relative" }}>
                  <Box
                    sx={{
                      border: "3px solid #161522",
                      color: "grey",

                      width: "65px",
                      height: "65px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      backgroundColor: "#202231",
                      position: "absolute",
                      top: "-25px",
                      left: "30px",
                    }}
                  >
                    <AddIcon color="secondary" />
                  </Box>
                </div>
                <StyledInnerPaper sx={{ mt: 3 }}>
                  <Grid container columnSpacing={4}>
                    <Grid item md={4}>
                      <Grid container alignItems="center" columnSpacing={1}>
                        <Grid item>
                          {token1.title ? (
                            <img
                              src={`${ROOT_PATH}/images/tokens/${token1.address}.png`}
                              alt={token1.title}
                              width="50px"
                            />
                          ) : (
                            <Box
                              sx={{
                                background: "#2E3348",
                                borderRadius: "8px",
                                p: 1,
                              }}
                            >
                              <img
                                src={coin}
                                alt={token1?.title}
                                width="40px"
                              />
                            </Box>
                          )}
                        </Grid>
                        <Grid item>
                          <Typography sx={{ ml: 2, fontSize: "14px" }}>
                            {t("Input")}
                          </Typography>
                          {token1.title ? (
                            <Button
                              onClick={() => {
                                setOpenModal(true);
                                setTokenIndex(1);
                              }}
                              endIcon={<KeyboardArrowDownIcon />}
                            >
                              {token1.title}
                            </Button>
                          ) : (
                            <Button
                              onClick={() => {
                                setOpenModal(true);
                                setTokenIndex(1);
                              }}
                              variant="outlined"
                              size="small"
                            >
                              {t("Select a token")}
                            </Button>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={8}>
                      <Grid container direction="column" rowSpacing={1}>
                        <Grid item>
                          <StyledInputPaper>
                            <StyleInput
                              placeholder="0.0"
                              value={price1}
                              onChange={(e) => handleChange(e, 1)}
                            />
                          </StyledInputPaper>
                        </Grid>
                        <Grid item>
                          <Grid
                            container
                            direction="row-reverse"
                            alignItems="center"
                            columnSpacing={1}
                          >
                            <Grid item>
                              <Typography>
                                {t("Balance")}: {balance1}
                              </Typography>
                            </Grid>
                            <Grid item>
                              {token1.title !== "BNB" && (
                                <ClickAwayListener
                                  onClickAway={handleTooltipClose}
                                >
                                  <Tooltip
                                    open={copy === 1}
                                    title={t("copied")}
                                    placement="top"
                                    arrow
                                    disableFocusListener
                                    disableHoverListener
                                    disableTouchListener
                                    PopperProps={{
                                      disablePortal: true,
                                    }}
                                  >
                                    <IconButton
                                      size="small"
                                      onClick={() => handleCopy(1)}
                                    >
                                      <ContentCopyIcon
                                        fontSize="small"
                                        color="secondary"
                                        sx={{ color: "grey" }}
                                      />
                                    </IconButton>
                                  </Tooltip>
                                </ClickAwayListener>
                              )}
                            </Grid>
                            <Grid item>
                              {token1.title !== "BNB" && (
                                <IconButton onClick={() => handleAddToken(1)}>
                                  <img
                                    src={metamask}
                                    alt="metamask"
                                    width="20px"
                                    height="20px"
                                  />
                                </IconButton>
                              )}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </StyledInnerPaper>
                <Collapse
                  in={token0.title && token1.title ? true : false}
                  sx={{ mt: 3 }}
                >
                  <StyledInnerPaper>
                    <Typography sx={{ mb: 2 }}>
                      {t("Price and pool share")}
                    </Typography>
                    <StyledInnerPaper text={+true}>
                      <Grid container columnSpacing={2}>
                        <Grid item md={4}>
                          <Grid
                            container
                            direction="column"
                            alignItems="center"
                          >
                            <Grid item>
                              <Typography>{perPrice[1]}</Typography>
                            </Grid>
                            <Grid item>
                              <Typography>
                                {token0.title} {t("per")} {token1.title}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item md={4}>
                          <Grid
                            container
                            direction="column"
                            alignItems="center"
                          >
                            <Grid item>
                              <Typography>{perPrice[0]}</Typography>
                            </Grid>
                            <Grid item>
                              <Typography>
                                {token1.title} {t("per")} {token0.title}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item md={4}>
                          <Grid
                            container
                            direction="column"
                            alignItems="center"
                          >
                            <Grid item>
                              <Typography>
                                {sharePercent > 100
                                  ? 100
                                  : sharePercent < 0.01
                                  ? "< 0.01"
                                  : toFixed(sharePercent)}
                                %
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography>{t("Share of pool")}</Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </StyledInnerPaper>
                  </StyledInnerPaper>
                  {allow0 && available_balance && (
                    <Button
                      onClick={() => handleApprove(token0.address, 0)}
                      fullWidth
                      variant="contained"
                      sx={{
                        background: theme.custom.gradient.grey,
                        height: "50px",
                        my: 2,
                      }}
                    >
                      {t("Enable")} {token0.title}
                    </Button>
                  )}
                  {allow1 && available_balance && (
                    <Button
                      onClick={() => handleApprove(token1.address, 1)}
                      fullWidth
                      variant="contained"
                      sx={{
                        background: theme.custom.gradient.grey,
                        height: "50px",
                        my: 2,
                      }}
                    >
                      {t("Enable")} {token1.title}
                    </Button>
                  )}
                  <Button
                    disabled={
                      allow0 ||
                      allow1 ||
                      !available_balance ||
                      price0 <= 0 ||
                      price1 <= 0
                    }
                    fullWidth
                    onClick={() => handleSupply()}
                    variant="contained"
                    sx={{
                      background: theme.custom.gradient.tifi,
                      height: "50px",
                      my: 2,
                    }}
                  >
                    {!available_balance ? (
                      t("Insufficent balance")
                    ) : status ? (
                      <CircularProgress />
                    ) : (
                      t("Supply")
                    )}
                  </Button>
                </Collapse>
              </StyledPaper>
            ) : (
              <StyledPaper>
                <Grid container justifyContent="center">
                  {t("Connect to a wallet to add liquidity.")}
                </Grid>
                <Grid container justifyContent="center">
                  <WalletConnect />
                </Grid>
              </StyledPaper>
            )}
          </Grid>
        </Grid>
        <TokenSearchModal
          open={openModal}
          handleClose={() => setOpenModal(false)}
          token_index={token_index}
          type={TYPE_LIQUIDITY}
        />
      </motion.div>
    </motion.div>
  );
};

export default Liquidity;
