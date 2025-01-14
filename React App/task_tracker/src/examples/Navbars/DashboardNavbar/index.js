/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";

// react-router components
import { useLocation, Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleNavbarTransparency() {
      if (window.scrollY > 10) {
        setTransparentNavbar(dispatch, false); // Solid background when scrolling
      } else {
        setTransparentNavbar(dispatch, true); // Transparent at top
      }
    }
  
    window.addEventListener("scroll", handleNavbarTransparency);
    handleNavbarTransparency(); // Ensure correct state initially
  
    return () => window.removeEventListener("scroll", handleNavbarTransparency);
  }, [dispatch]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
    >
      <NotificationItem icon={<Icon>email</Icon>} title="New message" />
      <NotificationItem icon={<Icon>notifications</Icon>} title="New notification" />
    </Menu>
  );

  // Styles for the navbar icons
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => ({
        ...navbar(theme, { transparentNavbar, absolute, light, darkMode }),
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1100, 
      })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <MDBox pr={1}>
              <MDInput label="Search here" />
            </MDBox>
            <MDBox color={light ? "white" : "inherit"}>
            <MDBox
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 1, // Adjust spacing between icons
                    ml: "auto", // Push the icons to the right
                    width: "calc(100% - 100px)", // Ensure it spans the full width
                    }}
              >        
              <Link to="/authentication/sign-in/basic">
                <IconButton sx={navbarIconButton} size="small" disableRipple>
                  <Icon sx={iconsStyle}>account_circle</Icon>
                </IconButton>
              </Link>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
              >
                <Icon sx={iconsStyle}>settings</Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                <Icon sx={iconsStyle}>notifications</Icon>
              </IconButton>
              {renderMenu()}
            </MDBox>
          </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;

// import { useState, useEffect } from "react";
// import { useLocation, Link } from "react-router-dom";
// import PropTypes from "prop-types";
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import IconButton from "@mui/material/IconButton";
// import Menu from "@mui/material/Menu";
// import Icon from "@mui/material/Icon";
// import MDBox from "components/MDBox";
// import MDInput from "components/MDInput";
// import Breadcrumbs from "examples/Breadcrumbs";
// import NotificationItem from "examples/Items/NotificationItem";
// import { navbar, navbarContainer, navbarRow, navbarIconButton, iconsStyle } from "./styles";

// function DashboardNavbar({ absolute, light, isMini }) {
//   const [openMenu, setOpenMenu] = useState(false);
//   const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
//   const handleCloseMenu = () => setOpenMenu(false);

//   const renderMenu = () => (
//     <Menu
//       anchorEl={openMenu}
//       anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//       transformOrigin={{ vertical: "top", horizontal: "left" }}
//       open={Boolean(openMenu)}
//       onClose={handleCloseMenu}
//     >
//       <NotificationItem icon={<Icon>email</Icon>} title="New message" />
//       <NotificationItem icon={<Icon>notifications</Icon>} title="New notification" />
//     </Menu>
//   );

//   return (
//     <AppBar position="static" sx={(theme) => navbar(theme, { transparentNavbar: false, absolute, light, darkMode: false })}>
//       <Toolbar sx={navbarContainer}>
//         <MDBox color="inherit" sx={navbarRow}>
//           <Breadcrumbs />
//         </MDBox>
//         {!isMini && (
//           <MDBox sx={navbarRow}>
//             <MDBox pr={1}>
//               <MDInput label="Search" />
//             </MDBox>
//             <MDBox color="inherit">
//               <IconButton
//                 color="inherit"
//                 sx={navbarIconButton}
//                 aria-controls="notification-menu"
//                 aria-haspopup="true"
//                 variant="contained"
//                 onClick={handleOpenMenu}
//               >
//                 <Icon sx={iconsStyle}>notifications</Icon>
//               </IconButton>
//               {renderMenu()}
//             </MDBox>
//             <MDBox>
//               <IconButton color="inherit" component={Link} to="/dashboard">
//                 <Icon>dashboard</Icon>
//               </IconButton>
//               <IconButton color="inherit" component={Link} to="/create-tasks">
//                 <Icon>add_task</Icon>
//               </IconButton>
//             </MDBox>
//           </MDBox>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// }

// // Setting default values for the props of DashboardNavbar
// DashboardNavbar.defaultProps = {
//   absolute: false,
//   light: false,
//   isMini: false,
// };

// // Typechecking props for the DashboardNavbar
// DashboardNavbar.propTypes = {
//   absolute: PropTypes.bool,
//   light: PropTypes.bool,
//   isMini: PropTypes.bool,
// };

// export default DashboardNavbar;
