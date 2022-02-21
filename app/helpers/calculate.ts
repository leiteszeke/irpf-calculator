// const scales = [
//   { percentage: 19, from: 0, to: 12450 },
//   { percentage: 24, from: 12450, to: 20200 },
//   { percentage: 30, from: 20200, to: 35200 },
//   { percentage: 37, from: 35200, to: 60000 },
//   { percentage: 45, from: 60001 }
// ];

const getNetValue = (amount: number, percentage: number) =>
  (percentage * amount) / 100;

const calculate = (amount: number) => {
  let currentAmount = amount;
  const values = [];

  if (currentAmount >= 60001) {
    const calculatedValue = currentAmount - 60000;
    currentAmount -= calculatedValue;
    values.push(getNetValue(calculatedValue, 45));
  }

  if (currentAmount > 35200) {
    const calculatedValue = currentAmount - 35200;
    currentAmount -= calculatedValue;
    values.push(getNetValue(calculatedValue, 37));
  }

  if (currentAmount > 20200) {
    const calculatedValue = currentAmount - 20200;
    currentAmount -= calculatedValue;
    values.push(getNetValue(calculatedValue, 30));
  }

  if (currentAmount > 12450) {
    const calculatedValue = currentAmount - 12450;
    currentAmount -= calculatedValue;
    values.push(getNetValue(calculatedValue, 24));
  }

  values.push(getNetValue(currentAmount, 19));

  return amount - values.reduce((prev, curr) => prev + curr, 0);
};

export type CalculateValue = {
  grossIncome: string;
  grossIncomePerMonth: string;
  netIncome: string;
  netIncomePerMonth: string;
  finalPercentage: string;
};

export enum Currency {
  EUR,
  GBP,
  USD,
}

export const numberFormatter = (
  type: "currency" | "percent",
  configId: Currency
) => {
  const config = [
    { locale: "es-ES", currency: "EUR" },
    { locale: "en-GB", currency: "GBP" },
    { locale: "en-US", currency: "USD" },
  ];

  const currentConfig = config[configId];

  if (type === "percent") {
    return new Intl.NumberFormat(currentConfig.locale, {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return new Intl.NumberFormat(currentConfig.locale, {
    style: "currency",
    currency: currentConfig.currency,
  });
};

export const calculateValues = (grossIncome: number): CalculateValue => {
  const grossIncomePerMonth = (grossIncome / 12).toFixed(2);
  const netIncome = calculate(grossIncome);
  const netIncomePerMonth = (netIncome / 12).toFixed(2);
  const finalPercentage = (100 - (netIncome * 100) / grossIncome).toFixed(2);

  const currencyFormatter = numberFormatter("currency", Currency.EUR);
  const percentageFormatter = numberFormatter("percent", Currency.EUR);

  return {
    grossIncome: currencyFormatter.format(grossIncome),
    grossIncomePerMonth: currencyFormatter.format(Number(grossIncomePerMonth)),
    netIncome: currencyFormatter.format(netIncome),
    netIncomePerMonth: currencyFormatter.format(Number(netIncomePerMonth)),
    finalPercentage: percentageFormatter.format(Number(finalPercentage) / 100),
  };
};
