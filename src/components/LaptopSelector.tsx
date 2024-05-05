"use client";

import { useState } from "react";
import { laptopOptions } from "../constants/laptopOptions";
import apiInstance from "@/utils/axiosInstance";

interface result {
  "results ": {
    linear_regression: number[];
    random_forest: number[];
    gradient_boosting: number[];
  };
}
function LaptopSelector() {
  const [result, setResult] = useState<any>();
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string | number>
  >({
    laptop_brand: "",
    ram: 0,
    ssd: 0,
    hdd: 0,
    no_of_cores: 0,
    no_of_threads: 0,
    cpu_brand: "",
    gpu_brand: "",
    size: "",
    resolution: "",
    os: "",
  });

  async function predictResult() {
    const features: string[] = [];
    Object.entries(selectedOptions).forEach(([key, value]) => {
      if (key in laptopOptions) {
        const option = laptopOptions[key];
        features.push(
          Object.keys(option).find((key) => option[key] === value) ?? "0"
        );
      } else {
        features.push(value.toString());
      }
    });

    console.log(features);

    const req = {
      input: features.map((value) => parseInt(value)),
    };
    const response = await apiInstance.post("/predict", req);

    const rf = response.data["results "]["random_forest"]
    console.log(rf);

    setResult(Math.round(rf))
  }

  const handleOptionChange = (category: string, value: string) => {
    setSelectedOptions({ ...selectedOptions, [category]: value });
  };

  const handleNumericChange = (category: string, value: string) => {
    const parsedString = parseInt(value);
    if (parsedString >= 0) {
      setSelectedOptions({ ...selectedOptions, [category]: value });
    }
  };

  const numericOptions = [
    {
      name: "ram",
      title: "RAM (GB)",
    },
    {
      name: "ssd",
      title: "SDD (GB)",
    },
    {
      name: "hdd",
      title: "HDD (GB)",
    },
    {
      name: "no_of_cores",
      title: "Number of Cores",
    },
    {
      name: "no_of_threads",
      title: "Number of Threads",
    },
  ];
  return (
    <div className="w-full border rounded-lg p-6">
      <p>Estimated Price:</p>
      <div className="flex items-center justify-center border p-4 mt-2 rounded h-32">
        {result ? (
          <p className="text-5xl italic">{result} INR</p>
        ) : (
          <p className="text-gray-500 text-xl">Awaiting Input...</p>
        )}
      </div>
      <div className="space-y-4 mt-8">
        {Object.entries(laptopOptions).map(([key, value], index) => (
          <div key={index} className="flex items-center justify-between">
            <label className="w-32 shrink-0" htmlFor={key}>
              {key}:
            </label>
            <select
              defaultValue={undefined}
              className="truncate px-4 py-2 w-full rounded bg-gray-900 border border-gray-700"
              id="laptopBrand"
              value={selectedOptions[key]}
              onChange={(e) => handleOptionChange(key, e.target.value)}
            >
              <option value={undefined}>Select option</option>
              {Object.entries(value).map(
                ([optionIndex, optionValue], index) => (
                  <option key={index} value={optionValue}>
                    {optionValue}
                  </option>
                )
              )}
            </select>
          </div>
        ))}
        {numericOptions.map((option, index) => (
          <div key={index} className="flex items-center justify-between">
            <label className="w-32 shrink-0" htmlFor="ram">
              {option.title}
            </label>
            <input
              className="truncate px-4 py-2 w-full rounded bg-gray-900 border border-gray-700"
              type="number"
              id="ram"
              value={selectedOptions[option.name]}
              onChange={(e) => handleNumericChange(option.name, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div>
        <button
          type="button"
          onClick={predictResult}
          className="w-full h-12 mt-8 flex items-center justify-center border rounded-lg hover:bg-gray-900 transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default LaptopSelector;
