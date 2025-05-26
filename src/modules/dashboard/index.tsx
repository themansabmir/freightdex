import Dropdown from "@shared/components/SingleDropdown";
import { useState } from "react";

const DashboardPage = () => {
  const [selected, setSelected]= useState("")


  return (
    <div>
      DashboardPage
      <Dropdown
        label="Country"
        options={[
          { label: 'India', value: 'IN' },
          { label: 'USA', value: 'US' },
          { label: 'Germany', value: 'DE' },
          { label: 'India', value: 'IN' },
          { label: 'USA', value: 'US' },
          { label: 'Germany', value: 'DE' },
          { label: 'India', value: 'IN' },
          { label: 'USA', value: 'US' },
          { label: 'Germany', value: 'DE' },
          { label: 'India', value: 'IN' },
          { label: 'USA', value: 'US' },
          { label: 'Germany', value: 'DE' },
        ]}
        value={selected}
        onChange={(item)=>setSelected(item)}
        placeholder="Select a country"
        searchable
      />

    </div>
  );
};

export default DashboardPage;
