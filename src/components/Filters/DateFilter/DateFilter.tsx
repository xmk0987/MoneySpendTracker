import styles from "./DateFilter.module.css";

interface DateFilterProps {
  filterStartDate: string;
  filterEndDate: string;
  onFilterStartDateChange: (value: string) => void;
  onFilterEndDateChange: (value: string) => void;
}

/**
 * DateFilter renders two date inputs for filtering transactions by date range.
 *
 * @param filterStartDate - The current start date filter.
 * @param filterEndDate - The current end date filter.
 * @param onFilterStartDateChange - Callback when the start date changes.
 * @param onFilterEndDateChange - Callback when the end date changes.
 */
const DateFilter: React.FC<DateFilterProps> = ({
  filterStartDate,
  filterEndDate,
  onFilterStartDateChange,
  onFilterEndDateChange,
}) => {
  return (
    <div className={styles.filter}>
      <div className={styles.date}>
        <label htmlFor="dateStart">Date start</label>
        <input
          id="dateStart"
          type="date"
          value={filterStartDate}
          onChange={(e) => onFilterStartDateChange(e.target.value)}
        />
      </div>

      <div className={styles.date}>
        <label htmlFor="dateEnd">Date end</label>
        <input
          id="dateEnd"
          type="date"
          value={filterEndDate}
          onChange={(e) => onFilterEndDateChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default DateFilter;
