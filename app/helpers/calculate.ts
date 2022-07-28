import scales from "./scales";

const getNetValue = (amount: number, percentage: number) =>
  (percentage * amount) / 100;

const calculate = (country: string, amount: number) => {
  let currentAmount = amount;
  const values: number[] = [];
  const amounts = scales.get(country);

  if (!amounts) {
    return 0;
  }

  amounts.forEach((step) => {
    if (currentAmount > step.from) {
      const calculatedValue = currentAmount - step.from;
      currentAmount -= calculatedValue;
      values.push(getNetValue(calculatedValue, step.percentage));
    }
  });

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

export const calculateValues = (
  country: string,
  grossIncome: number
): CalculateValue => {
  const grossIncomePerMonth = (grossIncome / 12).toFixed(2);
  const netIncome = calculate(country, grossIncome);
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
