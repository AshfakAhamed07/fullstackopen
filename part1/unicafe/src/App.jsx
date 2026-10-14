import { useState } from "react";

const Button = ({ onClick, title }) => (
  <button onClick={onClick}>{title}</button>
);
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

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={handleGood} title="good" />
      <Button onClick={handleNeutral} title="neutral" />
      <Button onClick={handleBad} title="bad" />
      <h1>Statistics</h1>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
    </div>
  );
};

export default App;
