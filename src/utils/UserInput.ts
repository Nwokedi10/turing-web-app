export type UserInput = {
  message: string;
};

export function getUserInput(inputText: string): UserInput {
  return {
    message: inputText,
  };
}
