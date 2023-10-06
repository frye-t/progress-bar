import { useState, useEffect } from "react";

const ProgressBar = ({ onBarCompleteFill, attributes, onDelete }) => {
  const [fill, setFill] = useState(0);

  const barWidth = 200;
  const barHeight = 20;
  const animationDuration = 5000;
  const startTime = Date.now();

  const { isActive, id } = attributes;

  let progressBarInterval;
  let currentFill;

  useEffect(() => {
    if (isActive) {
      const animateFill = () => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;

        if (elapsedTime < animationDuration) {
          currentFill = (elapsedTime / animationDuration) * barWidth;
          setFill(currentFill);
        } else {
          clearInterval(progressBarInterval);
          setFill(barWidth);
          onBarCompleteFill(id);
        }
      };
      progressBarInterval = setInterval(animateFill, 10);
    }

    return () => {
      clearInterval(progressBarInterval);
    };
  }, [isActive]);
  
  const handleDeleteClicked = () => {
    onDelete(id);
  }

  return (
    <div className="container">
      <div
        className="progress-bar-container"
        style={{ width: `${barWidth}px`, height: `${barHeight}px` }}
      >
        <div
          className="progress-bar"
          style={{ width: `${fill}px`, height: `${barHeight}px` }}
        ></div>
      </div>
      <button onClick={handleDeleteClicked}>X</button>
    </div>
  );
};

export default ProgressBar;
