import React, { useState, useMemo } from "react";
import { TransactionsData } from "@/models/types";
import Transaction from "@/models/Transaction";
import { formatDate } from "@/utils/dates";
import styles from "./Transactions.module.css";
import ArrowDown from "@/assets/icons/ArrowDown";
import ArrowUp from "@/assets/icons/ArrowUp";

interface TransactionsProps {
  data: TransactionsData;
}

type SortField = "total" | "sender" | "receiverNameOrTitle" | "dateCreated";

const Transactions: React.FC<TransactionsProps> = ({ data }) => {
  const transactions = data.transactions;

  const [sortField, setSortField] = useState<SortField>("dateCreated");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  /**
   * Handles clicking on a table header.
   * - If the same field is clicked again, toggles the sort direction.
   * - If a new field is clicked, sets that as the sort field and defaults to ascending order.
   *
   * @param field - The field to sort by.
   */
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle sort direction if the same header is clicked.
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

  return (
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
          {sortedTransactions.map((transaction: Transaction, index) => (
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
  );
};

export default Transactions;
