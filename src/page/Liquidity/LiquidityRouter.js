import React from "react";
import { Route, Routes } from "react-router-dom";
import Liquidity from ".";
import LiquidityPage from "./LiquidityPage";

const LiquidityRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<LiquidityPage />} />
            <Route path="/add" element={<Liquidity />} />
        </Routes>
    );
};

export default LiquidityRouter;
