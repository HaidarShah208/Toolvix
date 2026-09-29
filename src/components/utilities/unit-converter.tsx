"use client";

import { useState } from "react";
import { SelectField } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";
import { CATEGORIES, CATEGORY_ORDER, type UnitCategory } from "@/lib/converters/units";
import { ConverterPanel } from "./converter-panel";

const OPTIONS = CATEGORY_ORDER.map((id) => ({ value: id, label: CATEGORIES[id].label }));

export default function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>("length");

  return (
    <ConverterPanel
      title="Unit converter"
      shareTitle="Unit Converter"
      category={category}
      onResetExtra={() => setCategory("length")}
      toolbar={
        <>
          <div className="hidden sm:block">
            <Segmented
              label="Measurement type"
              options={OPTIONS}
              value={category}
              onChange={setCategory}
              size="sm"
            />
          </div>
          <SelectField
            label="Measurement type"
            options={OPTIONS}
            value={category}
            onChange={(e) => setCategory(e.target.value as UnitCategory)}
            containerClassName="sm:hidden"
          />
        </>
      }
    />
  );
}
