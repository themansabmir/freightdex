import MultiSelectInput from "@shared/components/Dropdown";
import { useState } from "react";

const DashboardPage = () => {
  const fruitOptions = [
    { label: "Apple", value: "apple" },
    { label: "Orange", value: "orange" },
    { label: "Banana", value: "banana" },
    { label: "Mango", value: "mango" },
    { label: "fruit", value: "fruit" },
    { label: "vegie", value: "vegie" },
  ];

  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  console.log(selected);

  const handleSelect = (val: string) => {
    setSelected((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );

  };

  return (
    <div>
      DashboardPage
      <h2>Tag Picker Example (No RSuite)</h2>
      <MultiSelectInput
        label="Select Fruits"
        options={fruitOptions}
        name='Search'
        selectedValues={selected}
        onSelect={handleSelect}
        inputValue={input}
        onInputChange={setInput}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </div>
  );
};

export default DashboardPage;
