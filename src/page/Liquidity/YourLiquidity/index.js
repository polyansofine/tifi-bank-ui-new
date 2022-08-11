import React from "react";
import { motion } from "framer-motion/dist/framer-motion";
import {
    Button,
    Grid,
    Typography,
    useTheme,
} from "@mui/material";
import {
    StyledInnerPaper,
    StyledPaper,
} from "../../../components/LiquidityComponents/StyledPaper";
import { useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import YourPool from "./YourPool";
import { useNavigate } from "react-router-dom";
import WalletConnect from "../../../components/WalletConnect";
import useTranslation from "../../../context/Localization/useTranslation";

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
const YourLiquidity = ({ loading }) => {
    const { address, } = useSelector(
        ({ authReducers }) => authReducers.auth.auth
    );
    const { t } = useTranslation();
    const navigate = useNavigate();
    const theme = useTheme();
    return (
        <motion.div initial="exit" animate="enter" exit="exit">
            <motion.div variants={imageVariants}>
                <StyledPaper>
                    <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 2 }}
                    >
                        <Grid item>
                            <Typography>{t("Your Liquidity")}</Typography>
                        </Grid>
                    </Grid>
                    <StyledInnerPaper>
                        {address ? (
                            <YourPool loading={loading} />
                        ) : (
                            <Grid container alignItems="center" direction="column">
                                <Typography>
                                    {t("Connect to a wallet to view your liquidity.")}
                                </Typography>
                            </Grid>
                        )}
                    </StyledInnerPaper>
                    <Grid container justifyContent="center">
                        {
                            address ? <Button
                                startIcon={<AddIcon />}
                                fullWidth
                                variant="contained"
                                sx={{
                                    background: theme.custom.gradient.tifi,
                                    height: "50px",
                                    mt: 3,
                                    borderRadius: 1,
                                }}
                                onClick={() => {
                                    navigate("add", { replace: true });
                                }}
                            >
                                {t("Add Liquidity")}
                            </Button> : <WalletConnect />
                        }
                    </Grid>
                </StyledPaper>
            </motion.div>
        </motion.div>
    );
};

export default YourLiquidity;
