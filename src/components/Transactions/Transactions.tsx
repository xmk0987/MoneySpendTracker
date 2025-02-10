import React, { useState, useMemo } from "react";
import { TransactionsData } from "@/models/types";
import Transaction from "@/models/Transaction";
import { formatDate, toLocalDateString } from "@/utils/dates";
import styles from "./Transactions.module.css";
import ArrowDown from "@/assets/icons/ArrowDown";
import ArrowUp from "@/assets/icons/ArrowUp";
import NumberFilter from "../Filters/NumberFilter/NumberFilter";
import DateFilter from "../Filters/DateFilter/DateFilter";
import TextFilter from "../Filters/TextFilter/TextFilter";

interface TransactionsProps {
  data: TransactionsData;
}

type SortField = "total" | "sender" | "receiverNameOrTitle" | "dateCreated";

const Transactions: React.FC<TransactionsProps> = ({ data }) => {
  const transactions = data.transactions;

  const [sortField, setSortField] = useState<SortField>("dateCreated");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Filtering states:
  // For sender/receiver fields.
  const [filterText, setFilterText] = useState<string>("");
  // For numeric (total) filtering.
  const [filterMin, setFilterMin] = useState<number | "">("");
  const [filterMax, setFilterMax] = useState<number | "">("");
  // For date filtering.
  const [filterStartDate, setFilterStartDate] = useState<string>(
    toLocalDateString(data.summary.timeline.startDate)
  );
  const [filterEndDate, setFilterEndDate] = useState<string>(
    toLocalDateString(data.summary.timeline.endDate)
  );

  /**
   * Handles clicking on a table header.
   * - If the same field is clicked again, toggles the sort direction.
   * - If a new field is clicked, sets that as the sort field and defaults to ascending order.
   *
   * @param field - The field to sort by.
   */
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  /**
   * Returns a sorted copy of the transactions based on the current sort field and direction.
   */
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (sortField === "dateCreated") {
        const timeA = new Date(aValue).getTime();
        const timeB = new Date(bValue).getTime();
        return sortDirection === "asc" ? timeA - timeB : timeB - timeA;
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return sortDirection === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [transactions, sortField, sortDirection]);

  /**
   * Filters the sorted transactions based on multiple active filter criteria.
   */
  const filteredTransactions = useMemo(() => {
    return sortedTransactions.filter((transaction) => {
      if (filterText) {
        const text = filterText.toLowerCase();
        if (
          !transaction.sender.toLowerCase().includes(text) &&
          !transaction.receiverNameOrTitle.toLowerCase().includes(text)
        ) {
          return false;
        }
      }

      if (filterMin !== "" && transaction.total < filterMin) return false;
      if (filterMax !== "" && transaction.total > filterMax) return false;

      const transactionDate = toLocalDateString(transaction.dateCreated);
      if (filterStartDate && transactionDate < filterStartDate) return false;
      if (filterEndDate && transactionDate > filterEndDate) return false;

      return true;
    });
  }, [
    sortedTransactions,
    filterText,
    filterMin,
    filterMax,
    filterStartDate,
    filterEndDate,
  ]);

  const filteredTotal = filteredTransactions
    .reduce((accumulator, transaction) => accumulator + transaction.total, 0)
    .toFixed(2);

  return (
    <div className={styles.content}>
      <div className={styles.options}>
        <div className={styles.filtering}>
          <p>Filtering</p>
          <div className={styles.filters}>
            <DateFilter
              filterStartDate={filterStartDate}
              filterEndDate={filterEndDate}
              onFilterStartDateChange={setFilterStartDate}
              onFilterEndDateChange={setFilterEndDate}
            />
            <NumberFilter
              filterMin={filterMin}
              filterMax={filterMax}
              onFilterMinChange={setFilterMin}
              onFilterMaxChange={setFilterMax}
            />
            <TextFilter
              filterText={filterText}
              onFilterTextChange={setFilterText}
            />
          </div>
        </div>
        <div className={styles["infoBox"]}>
          <p className="text-2l">Total</p>
          <p className="text-2l">{filteredTotal}</p>
        </div>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <button
                  className={styles.headerItem}
                  onClick={() => handleSort("total")}
                >
                  Total
                  {sortField === "total" &&
                    (sortDirection === "desc" ? <ArrowDown /> : <ArrowUp />)}
                </button>
              </th>
              <th>
                <button
                  className={styles.headerItem}
                  onClick={() => handleSort("sender")}
                >
                  Sender
                  {sortField === "sender" &&
                    (sortDirection === "desc" ? <ArrowDown /> : <ArrowUp />)}
                </button>
              </th>
              <th>
                <button
                  className={styles.headerItem}
                  onClick={() => handleSort("receiverNameOrTitle")}
                >
                  Receiver / Title
                  {sortField === "receiverNameOrTitle" &&
                    (sortDirection === "desc" ? <ArrowDown /> : <ArrowUp />)}
                </button>
              </th>
              <th>
                <button
                  className={styles.headerItem}
                  onClick={() => handleSort("dateCreated")}
                >
                  Date
                  {sortField === "dateCreated" &&
                    (sortDirection === "desc" ? <ArrowDown /> : <ArrowUp />)}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction: Transaction, index) => (
              <tr key={`transaction-${transaction.total}-${index}`}>
                <td>{transaction.total}</td>
                <td>{transaction.sender}</td>
                <td>{transaction.receiverNameOrTitle}</td>
                <td>{formatDate(transaction.dateCreated)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
