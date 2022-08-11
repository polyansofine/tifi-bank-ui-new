import {
    Button,
    CircularProgress,
    Divider,
    Grid,
    IconButton,
    Slider,
    Typography,
    useTheme
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
    StyledInnerPaper,
    StyledPaper,
} from "../../../../components/LiquidityComponents/StyledPaper";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box } from "@mui/system";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useDispatch, useSelector } from "react-redux";
import { TOKENS } from "../../../../config/token";
import _ from "lodash";
import * as liquidityActions from "../../../../store/actions";
import { ethers } from "ethers";
import { minABI } from "../../../../config/TiFi_min_abi";
import { CONTRACT_ADDRESS } from "../../../../config/contract_address";
import RouterABI from "../../../../config/abi/TiFiRouter.json";
import { extendToBigNumber, getErrorMessage, toFixed } from "../../../../utils/tifi";
import { ROOT_PATH } from "../../../../config/constants";
import { BASE_BSC_SCAN_URLS } from "../../../../components/WalletConnectButton/config/index";
import useTranslation from "../../../../context/Localization/useTranslation";

const RemovePad = () => {
    const theme = useTheme();
    const { t } = useTranslation();
    const [value, setValue] = useState(30);
    const [loading, setLoading] = useState(false);
    const [removeLoading, setRemoveLoading] = useState(false);
    const [allowance_price, setAllowancePrice] = useState();
    const { remove } = useSelector(
        ({ tokenReducers }) => tokenReducers.liquidity
    );
    const { address, provider } = useSelector(
        ({ authReducers }) => authReducers.auth.auth
    );

    const percentButtonStyle = { borderRadius: 4, background: theme.custom.gradient.tifi };
    const mainButtonStyle = { height: "50px", background: theme.custom.gradient.tifi };
    const dispatch = useDispatch();
    const handleChange = (e, newValue) => {
        setValue(newValue);
    };
    const getAllowance = React.useCallback(async (pairAddress) => {
        if (address && pairAddress) {
            const signer = provider.getSigner();
            let contract0 = new ethers.Contract(pairAddress, minABI, signer);
            const allow_price0 = await contract0.allowance(
                address,
                CONTRACT_ADDRESS.ROUTER_ADDRESS
            );
            setAllowancePrice(allow_price0 / 10 ** 18);
        }
    }, [address, provider]);

    const updateBalance = React.useCallback(async (pairAddress) => {
        const signer = provider.getSigner();
        if (pairAddress) {
            let contract = new ethers.Contract(pairAddress, minABI, signer);
            const balance = await contract.balanceOf(address);
            dispatch(liquidityActions.updateBalance(pairAddress, balance / 10 ** 18))
        }
    }, [address, provider, dispatch])
    useEffect(() => {
        const getData = async () => {
            await getAllowance(remove.address);
        };
        if (remove.balance) {
            getData();
        }
    }, [remove, getAllowance]);

    const handleEnable = async () => {
        setLoading(true);
        try {
            const signer = provider.getSigner();
            let contract0 = new ethers.Contract(remove.address, minABI, signer);

            let tx = await contract0.approve(
                CONTRACT_ADDRESS.ROUTER_ADDRESS,
                "1000000000000000000000000000000000000"
            );
            await tx.wait();
            await getAllowance(remove.address);
            dispatch(liquidityActions.showMessage({
                message: t("Approved! Now you can remove liquidity."),
                href: BASE_BSC_SCAN_URLS[tx.chainId] + "/tx/" + tx.hash,
                title: t("Check Transaction on BSCScan"),
                variant: "success",
            }))
            setLoading(false);
        } catch (error) {
            dispatch(liquidityActions.showMessage({
                message: error.data ? error.data.message : error.message,
                variant: "error",
            }));
            setLoading(false);
        }
    };
    const handleRemove = async () => {
        setRemoveLoading(true);
        const signer = provider.getSigner();
        let contractPrice = new ethers.Contract(
            CONTRACT_ADDRESS.ROUTER_ADDRESS,
            RouterABI.abi,
            signer
        );
        const price = (remove.balance * value) / 100;
        let dateInAWeek = new Date();
        const deadline = Math.floor(dateInAWeek.getTime() / 1000) + 1000000;
        if (address != null) {
            try {
                let _amount;
                if (value === 100) {
                    // Remove all balance
                    let contract = new ethers.Contract(remove.address, minABI, signer);
                    _amount = await contract.balanceOf(address);
                } else {
                    _amount = extendToBigNumber(price);
                }
                let tx;
                if (remove.token0Title === "BNB") {
                    tx = await contractPrice.removeLiquidityETH(
                        remove.token1Address,
                        _amount,
                        0,
                        0,
                        address,
                        deadline
                    );
                } else if (remove.token1Title === "BNB") {
                    tx = await contractPrice.removeLiquidityETH(
                        remove.token0Address,
                        _amount,
                        0,
                        0,
                        address,
                        deadline
                    );
                } else {
                    tx = await contractPrice.removeLiquidity(
                        remove.token0Address,
                        remove.token1Address,
                        _amount,
                        0,
                        0,
                        address,
                        deadline
                    );
                }
                dispatch(liquidityActions.showMessage({
                    message: t("Transaction Submitted!"),
                    href: BASE_BSC_SCAN_URLS[tx.chainId] + "/tx/" + tx.hash,
                    title: t("Check Transaction on BSCScan"),
                    variant: "info",
                }));
                await tx.wait();
                dispatch(liquidityActions.showMessage({
                    message: t("Liquidity Removal Success!"),
                    href: BASE_BSC_SCAN_URLS[tx.chainId] + "/tx/" + tx.hash,
                    title: t("Check Transaction on BSCScan"),
                    variant: "success",
                }));
                updateBalance(remove.address);
                setRemoveLoading(false);
            } catch (error) {
                dispatch(liquidityActions.showMessage({
                    message: t(getErrorMessage(error)),
                    variant: "error",
                }));
                setRemoveLoading(false);
            }
        }
    };
    return (
        <StyledPaper>
            <Grid container alignItems="center" columnGap={2}>
                <Grid item>
                    <IconButton onClick={() => dispatch(liquidityActions.setRemove({}))}>
                        <ArrowBackIcon color="secondary" />
                    </IconButton>
                </Grid>
                <Grid item>
                    <Grid container direction="column">
                        <Grid item>
                            <Typography>
                                {t("Remove")} {remove.token0Title}/{remove.token1Title} {t("liquidity")}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography>
                                {t("To receive")} {remove.token0Title} {t("and")} {remove.token1Title}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Divider />
            <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                sx={{ my: 4 }}
            >
                <Grid item>
                    <Typography>{t("Amount (LP Tokens to Remove / Total)")}</Typography>
                </Grid>
                <Grid item>
                    <Typography>{toFixed(value * remove.balance / 100) + " / " + toFixed(remove.balance)}</Typography>
                </Grid>
            </Grid>
            <Box
                sx={{
                    width: "100%",
                    borderRadius: 4,
                    border: "1px solid #ffffff",
                    py: 4,
                    px: 8,
                }}
            >
                <Typography>{value}%</Typography>
                <Slider color="secondary" value={value} onChange={handleChange} />
                <Grid container justifyContent="space-between" alignItems="center">
                    <Button
                        onClick={() => setValue(25)}
                        variant="contained"
                        sx={percentButtonStyle}
                    >
                        25%
            </Button>
                    <Button
                        onClick={() => setValue(50)}
                        variant="contained"
                        sx={percentButtonStyle}
                    >
                        50%
            </Button>
                    <Button
                        onClick={() => setValue(75)}
                        variant="contained"
                        sx={percentButtonStyle}
                    >
                        75%
            </Button>
                    <Button
                        onClick={() => setValue(100)}
                        variant="contained"
                        sx={percentButtonStyle}
                    >
                        {t("Max")}
                    </Button>
                </Grid>
            </Box>
            <Grid container justifyContent="center">
                <ArrowDownwardIcon color="secondary" sx={{ my: 2 }} />
            </Grid>
            <Typography>{t("You will Receive")}</Typography>
            <StyledInnerPaper>
                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 3 }}
                >
                    <Grid item>
                        <Grid container alignItems="center">
                            <img
                                src={`${ROOT_PATH}/images/tokens/${TOKENS[
                                    _.findIndex(TOKENS, function (o) {
                                        return o.title === remove.token0Title;
                                    })
                                ].address
                                    }.png`}
                                alt="coins"
                                width="30px"
                            />
                            <Typography sx={{ ml: 2 }}>
                                {t("Pooled")} {remove.token0Title}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography>
                            {(remove.pool0 * remove.balance * value) / (remove.total * 100)}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Grid container alignItems="center">
                            <img
                                src={`${ROOT_PATH}/images/tokens/${TOKENS[
                                    _.findIndex(TOKENS, function (o) {
                                        return o.title === remove.token1Title;
                                    })
                                ].address
                                    }.png`}
                                alt="coins"
                                width="30px"
                            />
                            <Typography sx={{ ml: 2 }}>
                                {t("Pooled")} {remove.token1Title}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography>
                            {" "}
                            {(remove.pool1 * remove.balance * value) / (remove.total * 100)}
                        </Typography>
                    </Grid>
                </Grid>
            </StyledInnerPaper>
            <Grid container columnSpacing={3} sx={{ mt: 3 }} justifyContent="space-evenly">
                <Grid item sm={6} >
                    <Button
                        disabled={allowance_price > (remove.balance * value) / 100}
                        variant="contained"
                        sx={mainButtonStyle}
                        fullWidth
                        onClick={handleEnable}
                    >
                        {loading ? <CircularProgress /> : t("Enable")}
                    </Button>
                </Grid>
                <Grid item sm={6}>
                    <Button
                        disabled={allowance_price <= (remove.balance * value) / 100}
                        variant="contained"
                        fullWidth
                        sx={mainButtonStyle}
                        onClick={handleRemove}
                    >
                        {removeLoading ? <CircularProgress /> : t("Remove")}
                    </Button>
                </Grid>
            </Grid>
        </StyledPaper>
    );
};

export default RemovePad;
