import { DIGITS, useCalculator } from "./logic";

import "./index.css";

export default function Calculator() {
  const calculator = useCalculator();

  return (
    <div id="calculator">
      <div id="calculator-display">
        <h2>{calculator.expression || 0}</h2>
        <h1>{calculator.value || 0}</h1>
      </div>

      <div id="calculator-keypad">
        <div className="row">
          <button className="accent" onClick={() => calculator.clear()}>
            AC
          </button>

          <button
            className="accent"
            onClick={() => calculator.removeLastToken()}
          >
            C
          </button>
        </div>

        <div className="row">
          <button onClick={() => calculator.add()}>+</button>
          <button onClick={() => calculator.sub()}>-</button>
          <button onClick={() => calculator.calculate()}>=</button>
        </div>

        <div className="grid">
          {DIGITS.map((value, index) => (
            <button key={index} onClick={() => calculator.digit(value)}>
              {value}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
