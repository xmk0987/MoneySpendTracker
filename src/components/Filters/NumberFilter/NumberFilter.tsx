import styles from "./NumberFilter.module.css";

interface NumberFilterProps {
  filterMin: number | "";
  filterMax: number | "";
  onFilterMinChange: (value: number | "") => void;
  onFilterMaxChange: (value: number | "") => void;
}

/**
 * NumberFilter renders two number inputs for filtering transactions by a numeric range.
 *
 * @param filterMin - The current minimum filter value.
 * @param filterMax - The current maximum filter value.
 * @param onFilterMinChange - Callback when the min value changes.
 * @param onFilterMaxChange - Callback when the max value changes.
 */
const NumberFilter: React.FC<NumberFilterProps> = ({
  filterMin,
  filterMax,
  onFilterMinChange,
  onFilterMaxChange,
}) => {
  return (
    <div className={styles.filter}>
      <div className={styles.number}>
        <label>Min:</label>
        <input
          type="number"
          placeholder="0"
          value={filterMin}
          onChange={(e) =>
            onFilterMinChange(e.target.value ? Number(e.target.value) : "")
          }
        />
      </div>
      <div className={styles.number}>
        <label>Max:</label>
        <input
        placeholder="0"
          type="number"
          value={filterMax}
          onChange={(e) =>
            onFilterMaxChange(e.target.value ? Number(e.target.value) : "")
          }
        />
      </div>
    </div>
  );
};

export default NumberFilter;
