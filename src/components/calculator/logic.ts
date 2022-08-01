import { useImmerReducer } from "use-immer";

export const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

// Expression
type Token =
  | { type: "number"; value: number }
  | { type: "operator"; value: "+" | "-" };

// State of calculator
interface State {
  expression: Token[];
  value: number | null;
}

// Possible calculator actions
type Action =
  | { type: "ADD"; payload: Token }
  | { type: "CALCULATE" }
  | { type: "CLEAR" }
  | { type: "REMOVE_LAST_TOKEN" };

// Hook
export function useCalculator() {
  const [state, act] = useImmerReducer<State, Action>(expressionReducer, {
    expression: [],
    value: null,
  });

  return {
    value: state.value,
    expression: state.expression.map((t) => t.value).join(""),

    calculate: () => act({ type: "CALCULATE" }),
    clear: () => act({ type: "CLEAR" }),
    removeLastToken: () => act({ type: "REMOVE_LAST_TOKEN" }),

    digit: (value: number) =>
      act({ type: "ADD", payload: { type: "number", value } }),

    add: () => act({ type: "ADD", payload: { type: "operator", value: "+" } }),
    sub: () => act({ type: "ADD", payload: { type: "operator", value: "-" } }),
  };
}

function expressionReducer(state: State, action: Action) {
  switch (action.type) {
    case "ADD": {
      updateExpressionWithNewToken(action.payload, state.expression);
      break;
    }

    case "CALCULATE": {
      state.value = calculateValue(state.expression);
      break;
    }

    case "REMOVE_LAST_TOKEN": {
      const lastToken = state.expression.at(-1);

      // If it's a number remove only last digit
      if (lastToken?.type === "number") {
        const stringValue = lastToken.value.toString();

        if (stringValue.length > 1)
          lastToken.value = parseInt(stringValue.slice(0, -1));
        else state.expression.pop();
      } else state.expression.pop();

      state.value = 0;
      break;
    }

    case "CLEAR": {
      state.expression = [];
      state.value = 0;
      break;
    }
  }
}

function updateExpressionWithNewToken(token: Token, expression: Token[]) {
  const lastToken = expression.at(-1);

  if (token.type === "number") {
    // If there was no token, or the last token was an operator add the number
    if (!lastToken || lastToken.type === "operator") expression.push(token);
    // If the last token was a number and this input is a number too
    // Shift the number to a place higher and add it at units place
    else lastToken.value = parseInt(`${lastToken.value}${token.value}`, 10);
  }

  if (token.type === "operator") {
    // If there was no last token, use zero along the operator
    if (!lastToken) expression.push({ type: "number", value: 0 }, token);
    // If the last token was an operator, replace it
    else if (lastToken.type === "operator") lastToken.value = token.value;
    // The last token was a number, so add the operator
    else expression.push(token);
  }
}

function calculateValue(expression: Token[]) {
  let value = 0;
  let previousOperator: "+" | "-" = "+";

  // We iterate over the tokens
  for (const currentToken of expression) {
    // If the current token is a number, we use the previous operator
    // And apply the operation
    if (currentToken.type === "number") {
      switch (previousOperator) {
        case "+": {
          value += currentToken.value;
          break;
        }

        case "-": {
          value -= currentToken.value;
          break;
        }
      }
    }
    // If its an operator, we set the previous operator for next iteration
    else previousOperator = currentToken.value;
  }

  return value;
}
