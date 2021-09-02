import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Fragment } from "react";
import { workoutActions } from "../store";
import { useDispatch } from "react-redux";

import classes from "./Header.module.css";

const Header = () => {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const dispatch = useDispatch()

  return (
    <header className={classes.header}>
      <div className={classes.logo}>Morpho </div>
      <nav className={classes.nav}>
        <ul>
          {isLoggedIn && (
            <Fragment>
              <li className={(classes["nav-item"], classes.item)}>
                <NavLink to="/" activeClassName={classes.active} exact>
                  Home
                </NavLink>
              </li>
              <li className={(classes["nav-item"], classes.item)}>
                <NavLink to="/add-workout" activeClassName={classes.active}>
                  Add Workout
                </NavLink>
              </li>
              <li className={(classes["nav-item"], classes.item)}>
                <NavLink to="/logbook" activeClassName={classes.active}>
                  LogBook
                </NavLink>
              </li>
            </Fragment>
          )}

          <li className={(classes["nav-item"], classes.item)}>
            {!isLoggedIn && (
              <NavLink to="/login" activeClassName={classes.active}>
                Login
              </NavLink>
            )}
            {isLoggedIn && (
              <button
                className={(classes["nav-item"], classes.item)}
                onClick={() => dispatch(workoutActions.logout())}
              >
                Logout
              </button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
