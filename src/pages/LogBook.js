import { useSelector } from "react-redux";
import { Fragment, useMemo, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";

import Card from "../UI/Card";
import Log from "../components/Log";
import classes from "./LogBook.module.css";

const LogBook = () => {
  const logBook = useSelector((state) => state.logBook);
  const exercises = useSelector((state) => state.loadedExercises);
  const location = useLocation();
  const history = useHistory();

  const queryParams = new URLSearchParams(location.search);
  const sortMode =
    queryParams.get("sort") === "group" || queryParams.get("sort") === null;

  const [isGroupMode, setIsGroupMode] = useState(sortMode);

  // Get sort Type from url
  const changeSortingHandler = () => {
    setIsGroupMode((state) => {
      history.push({
        pathname: location.pathname,
        search: `?sort=${!state ? "group" : "date"}`,
      });

      return !state;
    });
  };

  // convert and memoize logBook:
  const sortedLogs = useMemo(() => {
    // state may still be loading
    if (exercises.length === 0 || Object.keys(logBook).length === 0) {
      return {};
    }

    if (isGroupMode) {
      // order log book by group
      return logBook.reduce((acc, log) => {
        console.log(log.exerciseId)
        const group = exercises.find(
          (exercise) => exercise.exerciseId === log.exerciseId
        ).group;
        if (group in acc) {
          if (log.exerciseId in acc[group]) {
            // group exists, exercise exists
            return {
              ...acc,
              [group]: {
                ...acc[group],
                [log.exerciseId]: [...acc[group][log.exerciseId], log],
              },
            };
          }
        }
        return { ...acc, [group]: { ...acc[group], [log.exerciseId]: [log] } };
      }, {});
    } else {
      // order log book by date
      const sortedLogBook = logBook
        .slice()
        .sort((a, b) => (a.date <= b.date ? 1 : -1));

      return sortedLogBook.reduce((acc, log) => {
        const day = log.date;
        if (day in acc) {
          if (log.exerciseId in acc[day]) {
            // day exists, exercise exists
            return {
              ...acc,
              [day]: {
                ...acc[day],
                [log.exerciseId]: [...acc[day][log.exerciseId], log],
              },
            };
          }
        }
        return { ...acc, [day]: { ...acc[day], [log.exerciseId]: [log] } };
      }, {});
    }
  }, [logBook, exercises, isGroupMode]);

  return (
    <Fragment>
      {Object.keys(sortedLogs).length === 0 && (
        <h1 className="message">Log a Workout to see your logs!</h1>
      )}
      {Object.keys(sortedLogs).length > 0 && (
        <button
          onClick={() => changeSortingHandler()}
          className={classes.button}
        >
          {isGroupMode ? "Sort by: Date" : "Sort by: Group"}
        </button>
      )}
      {Object.keys(sortedLogs).length > 0 &&
        Object.keys(sortedLogs).map((group) => {
          return (
            <Card key={group} className={classes.logbook}>
              <h1>{group}</h1>
              {Object.keys(sortedLogs[group]).map((exerciseId) => {
                return (
                  <Fragment key={exerciseId}>
                    <h3>{exerciseId}</h3>
                    <div className={classes.exercise}>
                      {sortedLogs[group][exerciseId].map((log, logIdx) => {
                        return <Log log={log} key={`${log.date}${logIdx}`} />;
                      })}
                    </div>
                  </Fragment>
                );
              })}
            </Card>
          );
        })}
    </Fragment>
  );
};

export default LogBook;
