import React from "react";
import Logo from "@/components/Logo/Logo";
import styles from "./Header.module.css";
import { useParams } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useDashboardData } from "@/context/DashboardDataProvider";
import { useDashboardLogic } from "@/context/DashboardLogicProvider";

const Header = () => {
  const { id } = useParams() as { id: string };
  const { dashboardData } = useDashboardData();
  const { removeFile } = useDashboardLogic();
  const pathname = usePathname();

  const dashboardPath = `/${id}/dashboard`;
  const transactionsPath = `/${id}/transactions`;

  if (!dashboardData) {
    return null;
  }

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
        <p>{dashboardData.fileName}</p>
        <button className={styles.remove} onClick={() => removeFile()}>
          X
        </button>
      </div>
    </div>
  );
};

export default Header;
