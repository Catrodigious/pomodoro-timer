import React from "react";

export const DurationControls = function ({
  type,
  session,
  duration,
  increaseTimer,
  decreaseTimer,
}) {
  const increaseTypeId =
    type === "Focusing" ? "increase-focus" : "increase-break";
  const decreaseTypeId =
    type === "Focusing" ? "decrease-focus" : "decrease-break";

  function ShowFocusDuration() {
    if (duration < 10) {
      return (
        <span className="input-group-text" data-testid="duration-focus">
          Focus Duration: 0{duration}:00 min
        </span>
      );
    } else {
      if (duration >= 10) {
        return (
          <span className="input-group-text" data-testid="duration-focus">
            Focus Duration: {duration}:00 min
          </span>
        );
      }
    }
  }

  function ShowBreakDuration() {
    // using Math.min/max in order to set the upper and lower bounds
    // using if/else for the 0 before the time if time is less than 10
    if (Math.min(duration, 1) && Math.max(duration, 15)) {
      if (duration < 10) {
        return (
          <span className="input-group-text" data-testid="duration-break">
            {/* TODO: Update this text to display the current break session duration */}
            Break Duration: 0{duration}:00 min
          </span>
        );
      } else {
        return (
          <span className="input-group-text" data-testid="duration-break">
            {/* TODO: Update this text to display the current break session duration */}
            Break Duration: {duration}:00 min
          </span>
        );
      }
    }
  }

  function ShowDuration() {
    if (type === "Focusing") return <ShowFocusDuration />;
    else return <ShowBreakDuration />;
  }

  return (
    <div className="input-group input-group-lg mb-2">
      <ShowDuration />
      <div className="input-group-append">
        <button
          type="button"
          className="btn btn-secondary"
          data-testid={decreaseTypeId}
          onClick={() => decreaseTimer(type)}
          disabled={session ? true : false}
        >
          <span className="oi oi-minus" />
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          data-testid={increaseTypeId}
          onClick={() => increaseTimer(type)}
          disabled={session ? true : false}
        >
          <span className="oi oi-plus" />
        </button>
      </div>
    </div>
  );
};

export default DurationControls;
