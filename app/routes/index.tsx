import { useCallback, useEffect, useState } from "react";
import {
  CalculateValue,
  numberFormatter,
  Currency,
  calculateValues,
} from "../helpers/calculate";
import { countries } from "../helpers/scales";
import {
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Box,
  Radio,
  TableContainer,
  TableCell,
  Table,
  TableRow,
  TableBody,
} from "@mui/material";
import axios from "axios";

type CurrencyExchange = {
  USD_EUR: number;
  EUR_USD: number;
  GBP_EUR: number;
  EUR_GBP: number;
};

const TableItem = ({ title, value }: { title: string; value: string }) => (
  <TableRow>
    <TableCell>
      <Box sx={{ fontSize: 16, fontFamily: "Roboto", fontWeight: "bold" }}>
        {title}
      </Box>
    </TableCell>
    <TableCell align="right">
      <Box sx={{ fontSize: 16, fontFamily: "Roboto" }}>{value}</Box>
    </TableCell>
  </TableRow>
);

export default function Index() {
  const [value, setValue] = useState<string>("0");
  const [currentCountry, setCurrentCountry] = useState<string>(
    countries[0].code
  );
  const [calculatedValues, setCalculatedValues] =
    useState<CalculateValue | null>(null);
  const [currency, setCurrency] = useState<Currency>(Currency.EUR);
  const [exchange, setExchange] = useState<CurrencyExchange | null>(null);

  const getExchange = async () => {
    try {
      const { data: dollar } = await axios.get<CurrencyExchange>(
        `https://free.currconv.com/api/v7/convert?q=USD_EUR,EUR_USD&compact=ultra&apiKey=3d7bdad5e1ef374facd6`
      );

      const { data: pound } = await axios.get<CurrencyExchange>(
        `https://free.currconv.com/api/v7/convert?q=GBP_EUR,EUR_GBP&compact=ultra&apiKey=3d7bdad5e1ef374facd6`
      );

      setExchange({
        ...dollar,
        ...pound,
      });
    } catch (e) {}
  };

  const calculate = useCallback(() => {
    const currentValue = Number(value);

    if (currentValue === 0) {
      alert("Your gross amount should be higher than 0");
      return setCalculatedValues(null);
    }

    let multiplier = 1;

    if (exchange) {
      switch (currency) {
        case Currency.USD:
          multiplier = exchange.USD_EUR;
          break;

        case Currency.GBP:
          multiplier = exchange.GBP_EUR;
          break;
      }
    }

    const grossAmount = currentValue * multiplier;
    const values = calculateValues(currentCountry, grossAmount);

    setCalculatedValues(values);
  }, [currentCountry, exchange, value]);

  const onValueChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => setValue(e.currentTarget.value);

  const onCurrencyChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setCurrency(Number(e.currentTarget.value) as Currency);

  useEffect(() => {
    if (calculatedValues) {
      calculate();
    }
  }, [currency, currentCountry]);

  useEffect(() => {
    getExchange();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          fontSize: "h3.fontSize",
          fontFamily: "Roboto",
          textAlign: "center",
        }}
      >
        IRFP Calculator
      </Box>
      <Box
        sx={{
          fontSize: "h6.fontSize",
          fontFamily: "Roboto",
          textAlign: "center",
        }}
      >
        Input your gross income in EUR, GBP or USD
      </Box>

      <Box
        sx={{
          display: "grid",
          width: 300,
          m: "0 auto",
          mt: 3,
        }}
      >
        <FormControl component="fieldset">
          <FormLabel component="legend">Country</FormLabel>
          <Box>
            {countries.map((country) => (
              <button
                key={country.code}
                style={{
                  marginRight: 12,
                  marginTop: 12,
                  border: "none",
                  fontSize: 20,
                  borderRadius: 12,
                  padding: 12,
                  backgroundColor:
                    currentCountry === country.code ? undefined : "white",
                }}
                onClick={() => setCurrentCountry(country.code)}
              >
                {country.flag}
              </button>
            ))}
          </Box>
        </FormControl>
      </Box>

      {exchange && (
        <Box
          sx={{
            display: "grid",
            width: 300,
            m: "0 auto",
            mt: 3,
          }}
        >
          <FormControl component="fieldset">
            <FormLabel component="legend">Currency</FormLabel>

            <RadioGroup
              row
              aria-label="currency"
              name="currency"
              value={currency}
              onChange={onCurrencyChange}
            >
              <FormControlLabel
                value={Currency.EUR}
                control={<Radio />}
                label="EUR"
              />
              <FormControlLabel
                value={Currency.GBP}
                control={<Radio />}
                label="GBP"
              />
              <FormControlLabel
                value={Currency.USD}
                control={<Radio />}
                label="USD"
              />
            </RadioGroup>
          </FormControl>
        </Box>
      )}

      <Box
        sx={{
          display: "grid",
          width: 300,
          m: "0 auto",
          mt: 4,
        }}
      >
        <FormControl>
          <TextField
            type="number"
            label="Gross amount"
            onChange={onValueChange}
            defaultValue={value}
            inputProps={{
              min: 0,
            }}
          />
        </FormControl>
      </Box>

      <Box sx={{ display: "grid", justifyContent: "center", mt: 1 }}>
        <Button
          style={{ marginTop: 24 }}
          variant="contained"
          type="button"
          onClick={calculate}
        >
          Calculate
        </Button>
      </Box>

      {calculatedValues && (
        <Box sx={{ display: "grid", justifyContent: "center", mt: 3 }}>
          <TableContainer>
            <Table>
              <TableBody>
                {exchange && currency === Currency.USD && (
                  <TableItem
                    value={`${numberFormatter("currency", currency).format(
                      exchange.EUR_USD
                    )} = 1€`}
                    title="Exchange Rate"
                  />
                )}
                {exchange && currency === Currency.GBP && (
                  <TableItem
                    value={`${numberFormatter("currency", currency).format(
                      exchange.EUR_GBP
                    )} = 1€`}
                    title="Exchange Rate"
                  />
                )}
                <TableItem
                  value={`${calculatedValues.grossIncome}`}
                  title="Gross Income"
                />
                <TableItem
                  value={`${calculatedValues.grossIncomePerMonth}`}
                  title="Gross Income per Month"
                />
                <TableItem
                  value={`${calculatedValues.netIncome}`}
                  title="Net Income"
                />
                <TableItem
                  value={`${calculatedValues.netIncomePerMonth}`}
                  title="Net Income per Month"
                />
                <TableItem
                  value={`${calculatedValues.finalPercentage}`}
                  title="Final Percentage"
                />
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </div>
  );
}
