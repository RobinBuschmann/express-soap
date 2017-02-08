
export const calculatorService = {
  ICalculator: {
    Add({a, b}: {a: number, b: number}, res: Function): void {
      res({
        result: a + b
      });
    },
    Subtract({a, b}: {a: number, b: number}, res: Function): void {
      res({
        result: a - b
      });
    }
  }
};
