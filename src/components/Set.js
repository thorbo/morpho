import { Fragment } from "react";
import { useDispatch } from "react-redux";
import { workoutActions } from "../store";
import classes from "./SingleWorkout.module.css";

const Set = (props) => {
  const dispatch = useDispatch();

  const onChangeWeight = (event, reset) => {
    dispatch(
      workoutActions.changeCurrentWeight({
        exerciseId: props.exerciseId,
        setIdx: +props.id,
        weight: +event.target.value,
        reset: reset,
      })
    );
  };

  const onChangeReps = (event, reset) => {
    dispatch(
      workoutActions.changeCurrentReps({
        exerciseId: props.exerciseId,
        setIdx: +props.id,
        reps: +event.target.value,
        reset: reset,
      })
    );
  };

  const calcPlates = () => {
    let total = props.set.weight
    total -= 45
    let plates = "plates: [ "
    while (total > 0) {
      for (let i of [90, 70, 50, 20, 10, 5]){
        if (total - i >= 0) {
          total -= i
          plates += ` ${i/2}s `
          if (total > 0) {
            plates += "+";
          }
          break
        }
      } 
    }
    return plates + ' ]'
  }

  const plates = calcPlates()

  return (
    <Fragment>
      <div className={classes.set}>
        <div>
          {props.mode === "display" && (
            <div className={classes.value}>
              <span className={classes.title}>Weight:</span>
              <span>{props.set.weight}</span>
            </div>
          )}
          {props.mode === "active" && (
            <Fragment>
              <button
                onClick={(event) => onChangeWeight(event, false)}
                value="-5"
              >
                -5
              </button>
              <div className={classes.value}>
                <span className={classes.title}>Weight</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={props.set.weight}
                  onChange={(event) => onChangeWeight(event, true)}
                />
              </div>
              <button
                onClick={(event) => onChangeWeight(event, false)}
                value="5"
              >
                +5
              </button>
            </Fragment>
          )}
        </div>
        <div>
          {props.mode === "display" && (
            <div className={classes.value}>
              <span className={classes.title}>Reps:</span>
              <span>{props.set.reps}</span>
            </div>
          )}
          {props.mode === "active" && (
            <Fragment>
              <button
                onClick={(event) => onChangeReps(event, false)}
                value="-1"
              >
                -
              </button>
              <div className={classes.value}>
                <span className={classes.title}>Reps</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={props.set.reps}
                  onChange={(event) => onChangeReps(event, true)}
                />
              </div>
              <button onClick={(event) => onChangeReps(event, false)} value="1">
                +
              </button>
            </Fragment>
          )}
        </div>
      </div>
      <p className={classes.plates}>{plates}</p>
    </Fragment>
  );
};

export default Set;
