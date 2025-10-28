export const containerSize =[
    {label:"20FT", value:"20"},
    {label:"40FT", value:"40"},
];

export const containerType =[
    {label:"GENERAL", value:"GENERAL"},
    {label:"REEFER", value:"REEFER"},
    {label:"HAZARDOUS", value:"HAZARDOUS"},
];

export const tradeType =[
    {label:"IMPORT", value:"IMPORT"},
    {label:"EXPORT", value:"EXPORT"},
];


export const columnsArr = [
      { accessorKey: 'SHIPPING_LINE', header: 'Shipping Line', size: 150 },
      { accessorKey: 'CONTAINER_TYPE', header: 'Type', size: 100 },
      { accessorKey: 'CONTAINER_SIZE', header: 'Size', size: 100 },
      { accessorKey: 'START_PORT', header: 'Start Port', size: 120 },
      { accessorKey: 'END_PORT', header: 'End Port', size: 120 },
      { accessorKey: 'CHARGE_NAME', header: 'Charge Name', size: 180 },
      { accessorKey: 'HSN_CODE', header: 'HSN Code', size: 140 },
      { accessorKey: 'PRICE', header: 'Price', size: 100, isNumeric: true },
      { accessorKey: 'EFFECTIVE_FROM', header: 'Effective From', size: 150 },
      { accessorKey: 'EFFECTIVE_TO', header: 'Effective To', size: 150 },
      { accessorKey: 'TRADE_TYPE', header: 'Trade Type', size: 100 },
]