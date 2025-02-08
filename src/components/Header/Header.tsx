import React from "react";
import Logo from "@/components/Logo/Logo";
import styles from "./Header.module.css";
import { useTransactionsData } from "@/context/TransactionsDataContext";
import { useParams } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Header = () => {
  const { id } = useParams() as { id: string };
  const { transactionsData, removeFile } = useTransactionsData();
  const pathname = usePathname();

  const dashboardPath = `/${id}/dashboard`;
  const transactionsPath = `/${id}/transactions`;

  return (
    <div className={styles.header}>
      <div className={styles.headerOptions}>
        <Logo size={40} />
        <nav className={styles.nav}>
          <Link
            href={dashboardPath}
            className={pathname === dashboardPath ? styles.active : ""}
          >
            Dashboard
          </Link>
          <Link
            href={transactionsPath}
            className={pathname === transactionsPath ? styles.active : ""}
          >
            Transactions
          </Link>
        </nav>
      </div>
      <div className={styles.headerOptions}>
        <p>{transactionsData.fileName}</p>
        <button className={styles.remove} onClick={() => removeFile()}>X</button>
      </div>
    </div>
  );
};

export default Header;
