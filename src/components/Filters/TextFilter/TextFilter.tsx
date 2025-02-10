import styles from "./TextFilter.module.css";

interface TextFilterProps {
  filterText: string;
  onFilterTextChange: (value: string) => void;
}

/**
 * TextFilter renders a single text input for filtering transactions by string fields.
 *
 * @param filterText - The current text filter.
 * @param onFilterTextChange - Callback when the text filter changes.
 */
const TextFilter: React.FC<TextFilterProps> = ({
  filterText,
  onFilterTextChange,
}) => {
  return (
    <div className={styles.filter}>
      <label>Search:</label>
      <input
        placeholder="Sender / Receiver"
        type="text"
        value={filterText}
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
    </div>
  );
};

export default TextFilter;
