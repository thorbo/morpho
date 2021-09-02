import { Fragment, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { workoutActions } from "../store";
import { sendLogBookData } from "../store/workout-actions";

import classes from "./SingleWorkout.module.css";
import WeightIcon from "../UI/WeightIcon";
import EditIcon from "../UI/EditIcon";
import Lift from "./Lift";
import DeleteIcon from "../UI/DeleteIcon";

const SingleWorkout = (props) => {
  const [showContent, setShowContent] = useState(!props.collapse);
  const logBook = useSelector((state) => state.logBook);
  const email = useSelector((state) => state.email);
  const history = useHistory();
  const dispatch = useDispatch();

  const toggleShowContent = () => {
    setShowContent((state) => !state);
  };

  const onStartWorkout = () => {
    // load this workout into currentWorkout, then redirect to the workout page
    dispatch(workoutActions.startCurrentWorkout({workout: props.workout, logBook}));
    history.push(`/workout`);
  };

  const onEditWorkout = () => {
    dispatch(workoutActions.startConfiguredWorkout(props.workout));
    history.push("/add-workout");
  };

  const onDeleteWorkout = () => {
    dispatch(workoutActions.deleteLoadedWorkout(props.workout));
  };

  const onLogWorkout = () => {
    const oneRepMax = (weight, reps) => {
      // Epley Formula for oneRepMax
      return weight * (1 + reps / 30);
    };

    // convert workout to list of logs
    const data = props.workout.lifts.reduce((acc, lift) => {
      // add oneRepMax field to each set
      const sets = lift.sets.map((individualSet) => {
        return {
          ...individualSet,
          oneRepMax: oneRepMax(individualSet.weight, individualSet.reps),
        };
      });

      // calculate total volume (sum of weight*reps for all sets)
      const volume = sets.reduce((acc, individualSet) => {
        return acc + individualSet.weight * individualSet.reps;
      }, 0);

      // build array of log data
      return acc.concat([
        {
          exerciseId: lift.exerciseId,
          sets: sets,
          volume: volume,
          date: new Date().toISOString().slice(0, 10),
        },
      ]);
    }, []);

    // add latest logs to existing logBook
    const newLogBook = logBook.concat(data);

    // send latest logBook to DB
    dispatch(sendLogBookData(newLogBook, email));

    // update logBook state
    dispatch(workoutActions.setLogBook(newLogBook));

    // reroute to congrats page
    history.push("/congrats");
  };

  // MODES:
  //   display => show UI buttons, collapsable content
  //   active => enter values and log workout

  return (
    <Fragment>
      <header onClick={toggleShowContent} className={classes.workout}>
        <span>{props.workout.name}</span>
        {props.mode === "display" && (
          <div>
            <WeightIcon onClick={onStartWorkout} />
            <EditIcon onClick={onEditWorkout} />
            <DeleteIcon onClick={onDeleteWorkout} />
          </div>
        )}
      </header>

      {(!props.collapse || showContent) && 
        props.workout.lifts.map((lift, liftIdx) => {
          return (
            <Lift
              mode={props.mode}
              lift={lift}
              id={liftIdx}
              key={`h${lift.exerciseId}${liftIdx}`}
            />
          );
        })}

      {props.mode === "active" && (
        <button className={classes.button} onClick={onLogWorkout}>
          Log Workout
        </button>
      )}
    </Fragment>
  );
};

export default SingleWorkout;
