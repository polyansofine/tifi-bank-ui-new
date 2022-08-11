import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Button,
  Link,
  Container,
  Grid,
  useTheme,
  FormControl,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  IconButton,
  Drawer,
  Hidden,
} from "@mui/material";
import logo from "../../assets/image/TiFi.png";
import { useNavigate } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
// import useAuth from "../../components/WalletConnectButton/utils/useAuth";
import { useSelector, useDispatch } from "react-redux";
import * as tokenActions from "../../store/actions";
import { ROOT_PATH, BSC_SCAN_URL } from "../../config/constants";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { toFixed } from "../../utils/tifi";
import useTranslation from "../../context/Localization/useTranslation";
import { EN, DE, ZHCN, ZHTW, AR } from "../../config/localization/languages";
import MenuIcon from "@mui/icons-material/Menu";
import WalletConnect from "./../../components/WalletConnect/index";

const pages = [
  {
    title: "Home",
    url: `${ROOT_PATH}/`,
  },
  {
    title: "Liquidity",
    url: `${ROOT_PATH}/liquidity`,
  },
  {
    title: "Swap",
    url: `${ROOT_PATH}/swap`,
  },
  {
    title: "Stake",
    url: `${ROOT_PATH}/stake`,
  },
  // {
  //   title: "Lend",
  //   url: `${ROOT_PATH}/lend`,
  // },
  {
    title: "Portfolio",
    url: `${ROOT_PATH}/portfolio`,
  },
];

const drawerWidth = 280;

const Header = (props) => {
  const { window } = props;
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentLanguage, setLanguage, t } = useTranslation();
  let { account, library } = useWeb3React();
  const dispatch = useDispatch();
  const [price, setPrice] = React.useState("");

  const { address, provider } = useSelector(
    ({ authReducers }) => authReducers.auth.auth
  );
  if (!account) {
    account = address;
    library = provider;
  }

  const changeLanguage = (e) => {
    let v = e.target.value;
    if (v === 0) {
      return;
    }
    setLanguage(v);
  };
  const getPrice = React.useCallback(async () => {
    try {
      let response = await fetch(
        "https://api.coingecko.com/api/v3/simple/token_price/binance-smart-chain?contract_addresses=0x17e65e6b9b166fb8e7c59432f0db126711246bc0&vs_currencies=usd"
      );
      let data = await response.json();
      setPrice(
        toFixed(data["0x17e65e6b9b166fb8e7c59432f0db126711246bc0"].usd, 4)
      );
    } catch (error) {
      setPrice("");
    }
  }, []);
  React.useEffect(() => {
    if (account && library) {
      dispatch(tokenActions.login(account, library));
    }
    getPrice();
  }, [account, library, dispatch, getPrice]);
  // const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        spacing={2}
        sx={{ mt: 1 }}
      >
        <Grid item>
          <a href="https://tifi.net">
            <img
              src={logo}
              alt="logo"
              width="55px"
              height="30px"
              title="Go to TiFi.net"
            />
          </a>
        </Grid>
        <Grid item>
          <Link
            className="custom-link"
            variant="h5"
            sx={{
              color: "#00b5ff",
              fontWeight: 600,
            }}
            href={ROOT_PATH}
            target="_self"
            title="TiFi Bank Home Page"
          >
            TiFi&nbsp;Bank<sup>TM</sup>
          </Link>
        </Grid>
      </Grid>
      <List>
        {pages.map((item) => (
          <ListItem
            key={item.title}
            disablePadding
            sx={{
              "&:hover": {
                backgroundColor: "#005bcf",
              },
            }}
          >
            <ListItemButton
              onClick={() => navigate(`${item.url}`)}
              sx={{ textAlign: "center" }}
            >
              <ListItemText primary={t(item.title)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: "#005bcf" }} />
      <Grid container flexDirection="column" justifyContent="center">
        <Grid item>
          {price && (
            <Button
              sx={{ mt: 2 }}
              title="View TIFI on CoinMarketCap"
              href="https://coinmarketcap.com/currencies/tifi-token/"
            >{`TIFI $${price}`}</Button>
          )}
        </Grid>
        <Grid item>
          {account && (
            <Hidden smUp>
              <FormControl>
                <Select
                  sx={{
                    color: "white",
                    icon: { color: "white" },
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                  value={currentLanguage}
                  label="lauguage"
                  title="Select Your Favorite Language"
                  onChange={changeLanguage}
                >
                  <MenuItem value={EN}>English</MenuItem>
                  <MenuItem value={AR}>العربية</MenuItem>
                  <MenuItem value={DE}>Deutsch</MenuItem>
                  <MenuItem value={ZHCN}>简体中文</MenuItem>
                  <MenuItem value={ZHTW}>繁體中文</MenuItem>
                </Select>
              </FormControl>
            </Hidden>
          )}
        </Grid>
      </Grid>
    </Box>
  );
  const container =
    window !== undefined ? () => window().document.body : undefined;
  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <a href="https://tifi.net">
              <img
                src={logo}
                alt="logo"
                width="55px"
                height="30px"
                title="Go to TiFi.net"
              />
            </a>
            <Link
              className="custom-link"
              variant="h5"
              sx={{
                color: "#00b5ff",
                fontWeight: 600,
                pl: 2,
                pr: 2,
                display: { xs: "none", md: "block" },
              }}
              href={ROOT_PATH}
              target="_self"
              title="TiFi Bank Home Page"
            >
              TiFi&nbsp;Bank<sup>TM</sup>
            </Link>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={`item-${page.title}`}
                  onClick={() => navigate(`${page.url}`)}
                  sx={{ my: 1, px: 4, display: "block" }}
                >
                  {t(page.title)}
                </Button>
              ))}
            </Box>
            <Box sx={{ flexGrow: 1, display: { md: "none" } }} />
            <Box
              sx={{
                flexGrow: 0,
                display: "flex",
                // flexDirection: "row-reverse",
                justifyContent: "flex-end",
              }}
            >
              {price ? (
                <Button
                  sx={{ display: { xs: "none", sm: "block" } }}
                  title="View TIFI on CoinMarketCap"
                  href="https://coinmarketcap.com/currencies/tifi-token/"
                >
                  {"TIFI"}&nbsp;{`$${price}`}
                </Button>
              ) : (
                ""
              )}
              {account ? (
                <>
                  <Button>
                    <AccountBalanceWalletIcon />
                    <a
                      href={`${BSC_SCAN_URL}/address/${account}`}
                      target="_blank"
                      rel="noreferrer"
                    >{`0x...${account.substring(38)}`}</a>
                  </Button>
                  &nbsp;
                  <Button
                    variant="contained"
                    sx={{ background: theme.custom.gradient.tifi }}
                    onClick={() => {
                      dispatch(tokenActions.logout());
                      // logout();
                    }}
                  >
                    {t("Disconnect")}
                  </Button>
                </>
              ) : (
                <WalletConnect />
              )}
              <Hidden smDown>
                <FormControl>
                  <Select
                    sx={{
                      color: "white",
                      icon: { color: "white" },
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                    value={currentLanguage}
                    label="lauguage"
                    title="Select Your Favorite Language"
                    onChange={changeLanguage}
                  >
                    <MenuItem value={EN}>English</MenuItem>
                    <MenuItem value={AR}>العربية</MenuItem>
                    <MenuItem value={DE}>Deutsch</MenuItem>
                    <MenuItem value={ZHCN}>简体中文</MenuItem>
                    <MenuItem value={ZHTW}>繁體中文</MenuItem>
                  </Select>
                </FormControl>
              </Hidden>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              background: "#012",
              color: "white",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};
export default Header;
