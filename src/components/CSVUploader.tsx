"use client";
import React, { useState, ChangeEvent } from "react";
import Papa from "papaparse";
import { CSVMapping } from "@/models/csv";
import { CSV_FIELD_LABELS, REQUIRED_CSV_FIELDS } from "../lib/constants";

const CsvUploadMapper: React.FC = () => {
  // State to store the uploaded CSV file.
  const [csvFile, setCsvFile] = useState<File | null>(null);
  // State to hold the extracted CSV header names.
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  // State to hold the mapping from each required field to a CSV header.
  const [mapping, setMapping] = useState<Partial<CSVMapping>>({});

  /**
   * Reads the selected CSV file, and uses Papa Parse to extract the header row.
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCsvFile(file);

      // Parse the CSV file to extract only the header row.
      Papa.parse(file, {
        header: true,
        preview: 1,
        complete: (results) => {
          const headers = results.meta.fields as string[];
          setCsvHeaders(headers);

          // Auto-map if CSV headers match the required fields.
          const initialMapping: Partial<CSVMapping> = {};
          REQUIRED_CSV_FIELDS.forEach((field) => {
            if (headers.includes(field)) {
              initialMapping[field as keyof CSVMapping] = field;
            }
          });
          setMapping(initialMapping);
        },
        error: (error) => {
          console.error("Error parsing CSV file:", error);
        },
      });
    }
  };

  /**
   * Updates the mapping state when a user selects a CSV header for a required field.
   * @param requiredField - The required field from our data model.
   * @param value - The CSV header value selected.
   */
  const handleMappingChange = (
    requiredField: keyof CSVMapping,
    value: string
  ) => {
    setMapping((prevMapping) => ({
      ...prevMapping,
      [requiredField]: value,
    }));
  };

  /**
   * Submits the CSV file along with the mapping configuration to the backend for processing.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!csvFile) {
      alert("Please upload a CSV file first.");
      return;
    }

    // Build form data with the file and mapping as JSON.
    const formData = new FormData();
    formData.append("file", csvFile);
    formData.append("mapping", JSON.stringify(mapping));

    try {
      const response = await fetch("/api/process-csv", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Parse the response as JSON
        const data = await response.json();
        alert("CSV file processed successfully!");
        console.log("Response Data:", data);
      } else {
        alert("Error processing CSV file.");
      }
    } catch (error) {
      console.error("Error submitting CSV file:", error);
      alert("An error occurred while processing the file.");
    }
  };

  console.log(csvFile);
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Upload and Map CSV File</h1>
      {/* CSV file upload input */}
      <input type="file" accept=".csv" onChange={handleFileChange} />

      {/* Once a file is uploaded and headers are parsed, display the mapping form */}
      {csvFile && csvHeaders.length > 0 && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h2 className="text-xl">Map CSV Columns to Data Fields</h2>
          {/* Render a dropdown for each required field */}
          {REQUIRED_CSV_FIELDS.map((field) => (
            <div key={field} className="flex flex-col">
              <label htmlFor={field} className="font-medium">
                {CSV_FIELD_LABELS[field]}
              </label>
              <select
                id={field}
                value={mapping[field] || ""}
                onChange={(e) => handleMappingChange(field, e.target.value)}
                className="p-2 border rounded text-slate-950"
              >
                <option value="">Select a column</option>
                {csvHeaders.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <button
            type="submit"
            className="p-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit CSV
          </button>
        </form>
      )}
    </div>
  );
};

export default CsvUploadMapper;
