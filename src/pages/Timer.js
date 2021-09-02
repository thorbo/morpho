import { useEffect, useReducer } from "react";
import Card from "../UI/Card";
import classes from "./Timer.module.css";

const INITIAL_TIMER = {
  pomodoroMode: true,
  ontime: [1, 0],
  offtime: [0, 30],
  currtime: [1, 0],
  onTimeMode: true,
  isRunning: false,
  buzzer: false,
};

const reducer = (state, action) => {
  if (action.type === "DECREMENT") {
    let seconds = state.currtime[1];
    let minutes = state.currtime[0];
    seconds -= 1;
    if (seconds < 0) {
      seconds = 59;
      minutes -= 1;
    }
    let buzzer = state.buzzer;
    let onTimeMode = state.onTimeMode;
    let currtime = [minutes, seconds];
    if (minutes < 0) {
      buzzer = true;
      onTimeMode = !state.onTimeMode;
      currtime = onTimeMode ? state.ontime : state.offtime;
    }

    return {
      ...state,
      currtime: currtime,
      buzzer: buzzer,
      onTimeMode: onTimeMode,
    };
  }
  if (action.type === "SET-ON") {
    return { ...state, currtime: state.ontime };
  }
  if (action.type === "SET-OFF") {
    return { ...state, currtime: state.offtime };
  }
  if (action.type === "TOGGLE") {
    return { ...state, isRunning: !state.isRunning };
  }
  if (action.type === "SET-TIMER") {
    let time = state[action.timer];
    time[action.position] = action.value;
    return { ...state, [action.timer]: time };
  }
  if (action.type === "BUZZER-OFF") {
    console.log(state);
    return { ...state, buzzer: false };
  }
  return state;
};

const Timer = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_TIMER);

  const onStartOn = () => {
    dispatch({ type: "SET-ON" });
  };

  const onStartOff = () => {
    dispatch({ type: "SET-OFF" });
  };

  const onToggleTimer = () => {
    dispatch({ type: "TOGGLE" });
  };

  const beep = () => {
    const audio = new Audio("bird.mp3");
    audio.play();
  };

  useEffect(() => {
    let timer = null;
    if (state.isRunning) {
      timer = setInterval(() => dispatch({ type: "DECREMENT" }), 1000);
    }
    return () => clearInterval(timer);
  }, [dispatch, state.isRunning]);

  useEffect(() => {
    if (state.buzzer) {
      // add buzzer class to timer
      // setTimeout to remove buzzer class

      beep();
      let count = 0;
      const timer = setInterval(() => {
        count += 1;
        if (count === 1) {
          clearInterval(timer);
        }
        beep();
      }, 1500);

      dispatch({ type: "BUZZER-OFF" });
    }
  }, [state.buzzer, dispatch]);

  return (
    <Card className={classes.timer}>
      {state.pomodoroMode && (
        <div className={classes.configs}>
          <button onClick={onStartOn}>Set Active</button>
          <div>
            <label>Active Time:</label>
            <div>
              <input
                value={state.ontime[0]}
                type="number"
                step="1"
                min="0"
                onChange={(event) =>
                  dispatch({
                    type: "SET-TIMER",
                    timer: "ontime",
                    position: 0,
                    value: event.target.value,
                  })
                }
              />
              <input
                value={state.ontime[1]}
                type="number"
                step="15"
                max="45"
                min="0"
                onChange={(event) =>
                  dispatch({
                    type: "SET-TIMER",
                    timer: "ontime",
                    position: 1,
                    value: event.target.value,
                  })
                }
              />
            </div>
          </div>
          <div>
            <label>Down Time:</label>
            <div>
              <input
                value={state.offtime[0]}
                type="number"
                step="1"
                min="0"
                onChange={(event) =>
                  dispatch({
                    type: "SET-TIMER",
                    timer: "offtime",
                    position: 0,
                    value: event.target.value,
                  })
                }
              />
              <input
                value={state.offtime[1]}
                type="number"
                step="15"
                max="45"
                min="0"
                onChange={(event) =>
                  dispatch({
                    type: "SET-TIMER",
                    timer: "offtime",
                    position: 1,
                    value: event.target.value,
                  })
                }
              />
            </div>
          </div>
          <button onClick={onStartOff}>Set Down</button>
        </div>
      )}

      <div className={classes.configs}>
        <button onClick={onToggleTimer}>
          {state.isRunning ? "Stop" : "Start"}
        </button>
        <div className={classes.clock}>
          {state.currtime[0]}:
          {String(state.currtime[1]).length === 2
            ? state.currtime[1]
            : "0" + state.currtime[1]}
        </div>
      </div>
    </Card>
  );
};

export default Timer;
