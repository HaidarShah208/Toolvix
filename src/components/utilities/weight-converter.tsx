"use client";

import { ConverterPanel } from "./converter-panel";

export default function WeightConverter() {
  return (
    <ConverterPanel
      title="Weight converter"
      shareTitle="Weight Converter"
      category="weight"
      defaultFrom="kg"
      defaultTo="lb"
    />
  );
}
