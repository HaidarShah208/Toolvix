"use client";

import { ConverterPanel } from "./converter-panel";

export default function LengthConverter() {
  return (
    <ConverterPanel
      title="Length converter"
      shareTitle="Length Converter"
      category="length"
      defaultFrom="m"
      defaultTo="ft"
    />
  );
}
