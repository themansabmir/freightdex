export const useCustomerDataLayer = () => {
  const customerForm = [
    {
      label: "Company Name",
      isRequired: true,
      name: "companyName",
    },
    {
      label: "City",
      isRequired: true,
      name: "city",
    },
    {
      label: "Address",
      isRequired: true,
      name: "address",
    },
    {
      label: "State",
      isRequired: true,
      name: "state",
    },
    {
      label: "Pin Code",
      isRequired: true,
      name: "pinCode",
    },
    {
      label: "Country",
      isRequired: true,
      name: "country",
    },

    {
      label: "Telephone Number",
      isRequired: false,
      name: "telephoneNumber",
    },
    {
      label: "Fax",
      isRequired: false,
      name: "fax",
    },
    {
      label: "PAN Number",
      isRequired: false,
      name: "panNumber",
    },
    {
      label: "GST Number",
      isRequired: false,
      name: "gstNumber",
    },
  ];

  const charges = {
    thc: [
      { name: "THC", label: "THC" },
      { name: "THC WEF", label: "THC WEF" },
    ],
    ccf: [
      { name: "CCF", label: "CCF" },
      { name: "CCF WEF", label: "CCF WEF" },
    ],
    cmf: [
      { name: "CMF", label: "CMF" },
      { name: "CMF WEF", label: "CMF WEF" },
    ],
  };

  const payload = customerForm.map((field) => ({ [field.name]: "" }))[0];

  return { customerForm, payload, charges };
};
