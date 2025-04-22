import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

const Column = ({ header, title }) => {
  return (
    <button className='table__column-cell'>
      {title}
      <span>
        {header.column.getIsSorted() === "asc" ? (
          <ChevronUp size={16} />
        ) : header.column.getIsSorted() === "desc" ? (
          <ChevronDown size={16} />
        ) : (
          <ChevronsUpDown size={16} />
        )}
      </span>
    </button>
  );
};

export default Column;
