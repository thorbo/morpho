import SingleWorkout from "../components/SingleWorkout";
import Card from "../UI/Card";
import { useSelector } from "react-redux";
import Timer from "./Timer";
import { Fragment } from "react";

const StartWorkout = () => {
  const currentWorkout = useSelector(state => state.currentWorkout)

  return (
    <Fragment>
      <Card>
        <SingleWorkout
          mode="active"
          workout={currentWorkout}
          collapse={false}
        />
      </Card>
      <Timer />
    </Fragment>
  );
};

export default StartWorkout;
