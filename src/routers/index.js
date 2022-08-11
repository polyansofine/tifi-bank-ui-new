import { CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FuseMessage from "../components/FuseMessage/FuseMessage";
import Layout from "../Layout";
import Home from "../page/Home";
import LiquidityRouter from "../page/Liquidity/LiquidityRouter";
import SwapPage from "../page/Swap/SwapPage";
import StakePage from "../page/Stake/StakePage";
import PortfolioPage from "../page/Portfolio/PortforlioPage";
import { theme } from "./../styles/theme";
import { ROOT_PATH } from "../config/constants";

const Routers = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path={`${ROOT_PATH}/`} element={<Home />} />
                        <Route path={`${ROOT_PATH}/swap`} element={<SwapPage />} />
                        <Route path={`${ROOT_PATH}/liquidity/*`} element={<LiquidityRouter />} />
                        <Route path={`${ROOT_PATH}/stake`} element={<StakePage />} />
                        <Route path={`${ROOT_PATH}/portfolio`} element={<PortfolioPage />} />
                    </Routes>
                    <FuseMessage />
                </Layout>
            </BrowserRouter>
        </ThemeProvider>
    );
};

export default Routers;
