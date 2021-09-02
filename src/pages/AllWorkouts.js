import SingleWorkout from "../components/SingleWorkout";
import Card from "../UI/Card";
import { Fragment } from "react";
import { useSelector } from "react-redux";


const AllWorkouts = () => {
  const workouts = useSelector(state => state.loadedWorkouts)

  return (
    <Fragment>
      {workouts.length === 0 && <p className="message">Add a new workout!</p>}
      {workouts && workouts.map((workout) => {
        return (
          <Card key={workout.name}>
            <SingleWorkout  workout={workout} mode="display" collapse={true}/>
          </Card>
        );
      })}
    </Fragment>
  );
};

export default AllWorkouts;
