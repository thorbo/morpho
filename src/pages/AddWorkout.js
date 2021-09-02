import { useSelector, useDispatch } from "react-redux";
import { Fragment, useState, useMemo } from "react";
import { workoutActions } from "../store/index";

import Card from "../UI/Card";
import CartHeader from "../components/CartHeader";
import CartModal from "../components/CartModal";
import classes from "./AddWorkout.module.css";
import AddToCartButton from "../components/AddToCartButton";

const AddWorkout = () => {
  const exercises = useSelector((state) => state.loadedExercises);
  const dispatch = useDispatch();
  const [showCart, setShowCart] = useState(false);

  const sortedExercises = useMemo(() => {
    // input exercises as list of exercise objects
    // output object in form {group: [list of exercise objects]}
    return exercises.reduce((acc, exercise) => {
      if (exercise.group in acc) {
        return {
          ...acc,
          [exercise.group]: acc[exercise.group].concat(exercise),
        };
      }
      acc[exercise.group] = [exercise];
      return acc;
    }, {});
  }, [exercises]);

  const addToCart = (exerciseId) => {
    dispatch(workoutActions.addConfiguredLift(exerciseId));
  };

  const toggleCart = () => {
    setShowCart((state) => !state);
  };

  return (
    <Fragment>
      {showCart && <CartModal onCancel={toggleCart} />}
      <CartHeader onClick={toggleCart} />
      <Card className={classes["exercise-list"]}>
        {Object.keys(sortedExercises).map((key) => {
          return (
            <Fragment key={key}>
              <header>{key}</header>
              <ul>
                {sortedExercises[key].map((exercise) => {
                  return (
                    <li key={exercise.exerciseId}>
                      <div>
                        <span className={classes.name}>{exercise.exerciseId}</span>
                        <span>{exercise.equipment}</span>
                      </div>
                      <AddToCartButton addToCart={addToCart} exercise={exercise} />
                    </li>
                  );
                })}
              </ul>
            </Fragment>
          );
        })}
      </Card>
    </Fragment>
  );
};

export default AddWorkout;
