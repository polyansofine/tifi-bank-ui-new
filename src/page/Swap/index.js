import {
  Paper,
  Typography,
  styled,
  Grid,
  Button,
  InputBase,
  Fab,
  useTheme,
  IconButton,
  CircularProgress,
  Tooltip,
  ClickAwayListener,
  Collapse,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import TokenSearchModal from "./TokenSearchModal";
import { useSelector, useDispatch } from "react-redux";
import { minABI } from "../../config/TiFi_min_abi";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../../config/contract_address";
import getPrice from "../../config/abi/GetPrice.json";
import WalletConnect from "../../components/WalletConnect";
import * as fuseActions from "../../store/actions";
import RouterABI from "../../config/abi/TiFiRouter.json";
import { motion } from "framer-motion/dist/framer-motion";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import metamask from "../../assets/image/Metamask-icon.svg";
import CachedIcon from "@mui/icons-material/Cached";
import { ROOT_PATH } from "../../config/constants";
import SettingModal from "../../components/SettingModal";
import getNodeUrl from "../../components/WalletConnectButton/utils/getRpcUrl";
import {
  toFixed,
  getTokenPriceUsingAmount,
  calculatePriceImpact,
  getErrorMessage,
  getTokenPath,
  tokenMap,
  getSwapPath,
} from "../../utils/tifi";
import { BASE_BSC_SCAN_URLS } from "../../components/WalletConnectButton/config/index";
import HelpIcon from "@mui/icons-material/Help";
import useTranslation from "../../context/Localization/useTranslation";

const StyledPaper = styled(Paper)(({ main }) => ({
  width: "100%",
  padding: "10px 18px",
  border: main ? "#666 1px solid" : "#444 1px solid",
  borderRadius: 5,
  backgroundColor: main ? "#026" : "#013",
  color: "white",
  "&:hover": {
    border: !main && "#666 1px solid",
  },
}));

const StyleInput = styled(InputBase)(() => ({
  fontWeight: 800,
  fontSize: "24px",
  color: "#edf2f4",
}));

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

const Swap = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [balance, setBalance] = useState();
  const [balance1, setBalance1] = useState();
  const [price0, setPrice0] = useState("");
  const [price1, setPrice1] = useState("");
  const [token_index, setTokenIndex] = useState(0);
  const [reserve_available, setReserveAvailable] = useState(false);
  const [balance_avaliable, setBalanceAvailable] = useState(false);
  const [status, setStatus] = useState(false);
  const [copy, setCopy] = useState(false);
  const [perPrice, setPerPrice] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [hoverOnSwitch, setHoverOnSwitch] = useState(false);
  const dispatch = useDispatch();
  const [settingModal, setSettingModal] = useState(false);
  const [priceImpact, setPriceImpact] = useState();
  const [swapPath, setSwapPath] = useState([]);
  const [extraReserve, setExtraReserve] = useState([]);

  const { address, provider } = useSelector(
    ({ authReducers }) => authReducers.auth.auth
  );
  const { token0, token1 } = useSelector(
    ({ tokenReducers }) => tokenReducers.token
  );
  const { reserve0, reserve1 } = useSelector(
    ({ tokenReducers }) => tokenReducers.token
  );

  const handleSettingClose = () => {
    setSettingModal(false);
  };

  const handleMax = async (index) => {
    if (index === 0) {
      setBalanceAvailable(true);
      if (token0.title === "BNB") {
        setPrice0(balance - 0.01 <= 0 ? 0 : balance - 0.01);

        if (balance - 0.01 > reserve0 * 0.9) {
          setReserveAvailable(false);
        } else {
          setReserveAvailable(true);
        }
        getTokenPrices(
          token0.address,
          balance - 0.01 <= 0 ? 0 : balance - 0.01
        );
      } else {
        setPrice0(balance);
        if (balance > reserve0 * 0.9) {
          setReserveAvailable(false);
        } else {
          setReserveAvailable(true);
        }
        getTokenPrices(token0.address, balance);
      }
    } else if (index === 1) {
      let priceBuf;
      if (token1.title === "BNB") {
        setPrice1(balance1 - 0.01 <= 0 ? 0 : balance1 - 0.01);
        priceBuf = getTokenPrices(
          token1.address,
          balance1 - 0.01 <= 0 ? 0 : balance1 - 0.01
        );
      } else {
        setPrice1(balance1);
        priceBuf = getTokenPrices(token1.address, balance1);
      }
      if (token0.title === "BNB") {
        if (priceBuf > balance - 0.01) {
          setBalanceAvailable(false);
        } else {
          setBalanceAvailable(true);
        }
      } else {
        if (priceBuf > balance) {
          setBalanceAvailable(false);
        } else {
          setBalanceAvailable(true);
        }
      }
      if (priceBuf > reserve0 * 0.9) {
        setReserveAvailable(false);
      } else {
        setReserveAvailable(true);
      }
    }
  };
  const getPerPrice = (reserve0, reserve1, reserve2, reserve3) => {
    const route = getTokenPath(token0.title, token1.title);
    let perPrice0 = getTokenPriceUsingAmount(reserve0, reserve1, 1);
    let perPrice1;
    if (route.length === 2) {
      perPrice1 = getTokenPriceUsingAmount(reserve1, reserve0, 1);
    } else {
      perPrice0 = getTokenPriceUsingAmount(
        reserve2 ? reserve2 : extraReserve[0],
        reserve3 ? reserve3 : extraReserve[1],
        perPrice0
      );
      perPrice1 = getTokenPriceUsingAmount(
        reserve3 ? reserve3 : extraReserve[1],
        reserve2 ? reserve2 : extraReserve[0],
        1
      );
      perPrice1 = getTokenPriceUsingAmount(reserve1, reserve0, perPrice1);
    }
    setPerPrice([toFixed(perPrice0), toFixed(perPrice1)]);
  };

  const handleChange = (e, index) => {
    if (e.target.value === "" || e.target.value === 0) {
      if (index === 0) {
        setPrice1("");
      } else {
        setPrice0("");
      }
    }
    const rgx = /^[0-9]*(\.\d{0,9})?$/;
    let result = e.target.value.toString().match(rgx);
    if (!result) {
      return;
    }
    let tmpValue2 = result[0];

    if (tmpValue2[0] === "0") {
      if (tmpValue2.length < 2) {
      } else {
        if (tmpValue2[1] === ".") {
        } else {
          tmpValue2 = tmpValue2.substring(1);
        }
      }
    }

    if (index === 0) {
      setPrice0(tmpValue2);
      getTokenPrices(token0.address, tmpValue2);
      let balanceBuf = balance;
      if (token0.title === "BNB") {
        balanceBuf -= 0.01;
      }
      if (tmpValue2 > balanceBuf) {
        setBalanceAvailable(false);
      } else {
        setBalanceAvailable(true);
        if (tmpValue2 > reserve0 * 0.9) {
          setReserveAvailable(false);
        } else {
          setReserveAvailable(true);
        }
      }
    } else {
      setPrice1(tmpValue2.toString());
      let token0AmountBuf = getTokenPrices(token1.address, tmpValue2);
      let balanceBuf = balance;
      if (token0.title === "BNB") {
        balanceBuf -= 0.01;
      }
      if (token0AmountBuf > balanceBuf) {
        setBalanceAvailable(false);
      } else {
        setBalanceAvailable(true);
        if (token0AmountBuf > reserve0 * 0.9) {
          setReserveAvailable(false);
        } else {
          setReserveAvailable(true);
        }
      }
    }
    getPerPrice(reserve0, reserve1);
  };
  const getBalance = React.useCallback(
    async (token, index) => {
      // const providers = new ethers.providers.Web3Provider(window.ethereum);
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
  const getTokenReserves = React.useCallback(
    async (address0, address1) => {
      let route = getTokenPath(token0.title, token1.title);
      let _provider = provider
        ? provider.getSigner()
        : new ethers.providers.JsonRpcProvider(getNodeUrl());
      let contractPrice = new ethers.Contract(
        CONTRACT_ADDRESS.GET_PRICE_ADDRESS,
        getPrice.abi,
        _provider
      );
      let r0, r1, r2, r3;
      if (address1 && address0) {
        try {
          if (route.length === 2) {
            setExtraReserve([]);
            const val = await contractPrice.getReserves(address0, address1);
            r0 = val[0] / 10 ** 18;
            r1 = val[1] / 10 ** 18;
            dispatch(fuseActions.getReserves(r0, r1));
          } else if (route.length === 3) {
            const rVal1 = await contractPrice.getReserves(
              address0,
              tokenMap.get("BNB")
            );
            const rVal2 = await contractPrice.getReserves(
              tokenMap.get("BNB"),
              address1
            );
            r0 = rVal1[0] / 10 ** 18;
            r1 = rVal1[1] / 10 ** 18;
            r2 = rVal2[0] / 10 ** 18;
            r3 = rVal2[1] / 10 ** 18;
            dispatch(fuseActions.getReserves(r0, r1));
            setExtraReserve([r2, r3]);
          } else {
            let error = new Error();
            error.code = "CALL_EXCEPTION";
            throw error;
          }
          getPerPrice(r0, r1, r2, r3);
        } catch (error) {
          dispatch(
            fuseActions.showMessage({
              message: t(getErrorMessage(error)),
              variant: "error",
            })
          );
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [address, dispatch, provider, token0.title, token1.title, t]
  );

  function getTokenPrices(addresfrom, amount) {
    if (amount <= 0 || isNaN(amount)) {
      if (
        amount === 0 ||
        (typeof amount === "string" && amount.trim() === "0")
      ) {
        setPrice0(0);
        setPrice1(0);
      }
      return 0;
    }
    let route = getTokenPath(token0.title, token1.title);
    if (addresfrom === token0.address) {
      let token1AmountBuf;
      let highImpact = amount / reserve0 <= 10 && amount / reserve0 >= 0.1;
      if (route.length === 2) {
        token1AmountBuf = toFixed(
          getTokenPriceUsingAmount(reserve0, reserve1, amount)
        );
      } else {
        let bnbBuf = toFixed(
          getTokenPriceUsingAmount(reserve0, reserve1, amount)
        );
        token1AmountBuf = toFixed(
          getTokenPriceUsingAmount(extraReserve[0], extraReserve[1], bnbBuf)
        );
      }
      setPrice1(token1AmountBuf);
      setPriceImpact(
        calculatePriceImpact(
          token1AmountBuf / amount / perPrice[0],
          amount / token1AmountBuf / perPrice[1],
          highImpact
        )
      );
      return token1AmountBuf;
    } else {
      let token0AmountBuf;
      let highImpact = amount / reserve1 <= 10 && amount / reserve1 >= 0.1;
      if (route.length === 2) {
        token0AmountBuf = toFixed(
          getTokenPriceUsingAmount(reserve1, reserve0, amount)
        );
      } else {
        let bnbBuf = toFixed(
          getTokenPriceUsingAmount(extraReserve[1], extraReserve[0], amount)
        );
        token0AmountBuf = toFixed(
          getTokenPriceUsingAmount(reserve1, reserve0, bnbBuf)
        );
      }
      setPrice0(token0AmountBuf);
      setPriceImpact(
        calculatePriceImpact(
          token0AmountBuf / amount / perPrice[1],
          amount / token0AmountBuf / perPrice[0],
          highImpact
        )
      );
      return token0AmountBuf;
    }
  }

  const handleSwap = async () => {
    setStatus(true);
    const signer = provider.getSigner();
    let contractPrice = new ethers.Contract(
      CONTRACT_ADDRESS.ROUTER_ADDRESS,
      RouterABI.abi,
      signer
    );
    let contract0 = new ethers.Contract(token0.address, minABI, signer);

    let dateInAWeek = new Date();
    const deadline = Math.floor(dateInAWeek.getTime() / 1000) + 1000000;
    try {
      if (address != null) {
        if (token0.title === "BNB") {
          try {
            let tx =
              await contractPrice.swapExactETHForTokensSupportingFeeOnTransferTokens(
                0,
                [token0.address, token1.address],
                address,
                deadline,
                {
                  value: ethers.utils.parseUnits(
                    Number(price0).toString(),
                    "ether"
                  )._hex,
                }
              );
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
                message: t("Swap Success!"),
                href: BASE_BSC_SCAN_URLS[tx.chainId] + "/tx/" + tx.hash,
                title: t("Check Transaction on BSCScan"),
                variant: "success",
              })
            );
            await getBalance(token0, 0);
            await getBalance(token1, 1);
            await getTokenReserves(token0.address, token1.address);
            setStatus(false);
          } catch (error) {
            setPrice0(0);
            setPrice1(0);
            dispatch(
              fuseActions.showMessage({
                message: error.data ? error.data.message : error.message,
                variant: "error",
              })
            );
            setStatus(false);
          }
        } else {
          if (token1.title === "BNB") {
            try {
              let _amount;
              if (Number(price0) < 100) {
                _amount = (Number(price0) * 10 ** 18).toString();
              } else {
                _amount = parseInt(price0).toString() + "000000000000000000";
              }
              const PriveVal = await contract0.allowance(
                address,
                CONTRACT_ADDRESS.ROUTER_ADDRESS
              );
              let tx;
              if (Number(PriveVal._hex) / 10 ** 18 < Number(price0)) {
                tx = await contract0.approve(
                  CONTRACT_ADDRESS.ROUTER_ADDRESS,
                  "1000000000000000000000000000000000000"
                );
                tx.wait();
                let _interVal = setInterval(async () => {
                  const PriveValBuf = await contract0.allowance(
                    address,
                    CONTRACT_ADDRESS.ROUTER_ADDRESS
                  );
                  if (Number(PriveValBuf._hex) / 10 ** 18 > Number(price0)) {
                    clearInterval(_interVal);
                    setStatus(false);
                    dispatch(
                      fuseActions.showMessage({
                        message: t("Approved, now you can swap!"),
                        href: BASE_BSC_SCAN_URLS[tx.chainId] + "/tx/" + tx.hash,
                        title: t("Check Transaction on BSCScan"),
                        variant: "success",
                      })
                    );
                  }
                }, 10000);
                dispatch(
                  fuseActions.showMessage({
                    message: t("Approval Request submitted. Please hold on."),
                    href: BASE_BSC_SCAN_URLS[tx.chainId] + "/tx/" + tx.hash,
                    title: t("Check Transaction on BSCScan"),
                    variant: "success",
                  })
                );
                return;
              } else {
                tx =
                  await contractPrice.swapExactTokensForETHSupportingFeeOnTransferTokens(
                    _amount,
                    0,
                    [token0.address, token1.address],
                    address,
                    deadline
                  );
                dispatch(
                  fuseActions.showMessage({
                    message: t("Transaction Submitted!"),
                    href: BASE_BSC_SCAN_URLS[tx.chainId] + "/tx/" + tx.hash,
                    title: t("Check Transaction on BSCScan"),
                    variant: "info",
                  })
                );
                await tx.wait();
              }
              setPrice0(0);
              setPrice1(0);
              dispatch(
                fuseActions.showMessage({
                  message: t("Swap Success!"),
                  href: BASE_BSC_SCAN_URLS[tx.chainId] + "/tx/" + tx.hash,
                  title: t("Check Transaction on BSCScan"),
                  variant: "success",
                })
              );
              await getBalance(token0, 0);
              await getBalance(token1, 1);
              await getTokenReserves(token0.address, token1.address);
              setStatus(false);
            } catch (error) {
              setPrice0(0);
              setPrice1(0);
              dispatch(
                fuseActions.showMessage({
                  message: error.data ? error.data.message : error.message,
                  variant: "error",
                })
              );
              setStatus(false);
            }
          } else {
            try {
              let _amount;
              if (Number(price0) < 100) {
                _amount = (Number(price0) * 10 ** 18).toString();
              } else {
                _amount = parseInt(price0).toString() + "000000000000000000";
              }
              const PriveVal = await contract0.allowance(
                address,
                CONTRACT_ADDRESS.ROUTER_ADDRESS
              );
              let tx;
              if (Number(PriveVal._hex) / 10 ** 18 < Number(price0)) {
                tx = await contract0.approve(
                  CONTRACT_ADDRESS.ROUTER_ADDRESS,
                  "1000000000000000000000000000000000000"
                );
                tx.wait();
                let _interVal = setInterval(async () => {
                  const PriveValBuf = await contract0.allowance(
                    address,
                    CONTRACT_ADDRESS.ROUTER_ADDRESS
                  );
                  if (Number(PriveValBuf._hex) / 10 ** 18 > Number(price0)) {
                    clearInterval(_interVal);
                    setStatus(false);
                    dispatch(
                      fuseActions.showMessage({
                        message: t("Approved, now you can swap!"),
                        href: BASE_BSC_SCAN_URLS[tx.chainId] + "/tx/" + tx.hash,
                        title: t("Check Transaction on BSCScan"),
                        variant: "success",
                      })
                    );
                  }
                }, 10000);
                dispatch(
                  fuseActions.showMessage({
                    message: t("Approval Request submitted. Please hold on."),
                    href: BASE_BSC_SCAN_URLS[tx.chainId] + "/tx/" + tx.hash,
                    title: t("Check Transaction on BSCScan"),
                    variant: "success",
                  })
                );
                return;
              } else {
                tx =
                  await contractPrice.swapExactTokensForTokensSupportingFeeOnTransferTokens(
                    _amount,
                    0,
                    getSwapPath(token0, token1),
                    address,
                    deadline
                  );
                dispatch(
                  fuseActions.showMessage({
                    message: t("Transaction Submitted!"),
                    href: BASE_BSC_SCAN_URLS[tx.chainId] + "/tx/" + tx.hash,
                    title: t("Check Transaction on BSCScan"),
                    variant: "info",
                  })
                );
                await tx.wait();
              }
              setPrice0(0);
              setPrice1(0);
              dispatch(
                fuseActions.showMessage({
                  message: t("Swap Success!"),
                  href: BASE_BSC_SCAN_URLS[tx.chainId] + "/tx/" + tx.hash,
                  title: t("Check Transaction on BSCScan"),
                  variant: "success",
                })
              );
              await getBalance(token0, 0);
              await getBalance(token1, 1);
              await getTokenReserves(token0.address, token1.address);
              setStatus(false);
            } catch (error) {
              setPrice0(0);
              setPrice1(0);
              dispatch(
                fuseActions.showMessage({
                  message: error.data ? error.data.message : error.message,
                  variant: "error",
                })
              );
              setStatus(false);
            }
          }
        }
      }
    } catch (error) {
      setPrice0(0);
      setPrice1(0);
      dispatch(
        fuseActions.showMessage({
          message: error.data ? error.data.message : error.message,
          variant: "error",
        })
      );
      setStatus(false);
    }
  };

  const handleCopy = async (index) => {
    navigator.clipboard
      .writeText(index === 0 ? token0.address : token1.address)
      .then(
        function () {
          setCopy(index === 0 ? 0 : 1);
        },
        function (err) {
          console.error("Async: Could not copy text: ", err);
          setCopy(false);
        }
      );
  };

  const handleTooltipClose = () => {
    setCopy(false);
  };

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
          message: `${t("Cannot find address of")} ${index === 0 ? token0.title : token1.title
            }${t(", have you connected MetaMask?")}`,
          variant: "error",
        })
      );
    }
  };

  useEffect(() => {
    const getData = async () => {
      await getBalance(token0, 0);
      await getBalance(token1, 1);
    };
    setPrice0(0);
    setPrice1(0);
    setSwapPath(getTokenPath(token0.title, token1.title));
    getTokenReserves(token0.address, token1.address);
    if (address && provider) {
      getData();
    } else {
      setBalance(0);
      setBalance1(0);
    }
  }, [
    address,
    provider,
    token0,
    token1,
    getBalance,
    getTokenReserves,
    reserve0,
    reserve1,
  ]);

  const CoinButton = React.forwardRef(({ src, children, ...rest }, ref) => {
    return (
      <Button
        ref={ref}
        {...rest}
        startIcon={
          <img
            width="20px"
            height="20px"
            style={{ borderRadius: "50%" }}
            src={src}
            alt="eth"
          />
        }
        color="primary"
        variant="contained"
        endIcon={<KeyboardArrowDownIcon />}
      >
        {children}
      </Button>
    );
  });

  const getSwapFee = () => {
    let fee = price0 / 500;
    if (extraReserve.length > 0) {
      fee *= 1.998;
    }
    return toFixed(fee);
  };

  const StyleChipBtn = React.forwardRef(({ children, ...rest }, ref) => {
    return (
      <Button
        {...rest}
        variant="outlined"
        ref={ref}
        color="info"
        sx={{ color: theme.palette.info.main }}
        size="small"
      >
        {children}
      </Button>
    );
  });
  const price = perPrice[refresh ? 0 : 1];
  return (
    <motion.div initial="exit" animate="enter" exit="exit">
      <motion.div variants={imageVariants}>
        <StyledPaper main={+true} sx={{ position: "relative" }}>
          <Typography variant="h6" sx={{ my: 2 }}>
            {t("Swap")}
          </Typography>
          <StyledPaper>
            <Grid
              container
              direction="row-reverse"
              alignItems="center"
              columnSpacing={1}
            >
              <Grid item>
                <CoinButton
                  onClick={() => {
                    setOpen(true);
                    setTokenIndex(0);
                  }}
                  src={`${ROOT_PATH}/images/tokens/${token0.address}.png`}
                >
                  {token0.title}
                </CoinButton>
              </Grid>
              <Grid item>
                {token0.title !== "BNB" && (
                  <ClickAwayListener onClickAway={handleTooltipClose}>
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
                      <IconButton size="small" onClick={() => handleCopy(0)}>
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
                      alt="metamask"
                      width="20px"
                      height="20px"
                    />
                  </IconButton>
                )}
              </Grid>
            </Grid>
            <Grid container direction="column">
              <Grid item>
                <StyleInput
                  placeholder="0.00"
                  fullWidth
                  value={isNaN(price0) ? 0 : price0}
                  onChange={(e) => handleChange(e, 0)}
                />
              </Grid>

              <Grid item>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid item>
                    <Typography sx={{ color: "#8a817c" }}>
                      {t("Balance")}{" "}
                      {Math.round(balance * 1000000000) / 1000000000 || 0}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <StyleChipBtn onClick={() => handleMax(0)}>
                      {t("Max")}
                    </StyleChipBtn>
                  </Grid>
                </Grid>{" "}
              </Grid>
            </Grid>
          </StyledPaper>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 1 }}
          >
            <Fab
              size="small"
              onClick={() => {
                setRefresh(false);
                setPriceImpact("NA");
                dispatch(fuseActions.selectToken(token1, token0));
              }}
              onMouseEnter={() => setHoverOnSwitch(true)}
              onMouseLeave={() => setHoverOnSwitch(false)}
            >
              {hoverOnSwitch ? <SwapVertIcon /> : <ArrowDownwardIcon />}
            </Fab>
          </Grid>
          <StyledPaper sx={{ mt: 1 }}>
            <Grid
              container
              direction="row-reverse"
              alignItems="center"
              columnSpacing={1}
            >
              <Grid item>
                <CoinButton
                  onClick={() => {
                    setOpen(true);
                    setTokenIndex(1);
                  }}
                  src={`${ROOT_PATH}/images/tokens/${token1.address}.png`}
                >
                  {token1.title}
                </CoinButton>
              </Grid>
              <Grid item>
                {token1.title !== "BNB" && (
                  <ClickAwayListener onClickAway={handleTooltipClose}>
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
                      <IconButton onClick={() => handleCopy(1)} size="small">
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
            <Grid container direction="column">
              <Grid item>
                <StyleInput
                  fullWidth
                  placeholder="0.00"
                  value={isNaN(price1) ? 0 : price1}
                  onChange={(e) => handleChange(e, 1)}
                />
              </Grid>
              <Grid item>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid item>
                    <Typography sx={{ color: "#8a817c" }}>
                      {t("Balance")}{" "}
                      {Math.round(balance1 * 1000000000) / 1000000000 || 0}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <StyleChipBtn onClick={() => handleMax(1)}>
                      {t("Max")}
                    </StyleChipBtn>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </StyledPaper>
          <Collapse
            in={price0 !== 0 && price0 !== "" && price1 !== 0 && price1 !== ""}
          >
            {isNaN(price) ? (
              ""
            ) : (
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>
                  <Typography sx={{ color: "#aaa" }}>{t("Price")}</Typography>
                </Grid>
                <Grid item>
                  <Grid container alignItems="center">
                    <Grid item>
                      <Typography sx={{ color: "#aaa" }}>
                        {price} {refresh ? token1.title : token0.title}{" "}
                        {t("per")} {refresh ? token0.title : token1.title}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <IconButton onClick={() => setRefresh((prev) => !prev)}>
                        <CachedIcon sx={{ color: "#aaa" }} />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Collapse>
          {/* )} */}
          {address ? (
            !price0 ? (
              <Button
                fullWidth
                sx={theme.custom.disabledButton}
                disabled={true}
              >
                {t("Enter Amount")}
              </Button>
            ) : !balance_avaliable || !reserve_available || priceImpact > 20 ? (
              <Button
                fullWidth
                disabled={true}
                sx={theme.custom.disabledButton}
              >
                {!reserve_available
                  ? priceImpact > 20
                    ? t("Price Impact Too High")
                    : t("Insufficient Liquidity for This Trade")
                  : priceImpact > 20
                    ? t("Price Impact Too High")
                    : t("Insufficient Balance")}
              </Button>
            ) : (
              <Button
                onClick={handleSwap}
                disabled={status}
                fullWidth
                sx={theme.custom.swapButton}
              >
                {status ? <CircularProgress /> : t("Swap")}
              </Button>
            )
          ) : (
            <WalletConnect type />
          )}

          {price0 > 0 ? (
            <StyledPaper sx={{ position: "relative", color: "#aaa" }}>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>
                  {t("Swap Fee")}
                  <Tooltip
                    title={
                      <div>
                        {t("Swap Fee is 0.2%, where:")}
                        <li>{t("0.18% is paid to LP Providers")}</li>
                        <li>{t("0.02% to the TiFi treasury")}</li>
                      </div>
                    }
                  >
                    <HelpIcon fontSize="xsmall" />
                  </Tooltip>
                </Grid>
                <Grid item>
                  {getSwapFee()} {token0.title}
                </Grid>
              </Grid>
              {isNaN(priceImpact) ? (
                ""
              ) : (
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid item>
                    {t("Price Impact")}{" "}
                    <Tooltip
                      title={t(
                        "The difference between the market price and estimated price due to trade size."
                      )}
                    >
                      <HelpIcon fontSize="xsmall" />
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    {priceImpact < 0.01 ? "< 0.01 %" : priceImpact + "%"}
                  </Grid>
                </Grid>
              )}
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>
                  {t("Route")}{" "}
                  <Tooltip
                    title={t(
                      "Routing through these tokens resulted in the best price for your trade."
                    )}
                  >
                    <HelpIcon fontSize="xsmall" />
                  </Tooltip>
                </Grid>
                <Grid item>{swapPath.join(" > ")}</Grid>
              </Grid>
              {token0.title === "TIFI" ? (
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid item>
                    {t("TIFI Sell Fee")}{" "}
                    <Tooltip
                      title={
                        <div>
                          {t("There is 2% of fee when selling TIFI, check ")}
                          <a
                            href="https://tifi.net/about/TiFiTokenWhitePaper.pdf"
                            rel="noreferrer"
                            target="_blank"
                          >
                            {t("TiFi Token Whitepaper")}
                          </a>
                          {t(" for more details.")}
                        </div>
                      }
                    >
                      <HelpIcon fontSize="xsmall" />
                    </Tooltip>
                  </Grid>
                  <Grid item>2%</Grid>
                </Grid>
              ) : (
                ""
              )}
              {token1.title === "TIFI" ? (
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid item>
                    {t("TIFI Buy Fee")}
                    <Tooltip
                      title={
                        <div>
                          {t("There is 1% of fee when buying TIFI, check ")}
                          <a
                            href="https://tifi.net/about/TiFiTokenWhitePaper.pdf"
                            rel="noreferrer"
                            target="_blank"
                          >
                            {t("TiFi Token Whitepaper")}
                          </a>
                          {t(" for more details.")}
                        </div>
                      }
                    >
                      <HelpIcon fontSize="xsmall" />
                    </Tooltip>
                  </Grid>
                  <Grid item>1%</Grid>
                </Grid>
              ) : (
                ""
              )}
            </StyledPaper>
          ) : (
            ""
          )}
        </StyledPaper>
        <TokenSearchModal
          open={open}
          handleClose={() => setOpen(false)}
          token_index={token_index}
        />
        <SettingModal open={settingModal} handleClose={handleSettingClose} />
      </motion.div>
    </motion.div>
  );
};

export default Swap;
