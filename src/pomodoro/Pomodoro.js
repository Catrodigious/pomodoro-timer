import React, { useState } from "react";
import useInterval from "../utils/useInterval";
import { minutesToDuration, secondsToDuration } from "../utils/duration";
import DurationControls from "./DurationControls";
import TimerControls from "./TimerControls";

// These functions are defined outside of the component to insure they do not have access to state
// and are, therefore more likely to be pure.

/**
 * Update the session state with new state after each tick of the interval.
 * @param prevState
 *  the previous session state
 * @returns
 *  new session state with timing information updated.
 */
function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
  return {
    ...prevState,
    timeRemaining,
  };
}

/**
 * Higher order function that returns a function to update the session state with the next session type upon timeout.
 * @param focusDuration
 *    the current focus duration
 * @param breakDuration
 *    the current break duration
 * @returns
 *  function to update the session state.
 */
function nextSession(focusDuration, breakDuration) {
  /**
   * State function to transition the current session type to the next session. e.g. On Break -> Focusing or Focusing -> On Break
   */
  return (currentSession) => {
    if (currentSession.label === "Focusing") {
      return {
        label: "On Break",
        timeRemaining: breakDuration * 60,
      };
    }
    return {
      label: "Focusing",
      timeRemaining: focusDuration * 60,
    };
  };
}

function Pomodoro() {
  // Timer starts out paused
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // The current session - null where there is no session running
  const [session, setSession] = useState(null);

  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

  const focusDurationSec = focusDuration * 60;
  const breakDurationSec = breakDuration * 60;
 
  function updateProgress() {
    if (isTimerRunning) {
      if (session.label === "Focusing") {
        const pTime = Math.round(
          (1 - session.timeRemaining / focusDurationSec) * 100
        );
        return pTime;
      } else if (session.label === "On Break") {
        const pTime = Math.round(
          (1 - session.timeRemaining / breakDurationSec) * 100
        );
        return pTime;
      } else {
        return 0;
      }
    }else{
      return 0;
    }
  }

  /**
   * Custom hook that invokes the callback function every second
   *
   * NOTE: You will not need to make changes to the callback function
   */
  useInterval(
    () => {
      if (session.timeRemaining === 0) {
        new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
        return setSession(nextSession(focusDuration, breakDuration));
      }
      return setSession(nextTick);
    },
    isTimerRunning ? 1000 : null
  );

  /**
   * Called whenever the play/pause button is clicked.
   */
  function playPause() {
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setSession((prevStateSession) => {
          // If the timer is starting and the previous session is null,
          // start a focusing session.
          if (prevStateSession === null) {
            return {
              label: "Focusing",
              timeRemaining: focusDuration * 60,
            };
          }
          return prevStateSession;
        });
      }
      return nextState;
    });
  }

  function stopSession() {
    setIsTimerRunning(false);
    setSession(null);
  }

  function getMinutes() {
    return session.label === "Focusing"
      ? minutesToDuration(focusDuration)
      : minutesToDuration(breakDuration);
  }

  function ClockData() {
    return (
      <div>
        <div className="row mb-2">
          <div className="col">
            <h2 data-testid="session-title">
              {session && session.label} for {getMinutes()} minutes
            </h2>
            <p className="lead" data-testid="session-sub-title">
              {secondsToDuration(session.timeRemaining)} remaining
            </p>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col">
            <div className="progress" style={{ height: "20px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={updateProgress()}
                style={{ width: `${updateProgress()}%`}}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  function increaseTimer(timerType) {
    if (timerType === "Focusing") {
      if (focusDuration < 60) setFocusDuration(focusDuration + 5);
    } else {
      if (breakDuration < 15) setBreakDuration(breakDuration + 1);
    }
  }

  function decreaseTimer(timerType) {
    if (timerType === "Focusing") {
      if (focusDuration >= 10) setFocusDuration(focusDuration - 5);
    } else {
      if (breakDuration > 1) setBreakDuration(breakDuration - 1);
    }
  }

  return (
    <div className="pomodoro">
      <div className="row">
        <div className="col">
          <DurationControls
            type={"Focusing"}
            session={session}
            duration={focusDuration}
            increaseTimer={increaseTimer}
            decreaseTimer={decreaseTimer}
          />
        </div>
        <div className="col">
          <div className="float-right">
            <DurationControls
              type={"On Break"}
              session={session}
              duration={breakDuration}
              increaseTimer={increaseTimer}
              decreaseTimer={decreaseTimer}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <TimerControls
            session={session}
            playPause={playPause}
            isTimerRunning={isTimerRunning}
            stopSession={stopSession}
          />
        </div>
      </div>
      {session && <ClockData />}
    </div>
  );
}

export default Pomodoro;
