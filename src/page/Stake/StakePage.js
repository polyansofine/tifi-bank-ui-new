import { Grid } from "@mui/material";
import React from "react";
import useTranslation from "../../context/Localization/useTranslation";

const StakePage = () => {
  const { t } = useTranslation();
  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="top"
      columnSpacing={8}
    >
      <Grid item>
        <h2>{t("Stay Tuned!")} <br />{t("TiFi Bank Staking will be available in August 2022!")}</h2>
      </Grid>
    </Grid>
  );
};

export default StakePage;