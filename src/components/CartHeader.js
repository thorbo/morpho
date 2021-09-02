import { useSelector, useDispatch } from "react-redux";
import { workoutActions } from "../store/index";
import { useState, Fragment } from "react";

import classes from "./CartHeader.module.css";

const CartHeader = (props) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.configuredWorkout);
  const totalItems = cart.lifts.length;
  const [showError, setShowError] = useState(false);

  const onNameChange = (event) => {
    dispatch(workoutActions.updateConfiguredName(event.target.value));
    if (showError) {
      setShowError(event.target.value.length === 0);
    }
  };

  const onConfirm = () => {
    if (cart.name.trim().length === 0) {
      setShowError(true);
      return;
    }
    props.onClick();
  };
  //TODO: ERROR CHECKING - EMPTY OR DUPLICATE WORKOUT NAME
  return (
    <Fragment>
      <div className={classes.cart}>
        <input
          type="text"
          autoFocus={true}
          value={cart.name}
          placeholder="Enter Workout Name"
          onChange={onNameChange}
        ></input>
        <div>
          <span>Total:</span>
          <div>{totalItems}</div>
        </div>
        <button onClick={onConfirm}>Confirm Workout</button>
      </div>
      {showError && <p className={classes.error}>Workout name cannot be blank.</p>}
    </Fragment>
  );
};

export default CartHeader;
