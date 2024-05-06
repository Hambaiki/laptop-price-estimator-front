"use client";

import { useEffect, useState } from "react";
import { laptopOptions, optionKeyMapping } from "../constants/laptopOptions";
import apiInstance from "@/utils/axiosInstance";
import { FaSpinner } from "react-icons/fa";

interface ResultResponseI {
  linear_regression: number[];
  random_forest: number[];
  gradient_boosting: number[];
}

interface ResultI {
  linearRegression: number;
  randomForest: number;
  gradientBoosting: number;
}

function LaptopSelector() {
  const [result, setResult] = useState<ResultI>();
  const [isLoading, setIsLoading] = useState(false);
  const [isOptionsValid, setIsOptionsValid] = useState(true);

  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: number | string;
  }>({
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
    setIsLoading(true);

    const req = {
      ram: selectedOptions["ram"],
      ssd: selectedOptions["ssd"],
      hdd: selectedOptions["hdd"],
      screen_size: optionKeyMapping.size[selectedOptions["size"]] ?? 0,
      screen_resolution:
        optionKeyMapping.resolution[selectedOptions["resolution"]] ?? 0,
      no_of_cores: selectedOptions["no_of_cores"],
      no_of_threads: selectedOptions["no_of_threads"],
      brand: optionKeyMapping.laptopBrand[selectedOptions["laptop_brand"]] ?? 0,
      cpu_brand: optionKeyMapping.cpuBrand[selectedOptions["cpu_brand"]] ?? 0,
      gpu_brand: optionKeyMapping.gpuBrand[selectedOptions["gpu_brand"]] ?? 0,
      os: optionKeyMapping.os[selectedOptions["os"]] ?? 0,
    };

    try {
      const response = await apiInstance.post<ResultResponseI>("/predict", req);

      setResult({
        linearRegression: Math.round(
          response.data.linear_regression[0] * 0.012
        ),
        randomForest: Math.round(response.data.random_forest[0] * 0.012),
        gradientBoosting: Math.round(
          response.data.gradient_boosting[0] * 0.012
        ),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  function handleOptionChange(category: string, value: string) {
    setSelectedOptions({ ...selectedOptions, [category]: value });
  }

  function handleNumericChange(category: string, value: string) {
    const parsedString = parseInt(value);
    if (parsedString >= 0) {
      setSelectedOptions({ ...selectedOptions, [category]: value });
    }
  }

  // useEffect(() => {
  //   setIsOptionsValid(
  //     Object.values(selectedOptions).every(
  //       (value) => typeof value !== 'number' && value
  //     )
  //   );
  // }, [selectedOptions]);

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
    <div className="w-full border rounded-lg p-6 bg-gray-50">
      <p className="font-medium">Estimated Price:</p>
      <div className="relative flex items-center justify-center border p-4 mt-2 rounded h-32 bg-gray-100">
        <div
          className={`flex absolute inset-0 backdrop-blur transition-all ${
            isLoading ? "opacity-100 " : "opacity-0 pointer-events-none"
          }`}
        >
          <FaSpinner
            className={`m-auto w-8 h-8 ${isLoading && "animate-spin"}`}
          />
        </div>

        {result ? (
          <p className="text-5xl italic">{result.randomForest} USD</p>
        ) : (
          <p className="text-gray-500 text-xl">Awaiting Input...</p>
        )}
      </div>
      <div className="space-y-4 mt-8">
        {Object.entries(laptopOptions).map(([key, value], index) => (
          <div key={index} className="flex items-center justify-between">
            <label className="w-32 shrink-0" htmlFor={key}>
              {value.title}:
            </label>
            <select
              defaultValue={undefined}
              className="truncate px-4 py-2 w-full rounded bg-gray-200 border border-gray-300"
              id="laptopBrand"
              value={selectedOptions[value.name]}
              onChange={(e) => handleOptionChange(value.name, e.target.value)}
            >
              <option value="">Select option</option>
              {value.options.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.value}
                </option>
              ))}
            </select>
          </div>
        ))}
        {numericOptions.map((option, index) => (
          <div key={index} className="flex items-center justify-between">
            <label className="w-32 shrink-0" htmlFor="ram">
              {option.title}
            </label>
            <input
              className="truncate px-4 py-2 w-full rounded bg-gray-200 border border-gray-300"
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
          disabled={!isOptionsValid}
          className={`group relative w-full h-12 mt-8 flex items-center justify-center border rounded 
                    ${
                      isOptionsValid
                        ? "border-gray-400 hover:bg-gray-200 transition-colors"
                        : "border-gray-200 text-gray-300"
                    }`}
        >
          <div
            className={`opacity-0 absolute -top-14 left-1/2 transform -translate-x-1/2 pointer-events-none transition-all bg-amber-500 text-white px-4 py-2 rounded
                      ${
                        isOptionsValid ? "hidden" : "group-hover:opacity-100 "
                      }`}
          >
            Please select all options
          </div>
          Submit
        </button>
      </div>
    </div>
  );
}

export default LaptopSelector;
