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
import React, { useState, useEffect, useMemo } from "react";

// react-router components
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

import Snackbar  from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Material Dashboard 2 React routes
import routes from "routes";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Images
import brandWhite from "assets/images/Task Hub.png";
import brandDark from "assets/images/logo-ct-dark.png";

import Login from "components/Login/login";
import Signup from "components/Login/signup";

// Import the CreateTask component
import CreateTask from "components/CreateTasks/CreateTask";

// Import the AllTasks component
import AllTasks from "components/AllTasks/Tasks";

// Import the InProgressTasks component
import InprogressTasks from "components/InprogressTasks/InprogressTasks";

// Import the PendingTasks component
import PendingTasks from "components/PendingTasks/PendingTasks";

// Import the CompletedTasks component
import CompletedTasks from "components/CompletedTasks/CompletedTasks";

import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import Logout from "layouts/logout";

import PrivateRoutes from "components/PrivateRoutes/PrivateRoute";
import ParentComponent from "components/ParentComponent";


export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();

  // To handle the api logic
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  // Setting the dir attribute for the body element

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsAuthenticated(!!user);

    // ✅ Only redirect if accessing a protected route
    if (!user && !["/login", "/signup"].includes(window.location.pathname)) {
        navigate("/login", { replace: true });
    }
}, [navigate]);

  useEffect(() => {
    const publicRoutes = ["/login", "/signup"];

    if (publicRoutes.includes(location.pathname)) {
        document.body.classList.add("show-welcome");
    } else {
        document.body.classList.remove("show-welcome");
    }
  }, [location.pathname]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://localhost:8080/task/getAllTasks");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error: ${response.statusText}`);
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
         setError(error.message);
      }
    };

    fetchData();
  }, []);

   //POST data to API
  const postData = async (newData) => {
    try {
      const response = await fetch("https://localhost:8080/task/addTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || `Error: ${response.statusText}`);
      }
      setSnackbarMessage(result.message);
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  // PUT data to API
  const putData = async (newData) => {
    try {
      const response = await fetch("https://localhost:8080/task/updateTask", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || `Error: ${response.statusText}`);
      }
      setSnackbarMessage(result.message);
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  // DELETE data from API
  const deleteData = async (newData) => {
    try {
      const response = await fetch("https://localhost:8080/task/deleteTask/${id}", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || `Error: ${response.statusText}`);
      }
      setSnackbarMessage(result.message);
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
        <CssBaseline />

        {/* ✅ Show sidebar only if user is authenticated */}
        {isAuthenticated && layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
              brandName="Task Hub"
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
            {configsButton}
          </>
        )}

        {layout === "vr" && <Configurator />}
        <ParentComponent></ParentComponent>

        <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />

            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />} />

            {/* Protected Routes */}
            <Route path="/create-task" element={<PrivateRoutes element={<CreateTask />} />} />
            <Route path="/tasks" element={<PrivateRoutes element={<AllTasks />} />} />
            <Route path="/inprogress-tasks" element={<PrivateRoutes element={<InprogressTasks />} />} />
            <Route path="/pending-tasks" element={<PrivateRoutes element={<PendingTasks />} />} />
            <Route path="/completed-tasks" element={<PrivateRoutes element={<CompletedTasks />} />} />
            <Route path="/profile" element={<PrivateRoutes element={<Profile />} />} />
            <Route path="/notifications" element={<PrivateRoutes element={<Notifications />} />} />
            <Route path="/logout" element={<PrivateRoutes element={<Logout />} />} />

            {/* Catch-all Route */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />

      {/* ✅ Show sidebar only if user is authenticated */}
      {isAuthenticated && layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName={
              <span style={{ 
                color: darkMode ? "#FFC107" : "#39FF14", 
                fontWeight: "bold", 
                fontSize: "25px",
                textShadow: "0 0 25px #39FF14",
                marginLeft: "10px",
            }}>
                Task Hub
              </span>
            }
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
        </>
      )}

      {layout === "vr" && <Configurator />}

      <Routes>
        {getRoutes(routes)}

        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />

        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />} />

        {/* Protected Routes */}
        <Route path="/create-task" element={<PrivateRoutes element={<CreateTask />} />} />
        <Route path="/tasks" element={<PrivateRoutes element={<AllTasks />} />} />
        <Route path="/inprogress-tasks" element={<PrivateRoutes element={<InprogressTasks />} />} />
        <Route path="/pending-tasks" element={<PrivateRoutes element={<PendingTasks />} />} />
        <Route path="/completed-tasks" element={<PrivateRoutes element={<CompletedTasks />} />} />  
        <Route path="/profile" element={<PrivateRoutes element={<Profile />} />} />
        <Route path="/notifications" element={<PrivateRoutes element={<Notifications />} />} />
        <Route path="/logout" element={<PrivateRoutes element={<Logout />} />} />

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </ThemeProvider>
  );
}
