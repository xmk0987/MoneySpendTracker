"use client";
import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import Papa from "papaparse";
import { CSVMapping } from "@/types/types";
import {
  CSV_FIELD_LABELS,
  REQUIRED_CSV_FIELDS,
  HEADER_MAPPING,
} from "../../lib/constants";
import styles from "./CSVUploader.module.css";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import demo from "@/assets/images/demo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { postCsvData } from "@/services/api/csvService";
import { useDashboardData } from "@/context/DashboardDataProvider";

interface CsvUploadMapperProps {
  setLoading: (value: boolean) => void;
}

const CsvUploadMapper: React.FC<CsvUploadMapperProps> = ({ setLoading }) => {
  const router = useRouter();
  const { setTransactionsData } = useDashboardData();

  // State to store the uploaded CSV file.
  const [csvFile, setCsvFile] = useState<File | null>(null);
  // State to hold the extracted CSV header names.
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  // State to hold the mapping from each required field to a CSV header.
  const [mapping, setMapping] = useState<Partial<CSVMapping>>({});

  const [invalidFields, setInvalidFields] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null); // Reference for the file input

  /**
   * Reads the selected CSV file, and uses Papa Parse to extract the header row.
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCsvFile(file);
      setInvalidFields([]);

      Papa.parse(file, {
        header: true,
        preview: 1,
        complete: (results) => {
          const headers = results.meta.fields as string[];
          setCsvHeaders(headers);

          const initialMapping: Partial<CSVMapping> = {};

          REQUIRED_CSV_FIELDS.forEach(() => {
            Object.keys(HEADER_MAPPING).forEach((header) => {
              if (headers.includes(header)) {
                const mappedFields = HEADER_MAPPING[header];

                // If the header maps to multiple fields, assign all of them
                mappedFields.forEach((mappedField) => {
                  if (REQUIRED_CSV_FIELDS.includes(mappedField)) {
                    initialMapping[mappedField] = header;
                  }
                });
              }
            });
          });

          setMapping(initialMapping);
        },
        error: (error) => {
          console.error("Error parsing CSV file:", error);
        },
      });
    }
  };

  const handleUploadFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
   * Validates the mapping and updates the invalidFields state.
   */
  useEffect(() => {
    const invalid = REQUIRED_CSV_FIELDS.filter(
      (field) => !mapping[field as keyof CSVMapping]
    );
    setInvalidFields(invalid);
  }, [mapping]);

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
    setLoading(true);
    const formData = new FormData();
    formData.append("file", csvFile);
    formData.append("mapping", JSON.stringify(mapping));

    try {
      const dashboardData = await postCsvData(formData);
      localStorage.setItem("transactionsId", dashboardData.id);
      setTransactionsData(dashboardData);
      router.push(`/${dashboardData.id}/dashboard`);
    } catch (error) {
      console.error("Error submitting CSV file:", error);
      alert(
        "Error processing CSV file. Make sure the csv file is a bank statements csv that contains equivalent fields to the required."
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = REQUIRED_CSV_FIELDS.every(
    (field) => mapping[field as keyof CSVMapping]
  );

  return (
    <>
      <h1 className="text-xl text-center">Money Spend Tracker</h1>
      {/* CSV file upload input */}
      {/* Hidden file input */}
      <input
        type="file"
        id="selectedFile"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        className={styles.fileInput}
      />
      {!csvFile ? <p>No file selected</p> : <p>{csvFile.name}</p>}

      {/* Custom button to trigger file input */}
      <PrimaryButton
        text={csvFile ? "Change" : "Upload"}
        onClick={handleUploadFileClick}
      />

      {/* Once a file is uploaded and headers are parsed, display the mapping form */}
      {csvFile && csvHeaders.length > 0 && (
        <>
          <h2 className="text-base mt-5">Map CSV Columns to Data Fields</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Render a dropdown for each required field */}
            {REQUIRED_CSV_FIELDS.map((field) => {
              const isInvalid = invalidFields.includes(field);
              return (
                <div key={field} className="w-full">
                  <label htmlFor={field} className="text-xs pl-1">
                    {CSV_FIELD_LABELS[field]}
                  </label>
                  <select
                    id={field}
                    value={mapping[field] || ""}
                    onChange={(e) => handleMappingChange(field, e.target.value)}
                    className={`text-xs p-2 ${
                      isInvalid ? "border-red-500" : "border-gray-300"
                    } w-full`}
                  >
                    <option value="">Select a column</option>
                    {csvHeaders.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                  {isInvalid && (
                    <p className="text-red-500 text-xs mt-1">
                      This field is required.
                    </p>
                  )}
                </div>
              );
            })}
            <button
              type="submit"
              disabled={!isFormValid}
              className={`mt-2 button ${
                isFormValid
                  ? "bg-blue-500 text-white cursor-pointer"
                  : "bg-gray-300 text-gray-700 cursor-not-allowed"
              }`}
            >
              Submit CSV
            </button>
          </form>
        </>
      )}
      {!csvFile && (
        <>
          <Image src={demo} alt={"Bank transactions dashboard"} />
          <p>
            Easily upload your bank statements and get a smart dashboard to
            track your expenses, spending, and budget insights. Improve your
            financial health today!
          </p>
        </>
      )}
    </>
  );
};

export default CsvUploadMapper;
