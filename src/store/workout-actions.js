import { workoutActions } from "./index";
import { exercises } from "./Exercises";

const dbURL = "https://morpho-ff4af-default-rtdb.firebaseio.com/";

export const fetchWorkoutData = (email) => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(
        dbURL + email + "/workouts.json"
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      return data || [];
    };

    try {
      const data = await fetchData();
      dispatch(workoutActions.setLoadedWorkouts(data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const sendWorkoutData = (workouts, email) => {
  
  return async (dispatch) => {
    const sendData = async () => {
      const response = await fetch(
        dbURL + email +"/workouts.json",
        {
          method: "PUT",
          body: JSON.stringify(workouts),
        }
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }
    };
    try {
      sendData();
    } catch (err) {
      console.log(err);
    }
  };
};

export const fetchExerciseData = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(
        dbURL + "exercises.json"
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      return data;
    };

    try {
      const data = await fetchData();
      dispatch(workoutActions.setLoadedExercises(data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const sendExerciseData = () => {
  return async (dispatch) => {
    const sendData = async () => {
      const response = await fetch(
        dbURL + "exercises.json",
        {
          method: "PUT",
          body: JSON.stringify(exercises),
        }
      );

      if (!response.ok) {
        console.log(response);
        throw new Error(response.statusText);
      }
    };

    try {
      sendData();
    } catch (err) {
      console.log(err);
    }
  };
};

export const sendLogBookData = (data, email) => {
  return async (dispatch) => {
    const sendData = async () => {
      const response = await fetch(
        dbURL + email + "/logbook.json",
        {
          method: "PUT",
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        console.log(response);
        throw new Error(response.statusText);
      }
    };

    try {
      sendData();
    } catch (err) {
      console.log(err);
    }
  };
};

export const fetchLogBookData = (email) => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(
        dbURL + email + "/logbook.json"
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      return data || [];
    };

    try {
      const data = await fetchData();
      dispatch(workoutActions.setLogBook(data));
    } catch (err) {
      console.log(err);
    }
  };
};
