import { TextField , Checkbox} from "@shared/components";

const CustomerForm = ({payload, customerForm, chargesForm, payloadData, selectedOptions, handleChange, handleCheckboxChange}) => {


const chargesFields = [
  { key: "thc", label: "Terminal Handling Charges" },
  { key: "ccf", label: "Container Cleaning Fee" },
  { key: "cmf", label: "Container Maintenance Fee" },
  { key: "offdoc", label: "Off-Dock Charges" },
  { key: "DO_FEE", label: "Delivery Order Fee" },
  { key: "HBL_FEE", label: "House Bill of Lading Fee" },
  { key: "IHC", label: "Inland Haulage Charges" },
  { key: "LiftOnLiftOff", label: "Lift On/Lift Off Charges" },
];

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
        {customerForm.map((field, i) => {
          return (
            <div style={{ margin: "0.5em 0" }}>
              <TextField
                key={i}
                label={field.label}
                name={field.name}
                required={field.isRequired}
                placeholder={field.label}
                onChange={handleChange}
              />
            </div>
          );
        })}
      </div>

          <h2>Add Charges </h2>
          <div style={{display:'flex', gap:"1em", flexWrap:'wrap'}}>

      {chargesFields.map(({key, label}, i) => {
        return (
            <Checkbox key={i} label={ label} checked={selectedOptions.includes(key)} onChange={() =>handleCheckboxChange(key)} />
        );
      })}
          </div>

      {selectedOptions.length > 0 &&
        Object.entries(chargesForm).map(([key, value]) => {
          console.log(key, "KEY");
          if (selectedOptions.includes(key)) {
            return (
              <div>
                <TextField

                  label={value[0].label}
                  name={`${key}_${value[0].name}`}
                  placeholder={value[0].label}
                  onChange={handleChange}
                />
                <input type="date" name={value[1].name} onChange={handleChange} />
              </div>
            );
            //   return <p key={key}>{value}</p>;
          }
        })}
    </>
  );
};

export default CustomerForm;
