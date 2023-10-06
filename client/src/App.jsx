import { useState, useEffect } from "react";
import "./App.css";
import ProgressBar from "./components/ProgressBar";

function App() {
  const [progressBars, setProgressBars] = useState([]);
  const [numActiveBars, setNumActiveBars] = useState(0);

  useEffect(() => {
    // Start up the first bar when it gets added
    if (numActiveBars === 0 && progressBars.length === 1) {
      progressBars[0].isActive = true;
    }

    // Any time progresBars is updated, set the number of current active bars
    setNumActiveBars(
      progressBars.reduce((acc, bar) => {
        return acc + (bar.isShown && bar.isActive ? 1 : 0);
      }, 0)
    );
  }, [progressBars]);

  const handleCreateProgressBarClicked = () => {
    const id = progressBars.length;
    const isActive = numActiveBars < 5 ? true : false;
    setProgressBars([
      ...progressBars,
      { id, isActive, isShown: true, isComplete: false },
    ]);
  };

  const handleBarCompleteFill = (id) => {
    setProgressBars((prevProgressBars) => {
      // Find the first bar that is not active or complete, but is shown
      const nextBar = prevProgressBars.find((bar) => {
        return !bar.isActive && bar.isShown && !bar.isComplete;
      });

      // Create a new array of bars, setting the next one to be active
      const newProgressBars = prevProgressBars.map((bar) =>
        bar === nextBar ? { ...bar, isActive: true } : bar
      );

      // Set the completed bar to not active and isComplete
      const finishedBar = newProgressBars.find((bar) => bar.id === id);
      finishedBar.isActive = false;
      finishedBar.isComplete = true;
      return newProgressBars;
    });
  };

  const handleDelete = (id) => {
    setProgressBars((prevProgressBars) => {
      // Find the bar we need to delete
      const deletedBar = prevProgressBars.find((bar) => bar.id === id);

      // Hide the deleted bar
      const updatedBars = prevProgressBars.map((bar) =>
        bar === deletedBar
          ? { ...bar, isShown: false, isActive: false }
          : { ...bar }
      );

      // If deleting an active bar, need to start up the next one
      if (deletedBar.isActive) {
        const nextBar = prevProgressBars.find(
          (bar) => !bar.isActive && bar.isShown && !bar.isComplete
        );
        if (nextBar) {
          nextBar.isActive = true;
        }
      }

      return updatedBars;
    });
  };

  return (
    <>
      <button onClick={handleCreateProgressBarClicked}>
        Create Progress Bar
      </button>
      {progressBars.map((progressBar, idx) => {
        return (
          progressBar.isShown && (
            <div key={idx}>
              <ProgressBar
                attributes={progressBar}
                onBarCompleteFill={handleBarCompleteFill}
                onDelete={handleDelete}
              />
            </div>
          )
        );
      })}
    </>
  );
}

export default App;
