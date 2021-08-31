import React from 'react';
import {HotTable} from "@handsontable/react";
import 'handsontable/dist/handsontable.full.css';
import './DarkTheme.less'
import "handsontable/languages/zh-CN";

export type TableInfoEditProps = {};
const generateData = [
  {
    id: 1,
    flag: 'EUR',
    currencyCode: 'EUR',
    currency: 'Euro',
    level: 0.9033,
    units: 'EUR / USD',
    asOf: '08/19/2019',
    onedChng: false
  },
  {
    id: 2,
    flag: 'JPY',
    currencyCode: 'JPY',
    currency: 'Japanese Yen',
    level: 124.3870,
    units: 'JPY / USD',
    asOf: '08/19/2019',
    onedChng: true
  },
  {
    id: 3,
    flag: 'GBP',
    currencyCode: 'GBP',
    currency: 'Pound Sterling',
    level: 0.6396,
    units: 'GBP / USD',
    asOf: '08/19/2019',
    onedChng: false
  },
  {
    id: 4,
    flag: 'CHF',
    currencyCode: 'CHF',
    currency: 'Swiss Franc',
    level: 0.9775,
    units: 'CHF / USD',
    asOf: '08/19/2019',
    onedChng: true
  },
  {
    id: 5,
    flag: 'CAD',
    currencyCode: 'CAD',
    currency: 'Canadian Dollar',
    level: 1.3097,
    units: 'CAD / USD',
    asOf: '08/19/2019',
    onedChng: false
  },
  {
    id: 6,
    flag: 'AUD',
    currencyCode: 'AUD',
    currency: 'Australian Dollar',
    level: 1.3589,
    units: 'AUD / USD',
    asOf: '08/19/2019',
    onedChng: true
  },
  {
    id: 7,
    flag: 'NZD',
    currencyCode: 'NZD',
    currency: 'New Zealand Dollar',
    level: 1.5218,
    units: 'NZD / USD',
    asOf: '08/19/2019',
    onedChng: false
  },
  {
    id: 8,
    flag: 'SEK',
    currencyCode: 'SEK',
    currency: 'Swedish Krona',
    level: 8.5280,
    units: 'SEK / USD',
    asOf: '08/19/2019',
    onedChng: false
  },
  {
    id: 9,
    flag: 'NOK',
    currencyCode: 'NOK',
    currency: 'Norwegian Krone',
    level: 8.2433,
    units: 'NOK / USD',
    asOf: '08/19/2019',
    onedChng: false
  },
  {
    id: 10,
    flag: 'BRL',
    currencyCode: 'BRL',
    currency: 'Brazilian Real',
    level: 3.4806,
    units: 'BRL / USD',
    asOf: '08/19/2019',
    onedChng: false
  },
  {
    id: 11,
    flag: 'CNY',
    currencyCode: 'CNY',
    currency: 'Chinese Yuan',
    level: 6.3961,
    units: 'CNY / USD',
    asOf: '08/19/2019',
    onedChng: false
  },
  {
    id: 12,
    flag: 'RUB',
    currencyCode: 'RUB',
    currency: 'Russian Rouble',
    level: 65.5980,
    units: 'RUB / USD',
    asOf: '08/19/2019',
    onedChng: false
  },
  {
    id: 13,
    flag: 'INR',
    currencyCode: 'INR',
    currency: 'Indian Rupee',
    level: 65.3724,
    units: 'INR / USD',
    asOf: '08/19/2019',
    onedChng: false
  },
  {
    id: 14,
    flag: 'TRY',
    currencyCode: 'TRY',
    currency: 'New Turkish Lira',
    level: 2.8689,
    units: 'TRY / USD',
    asOf: '08/19/2019',
    onedChng: false
  },
  {
    id: 15,
    flag: 'THB',
    currencyCode: 'THB',
    currency: 'Thai Baht',
    level: 35.5029,
    units: 'THB / USD',
    asOf: '08/19/2019',
    onedChng: false
  },
  {
    id: 16,
    flag: 'IDR',
    currencyCode: 'IDR',
    currency: 'Indonesian Rupiah',
    level: 13.83,
    units: 'IDR / USD',
    asOf: '08/19/2019',
    onedChng: true
  },
  {
    id: 17,
    flag: 'MYR',
    currencyCode: 'MYR',
    currency: 'Malaysian Ringgit',
    level: 4.0949,
    units: 'MYR / USD',
    asOf: '08/19/2019',
    onedChng: false
  },
  {
    id: 18,
    flag: 'MXN',
    currencyCode: 'MXN',
    currency: 'Mexican New Peso',
    level: 16.4309,
    units: 'MXN / USD',
    asOf: '08/19/2019',
    onedChng: false
  },
  {
    id: 19,
    flag: 'ARS',
    currencyCode: 'ARS',
    currency: 'Argentinian Peso',
    level: 9.2534,
    units: 'ARS / USD',
    asOf: '08/19/2019',
    onedChng: false
  },
  {
    id: 20,
    flag: 'DKK',
    currencyCode: 'DKK',
    currency: 'Danish Krone',
    level: 6.7417,
    units: 'DKK / USD',
    asOf: '08/19/2019',
    onedChng: false
  },
  {
    id: 21,
    flag: 'ILS',
    currencyCode: 'ILS',
    currency: 'Israeli New Sheqel',
    level: 3.8262,
    units: 'ILS / USD',
    asOf: '08/19/2019',
    onedChng: false
  },
  {
    id: 22,
    flag: 'PHP',
    currencyCode: 'PHP',
    currency: 'Philippine Peso',
    level: 46.3108,
    units: 'PHP / USD',
    asOf: '08/19/2019',
    onedChng: false
  }
];

