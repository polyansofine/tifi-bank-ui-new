import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import YourLiquidity from "./YourLiquidity";
import RemovePad from "./YourLiquidity/RemovePad";
import { ethers } from "ethers";
import { LP_TOKENS } from "../../config/LP_tokens";
import { minABI } from "../../config/TiFi_min_abi";
import * as liquidityActions from "../../store/actions";
import { TOKENS } from "../../config/token";
import _ from "lodash";
import { Grid } from "@mui/material";

const LiquidityPage = () => {
  const { address, provider } = useSelector(
    ({ authReducers }) => authReducers.auth.auth
  );
  const { remove } = useSelector(
    ({ tokenReducers }) => tokenReducers.liquidity
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const getBalance = React.useCallback(async () => {
    setLoading(true);
    let tmp = [];
    const signer = provider.getSigner();
    try {
      if (address != null) {
        await Promise.all(
          LP_TOKENS.map(async (item, index) => {
            let contract = new ethers.Contract(item.address, minABI, signer);
            const lp_val0 = await contract.balanceOf(address);
            const temp_val = lp_val0 / 10 ** 18;
            if (temp_val > 0) {
              tmp.push({
                balance: temp_val,
                token0Title: item.token0_name,
                token1Title: item.token1_name,
                address: item.address,
                token0Address:
                  TOKENS[
                    _.findIndex(TOKENS, (o) => o.title === item.token0_name)
                  ].address,
                token1Address:
                  TOKENS[
                    _.findIndex(TOKENS, (o) => o.title === item.token1_name)
                  ].address,
              });
            }
          })
        );
        dispatch(liquidityActions.getLiquidityBalance(tmp));
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  }, [address, dispatch, provider]);
  useEffect(() => {
    const getData = async () => {
      await getBalance();
    };
    if (address && provider) {
      getData();
    }
  }, [address, provider, getBalance]);
  return (
    <div>
      <Grid container justifyContent="center">
        <Grid item md={8} xs={12}>
          {remove.balance ? <RemovePad /> : <YourLiquidity loading={loading} />}
        </Grid>
      </Grid>
      {/* <Liquidity /> */}
    </div>
  );
};

export default LiquidityPage;
