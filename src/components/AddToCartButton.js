import { useState } from "react";
import classes from '../pages/AddWorkout.module.css'

const AddToCartButton = (props) => {
  const [isClicked, setIsClicked] = useState(false);

  const onAddHandler = () => {
    props.addToCart(props.exercise.exerciseId)
    setIsClicked(true)
  }

  return <button className={isClicked ? classes.active : ""} onClick={onAddHandler}>+</button>;
};

export default AddToCartButton;