const hotSettings = {
  data: generateData,
  columns: [
    {
      data: 'id',
      type: 'numeric',
    },
    {
      data: 'flag',
      type: 'text'
    },
    {
      data: 'currencyCode',
      type: 'autocomplete', strict: true, filter: true,
      visibleRows: 10,
      trimDropdown: true,
      allowInvalid: false,
      allowEmpty: false,
      source: ['整数', '大整数1', '大整数2', '大整数3', '大整数4', '大整数5', '金额1', '金额2', '金额3', '金额4'],
    },
    {
      data: 'currency',
      type: 'text'
    },
    {
      data: 'level',
      type: 'numeric',
      numericFormat: {
        pattern: '0.0000'
      }
    },
    {
      data: 'units',
      type: 'text',
    },
    {
      data: 'asOf',
      type: 'date',
      dateFormat: 'MM/DD/YYYY'
    },
    {
      data: 'onedChng',
      type: 'checkbox',
    }
  ],
  allowRemoveColumn: false,
  stretchH: "all",
  width: "100%",
  height: "80%",
  colWidths: 100,
  fixedRowsTop: 0,
  columnSorting: true,
  autoWrapRow: true,
  manualRowResize: true,
  manualColumnResize: true,
  rowHeaders: true,
  colHeaders: [
    '测试一下  ',
    'Country',
    'Code',
    'Currency',
    'Level',
    'Units',
    'Date',
    'Change'
  ],
  manualRowMove: true,
  manualColumnMove: true,
  filters: true,
  dropdownMenu: true,
  mergeCells: false,
  copyPaste: true,
  language: "zh-CN",
  licenseKey: 'non-commercial-and-evaluation',
  className: "htCenter htMiddle",
  customBorders: false,
  contextMenu: true,
  allowInsertColumn: false,
  editor: 'text',
};


const TableInfoEdit: React.FC<TableInfoEditProps> = (props) => {
  return (
    <HotTable
      id={"data-sheet"}
      // @ts-ignore
      settings={hotSettings}
    >

    </HotTable>
  );
}

export default React.memo(TableInfoEdit);
