import React from "react";
import {Table, Transfer} from 'antd';
import difference from 'lodash/difference';
import {TransferProps} from "antd/lib/transfer";

export type TableTransferProps = {
  leftColumns: any;
  rightColumns: any;

};

const TableTransfer: React.FC<TableTransferProps & TransferProps<any>> = (props) => {
  const {leftColumns, rightColumns, ...restProps} = props;
  return (
    <Transfer {...restProps}>
      {({
          direction,
          filteredItems,
          onItemSelectAll,
          onItemSelect,
          selectedKeys: listSelectedKeys,
          disabled: listDisabled,
        }) => {
        const columns = direction === 'left' ? leftColumns : rightColumns;

        const rowSelection = {
          getCheckboxProps: (item: any) => ({disabled: listDisabled || item.disabled}),
          onSelectAll(selected: boolean, selectedRows: any[]) {
            const treeSelectedKeys = selectedRows
              .filter(item => !item.disabled)
              .map(({key}) => key);
            const diffKeys = selected
              ? difference(treeSelectedKeys, listSelectedKeys)
              : difference(listSelectedKeys, treeSelectedKeys);
            onItemSelectAll(diffKeys, selected);
          },
          onSelect({key}: any, selected: boolean) {
            onItemSelect(key, selected);
          },
          selectedRowKeys: listSelectedKeys,
        };

        return (
          <Table
            showHeader={false}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredItems}
            pagination={{defaultPageSize: 6}}
            size="small"
            style={{pointerEvents: listDisabled ? 'none' : 'auto'}}
            onRow={({key, disabled: itemDisabled}) => ({
              onClick: () => {
                if (itemDisabled || listDisabled) return;
                if (!key) return;
                onItemSelect(key, !listSelectedKeys.includes(key));
              },
            })}
          />
        );
      }}
    </Transfer>
  );
};

export default TableTransfer;
