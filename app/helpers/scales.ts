type Scale = {
  percentage: number;
  from: number;
  to?: number;
};

const spainScale: Scale[] = [
  { percentage: 19, from: 0, to: 12450 },
  { percentage: 24, from: 12450, to: 20200 },
  { percentage: 30, from: 20200, to: 35200 },
  { percentage: 37, from: 35200, to: 60000 },
  { percentage: 45, from: 60000 },
];

const italyScale: Scale[] = [
  { percentage: 23, from: 0, to: 15000 },
  { percentage: 27, from: 15000, to: 28000 },
  { percentage: 38, from: 28000, to: 55000 },
  { percentage: 41, from: 55000, to: 75000 },
  { percentage: 43, from: 75000 },
];

const scales = new Map<string, Scale[]>();

scales.set("es", spainScale.reverse());
scales.set("it", italyScale.reverse());

export const countries = [
  { name: "Spain", code: "es", flag: "🇪🇸" },
  { name: "Italy", code: "it", flag: "🇮🇹" },
];

export default scales;
