import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  link: {
    textDecoration: "none",
    padding: "10px 20px",
    color: "#000",
    fontWeight: "500",
    borderRadius: "5px",
    transition: "background-color 0.3s, color 0.3s",

  },
  activeLink: {
    backgroundColor: "#1976d2",
    color: "#ffffff",
  },
  content: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
  },
});

const ProfileLayout = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {/* Sidebar */}
      <div className={classes.sidebar}>
        <NavLink
          to="/profile/user-details"
          className={({ isActive }) =>
            isActive ? `${classes.link} ${classes.activeLink}` : classes.link
          }
        >
          User Details
        </NavLink>
        <NavLink
          to="/profile/my-orders"
          className={({ isActive }) =>
            isActive ? `${classes.link} ${classes.activeLink}` : classes.link
          }
        >
          My Orders
        </NavLink>
      </div>

      {/* Main Content */}
      <div className={classes.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default ProfileLayout;
