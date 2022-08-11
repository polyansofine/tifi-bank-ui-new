import _ from "../../../utils/@lodash";
import { useTheme, alpha } from "@mui/material/styles";
import { Tab, Tabs, Tooltip, Box, Typography } from "@mui/material";
import { motion } from "framer-motion/dist/framer-motion";
import { memo, useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import * as chartActions from "../../../store/actions";
import { StyledChartPaper } from "../../../components/LiquidityComponents/StyledPaper";
import HelpIcon from "@mui/icons-material/Help";
import useTranslation from "../../../context/Localization/useTranslation";

const formatter = Intl.NumberFormat("en", { maximumFractionDigits: 12 });
const tabs = [
  { title: "24H", day: 1, interval: "hourly" },
  { title: "7D", day: 7, interval: "hourly" },
  { title: "14D", day: 14, interval: "daily" },
  { title: "30D", day: 30, interval: "daily" },
  { title: "1Y", day: 365, interval: "daily" },
];
const options = {
  chart: {
    type: "area",
    height: "300px",
    background: "transparent",
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: true,
    },
  },
  theme: {
    mode: "dark",
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    type: "datetime",
    tooltip: {
      enabled: true,
    },
    axisBorder: {
      show: false,
    },
    labels: {
      datetimeUTC: false,
    },
  },
  tooltip: {
    style: {
      fontFamily: "Poppins",
    },
    x: {
      format: "dd MMM yyyy",
    },
  },

  yaxis: {
    axisBorder: {
      show: false,
    },
    labels: {
      show: true,
      align: "right",
      minWidth: 0,
      maxWidth: 200,
      style: {
        colors: [],
        fontSize: "12px",
        fontFamily: "Poppins",
        fontWeight: 400,
        cssClass: "apexcharts-yaxis-label",
      },
      offsetX: 0,
      offsetY: 0,
      rotate: 0,
      formatter: (value) => formatter.format(value),
    },
  },
  markers: {
    size: 0,
    strokeWidth: 1.5,
    strokeOpacity: 1,
    strokeDashArray: 0,
    fillOpacity: 1,
    shape: "circle",
    radius: 1,
    hover: {
      size: 2,
    },
  },
  fill: {
    type: "solid",
    opacity: 0.7,
    gradient: {
      shadeIntensity: 0.4,
      opacityFrom: 1,
      opacityTo: 0.5,
      stops: [30, 100, 100],
    },
  },
  grid: {
    show: true,
    strokeDashArray: 3,
    position: "back",
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  },
  stroke: {
    show: true,
    curve: "smooth",
    lineCap: "butt",
    width: 1.5,
    dashArray: 0,
  },
};

function SwapChart() {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [series, setSeries] = useState([]);
  const { token0, token1 } = useSelector(
    ({ tokenReducers }) => tokenReducers.token
  );

  const { prices } = useSelector(
    ({ tokenReducers }) => tokenReducers.chart.chart
  );

  _.setWith(options, "fill.colors", [theme.palette.success.main]);
  _.setWith(options, "markers.colors", [theme.palette.secondary.main]);
  _.setWith(options, "stroke.colors", [theme.palette.primary.contrastText]);
  _.setWith(options, "markers.strokeColors", [
    theme.palette.primary.contrastText,
  ]);
  _.setWith(
    options,
    "grid.borderColor",
    alpha(theme.palette.primary.contrastText, 0.3)
  );

  useEffect(() => {
    if (token0.title && token1.title) {
      dispatch(
        chartActions.getChartData(
          token1,
          token0,
          tabs[tabValue].day,
          `${tabs[tabValue].interval}`
        )
      );
    }
  }, [token0, token1, tabValue, dispatch]);
  useEffect(() => {
    if (prices) {
      const tempSeries = [{ name: token1.title, data: prices }];
      setSeries(tempSeries);
    }
  }, [prices, token1.title]);

  return (
    <StyledChartPaper sx={{ py: 4 }}>
      <div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div>
            <Typography>
              {token1.title} {t("Price Chart")} ({token0.title}/{token1.title})
              <Tooltip
                title={t(
                  "The market price chart from public exchanges. It shows the historical prices and the latest price in the chart may not be the same as the price show on the right panel of the page."
                )}
              >
                <HelpIcon fontSize="xsmall" />
              </Tooltip>
            </Typography>
          </div>
        </motion.div>

        <div>
          <Tabs
            value={tabValue}
            onChange={(event, value) => setTabValue(value)}
            indicatorColor="primary"
            textColor="inherit"
            variant="scrollable"
            scrollButtons={false}
            TabIndicatorProps={{
              children: <Box sx={{ bgcolor: "text.disabled" }} />,
            }}
          >
            {tabs.map((key) => (
              <Tab key={key.title} disableRipple label={t(key.title)} />
            ))}
          </Tabs>
        </div>
      </div>
      <ReactApexChart
        options={options}
        series={series}
        type={options.chart.type}
        height={options.chart.height}
      />
    </StyledChartPaper>
  );
}

export default memo(SwapChart);