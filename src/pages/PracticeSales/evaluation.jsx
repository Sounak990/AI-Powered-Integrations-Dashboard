import React, { useState, useEffect } from 'react';

const SalesEvaluation = ({ start }) => {
  const [countdown, setCountdown] = useState(3);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    if (start) {
      setIsEvaluating(true);
    }
  }, [start]);

  useEffect(() => {
    let timer;
    if (countdown > 0 && isEvaluating) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && isEvaluating) {
      startEvaluation();
    }
    return () => clearTimeout(timer);
  }, [countdown, isEvaluating]);

  const startEvaluation = () => {
    console.log("Evaluation started");
    // Add your logic here
  };

  if (!isEvaluating) {
    return null;
  }

  return (
    <div>
      {countdown > 0 ? <div>Starting in {countdown}...</div> : <div>Evaluation in progress...</div>}
    </div>
  );
};

export default SalesEvaluation;
