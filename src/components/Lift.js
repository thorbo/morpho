import { Fragment } from 'react';
import classes from './SingleWorkout.module.css'
import Set from './Set'

const Lift = props => {
return (
  <Fragment >
    <header className={classes.exercise}>{props.lift.exerciseId}</header>
    {props.lift.sets.map((set, setIdx) => {
      return (
        <Set exerciseId={props.lift.exerciseId} set={set} mode={props.mode} id={setIdx} key={`${props.id}${setIdx}`} />
      );
    })}
  </Fragment>
);

}

export default Lift