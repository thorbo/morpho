import { Fragment, useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExerciseData,
  sendWorkoutData,
  fetchLogBookData,
  fetchWorkoutData,
  sendExerciseData,
} from "./store/workout-actions";

import Header from "./UI/Header";
import AddWorkout from "./pages/AddWorkout";
import LogBook from "./pages/LogBook";
import "./App.css";
import AllWorkouts from "./pages/AllWorkouts";
import StartWorkout from "./pages/StartWorkout";
import Congrats from "./pages/Congrats";
import Timer from "./pages/Timer";
import Login from "./pages/Login";

function App() {
  const dispatch = useDispatch();
  const loadedWorkouts = useSelector((state) => state.loadedWorkouts);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const [initialLoad, setInitialLoad] = useState(true);
  const email = useSelector(state => state.email)

  // Load workout and exercise data on launch
  useEffect(() => {
    if (initialLoad && isLoggedIn) {
      dispatch(fetchWorkoutData(email));
      dispatch(fetchExerciseData());
      dispatch(fetchLogBookData(email));
      dispatch(sendExerciseData())
      setInitialLoad(false);
    }
  }, [dispatch, initialLoad, isLoggedIn, email]);

  // Send latest loaded workouts to DB
  useEffect(() => {
    if (!initialLoad && loadedWorkouts.length !== 0) {
      dispatch(sendWorkoutData(loadedWorkouts, email));
    }
  }, [loadedWorkouts, initialLoad, dispatch, email]);

  return (
    <Fragment>
      <Header />
      <Switch>
        <Route path="/" exact>
          {isLoggedIn && <AllWorkouts />}
          {!isLoggedIn && <Redirect to="/login" />}
        </Route>
        {isLoggedIn && (
          <Switch>
            <Route path="/add-workout" exact>
              <AddWorkout />
            </Route>
            <Route path="/logbook">
              <LogBook />
            </Route>
            <Route path="/workout">
              <StartWorkout />
            </Route>
            <Route path="/congrats">
              <Congrats />
            </Route>
            <Route path="/timer">
              <Timer />
            </Route>
          </Switch>
        )}
        <Route path="/login">
          <Login />
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Fragment>
  );
}

export default App;
