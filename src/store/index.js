import { createSlice } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";

export const DEFAULT_SET = { weight: 100, reps: 10 };

export const DEFAULT_WORKOUT = {
  name: "",
  lifts: [],
};

// logBook: [{ date: "", exerciseId: "", volume: 0, sets: [DEFAULT_SET] }]

const INITIAL_STATE = {
  loadedWorkouts: [],
  loadedExercises: [],
  configuredWorkout: {
    name: "",
    lifts: [],
  },
  currentWorkout: {
    name: "",
    lifts: [{ exerciseId: null, sets: [DEFAULT_SET] }],
  },
  logBook: [],
  email: localStorage.getItem("email") || "",
  token: localStorage.getItem("token") || "",
  isLoggedIn: !!localStorage.getItem("token"),
};

const workoutSlice = createSlice({
  name: "workout",
  initialState: INITIAL_STATE,
  reducers: {
    startCurrentWorkout(state, action) {
      //assuming payload is {workout, logBook}
      let workout = action.payload.workout;
      const logBook = action.payload.logBook;
      // for each lift in the current workout, configure weight and reps to match the most recent values seen in the logBook
      let lifts = workout.lifts.map((lift) => {
        const logs = logBook.filter((log) => {
          return log.exerciseId === lift.exerciseId;
        });
        logs.sort((a, b) => (a.date <= b.date ? 1 : -1));
        let sets = lift.sets.map(() => {
          let indivSet = { weight: 0, reps: 0 };
          indivSet.weight =
            logs.length > 0
              ? logs[0].sets[logs[0].sets.length - 1].weight
              : DEFAULT_SET.weight;
          indivSet.reps =
            logs.length > 0
              ? logs[0].sets[logs[0].sets.length - 1].reps
              : DEFAULT_SET.reps;
          return indivSet;
        });
        return { ...lift, sets: sets };
      });
      state.currentWorkout = { ...workout, lifts: lifts };
    },
    changeCurrentWeight(state, action) {
      //payload in form: {exerciseId: exerciseId, setIdx: +props.id, weight: +event.target.value, reset: boolean}
      // find the current lift by exercise
      let currLift = state.currentWorkout.lifts.find(
        (lift) => lift.exerciseId === action.payload.exerciseId
      );
      // modify the weight in the desired set
      if (action.payload.reset) {
        // reset current weight with payload
        currLift.sets[action.payload.setIdx].weight = action.payload.weight;
      } else {
        // modify current weight by payload
        currLift.sets[action.payload.setIdx].weight += action.payload.weight;
      }
    },
    changeCurrentReps(state, action) {
      //payload in form: {exerciseId: exerciseId, setIdx: +props.id, reps: +event.target.value, reset: boolean}
      // find the current lift by exercise
      let currLift = state.currentWorkout.lifts.find(
        (lift) => lift.exerciseId === action.payload.exerciseId
      );
      if (action.payload.reset) {
        // reset current reps with payload
        currLift.sets[action.payload.setIdx].reps = action.payload.reps;
      } else {
        // modify current reps by payload
        currLift.sets[action.payload.setIdx].reps += action.payload.reps;
      }
    },
    startConfiguredWorkout(state, action) {
      //assuming payload is workout object
      state.configuredWorkout = action.payload;
    },
    updateConfiguredName(state, action) {
      //assuming payload is string
      state.configuredWorkout.name = action.payload;
    },
    addConfiguredLift(state, action) {
      //assuming payload is a string
      if (
        state.configuredWorkout.lifts.findIndex(
          (lift) => lift.exerciseId === action.payload
        ) !== -1
      ) {
        //
        return;
      }
      state.configuredWorkout.lifts.push({
        exerciseId: action.payload,
        sets: [DEFAULT_SET],
      });
    },
    updateConfiguredSet(state, action) {
      // assuming payload is {exerciseId: exerciseId, type: mode}
      const Idx = state.configuredWorkout.lifts.findIndex((lift) => {
        return lift.exerciseId === action.payload.exerciseId;
      });

      if (action.payload.type === "ADD") {
        state.configuredWorkout.lifts[Idx].sets.push(DEFAULT_SET);
      } else if (state.configuredWorkout.lifts[Idx].sets.length === 1) {
        state.configuredWorkout.lifts.splice(Idx, 1);
      } else {
        state.configuredWorkout.lifts[Idx].sets.pop();
      }
    },
    addLoadedWorkout(state, action) {
      //assume payload is workout object
      const idx = state.loadedWorkouts.findIndex(
        (workout) => workout.name === state.configuredWorkout.name
      );
      if (idx !== -1) {
        //overwrite existing workout if workout has an existing name
        state.loadedWorkouts[idx] = action.payload;
      } else {
        // add new workout to the loadedWorkouts list
        state.loadedWorkouts.push(action.payload);
      }
    },
    deleteLoadedWorkout(state, action) {
      const idx = state.loadedWorkouts.findIndex(
        (workout) => workout.name === action.payload.name
      );
      state.loadedWorkouts.splice(idx, 1);
    },
    setLoadedWorkouts(state, action) {
      //assume payload is list of workouts
      state.loadedWorkouts = action.payload;
    },
    setLoadedExercises(state, action) {
      //assume payload is list of exercises
      state.loadedExercises = action.payload;
    },
    setLogBook(state, action) {
      //assume payload is a list of logs
      state.logBook = action.payload;
    },
    login(state, action) {
      state.token = action.payload.token;
      state.isLoggedIn = !!action.payload.token;
      let email = encodeURIComponent(action.payload.email);
      email = email.replace(/\./g, "");
      state.email = email;
      localStorage.setItem("email", email);
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("expiresIn", action.payload.expiresIn);
      // action.payload.expiresIn logic needed to handle expiration
    },
    logout(state) {
      state.token = null;
      state.isLoggedIn = false;
      state.email = "";
      state.loadedWorkouts = []
      state.logBook = []
      state.configuredWorkout = DEFAULT_WORKOUT
      localStorage.removeItem("email");
      localStorage.removeItem("token");
      localStorage.removeItem("expiresIn");  
    },
  },
});

const store = configureStore({
  reducer: workoutSlice.reducer,
});

export default store;
export const workoutActions = workoutSlice.actions;
