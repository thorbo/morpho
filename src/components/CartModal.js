import { createPortal } from "react-dom";
import { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { workoutActions } from "../store/index";
import { sendWorkoutData } from "../store/workout-actions";
import { useHistory } from "react-router-dom";
import { DEFAULT_WORKOUT } from "../store/index";

import classes from "./CartModal.module.css";
import Card from "../UI/Card";

const CartModal = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.configuredWorkout);
  const loadedWorkouts = useSelector((state) => state.loadedWorkouts);

  const onSetChange = (exerciseId, mode) => {
    // ADD or REMOVE sets from the configuredWorkout
    dispatch(workoutActions.updateConfiguredSet({ exerciseId, type: mode }));
  };

  const onSaveCart = () => {
    // send current cart workout to be pushed to the list of loadedWorkouts
    dispatch(workoutActions.addLoadedWorkout(cart));

    // reset the configuredWorkout
    dispatch(workoutActions.startConfiguredWorkout(DEFAULT_WORKOUT));

    // reroute to home page to see your new workout displayed
    history.push("/");
  };

  useEffect(() => {
    // update workouts in DB on each change to loadedWorkouts
    dispatch(sendWorkoutData(loadedWorkouts));
  }, [loadedWorkouts, dispatch]);

  const cartContent = (
    <Fragment>
      <div className={classes.backdrop} onClick={props.onCancel}></div>
      <Card className={classes.cart}>
        <div className={classes['cart-items']}>
          {cart.lifts.map((lift) => {
            return (
              <div key={lift.exerciseId} className={classes["cart-item"]}>
                <h3>{lift.exerciseId}</h3>
                <div>
                  <span>{`Sets: ${lift.sets.length}`}</span>
                  <button
                    onClick={() => onSetChange(lift.exerciseId, "REMOVE")}
                  >
                    -
                  </button>
                  <button onClick={() => onSetChange(lift.exerciseId, "ADD")}>
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className={classes["cart-actions"]}>
          <button onClick={props.onCancel}>Cancel</button>
          <button onClick={onSaveCart}>Save Workout</button>
        </div>
      </Card>
    </Fragment>
  );

  // Deploy cartModal through portal to top of the DOM
  return createPortal(cartContent, document.getElementById("modal-root"));
};

export default CartModal;
