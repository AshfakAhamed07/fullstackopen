import { useState } from "react";

const Button = ({ onClick, title }) => (
  <button onClick={onClick}>{title}</button>
);

const Statistics = ({ good, neutral, bad, all, average, positive }) => {
  return (
    <div>
      <h1>Statistics</h1>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
      <p>all {all}</p>
      <p>average {average}</p>
      <p>positive {positive}% </p>
    </div>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGood = () => {
    setGood((previousGood) => previousGood + 1);
  };

  const handleNeutral = () => {
    setNeutral((previousNeutral) => previousNeutral + 1);
  };

  const handleBad = () => {
    setBad((previousBad) => previousBad + 1);
  };

  const all = good + neutral + bad;
  const average = all === 0 ? 0 : (good - bad) / all;
  const positive = all === 0 ? 0 : (good / all) * 100;

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={handleGood} title="good" />
      <Button onClick={handleNeutral} title="neutral" />
      <Button onClick={handleBad} title="bad" />
      {all === 0 ? (
        <p>No feedback given</p>
      ) : (
        <Statistics
          good={good}
          neutral={neutral}
          bad={bad}
          all={all}
          average={average}
          positive={positive}
        />
      )}
    </div>
  );
};

export default App;
