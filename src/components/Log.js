import classes from "../pages/LogBook.module.css"

const Log = (props) => {
  
  return (
    <div className={classes.log}>
      <div>Date: {props.log.date}</div>
      <div>Volume: {props.log.volume}</div>
      <div className={classes.set}>
        {props.log.sets.map((iSet, idx) => {
          return (
            <div key={`${props.log.exerciseId}${props.log.date}${idx}`}>
              <span>Weight: {iSet.weight}</span>
              <span>Reps: {iSet.reps}</span>
              <span style={{fontStyle: "italic"}}>1RepMax: {iSet.oneRepMax.toFixed(0)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Log;
