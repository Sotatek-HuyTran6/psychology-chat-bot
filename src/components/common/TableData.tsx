import { Button, Drawer, Form, Pagination, Table } from 'antd';
import { useForm } from 'antd/es/form/Form';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import clsx from 'clsx';
import lodash from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useMediaQuery } from 'react-responsive';
import type { ColumnsTypeExtend } from '../../types';
import { TableSortIcon } from './TableSortIcon';

interface TableDataProps<T, B> {
  columns: ColumnsTypeExtend<T>;
  dataSource: T[];
  rowKey?: string | ((record: T) => string);
  pagination?: false | TablePaginationConfig;
  pageSize?: number;
  currentPage?: number;
  total?: number;
  title?: string;
  onPageChange?: (page: number, pageSize: number) => void;
  filterForm?: {
    label: string;
    component: React.ReactElement;
    name: string;
  }[];
  onSort?: (
    v: {
      sortKey: keyof T;
      order: 'DESC' | 'ASC';
    } | null,
  ) => void;
  onFilter?: (v: B) => void;
  isLoading?: boolean;
  renderRightFilter?: () => React.ReactElement;
  isFilterable?: boolean;
}

export const TableData = <T extends object, B extends object>({
  columns,
  dataSource,
  rowKey,
  pageSize = 10,
  currentPage = 1,
  total,
  onPageChange,
  filterForm,
  title,
  onSort,
  onFilter,
  isLoading = false,
  renderRightFilter,
  isFilterable = true,
}: TableDataProps<T, B>) => {
  const [showFilter, setShowFilter] = useState(false);
  const [form] = useForm<B>();
  const [sorter, setSorter] = useState<{
    sortKey: keyof T;
    order: 'DESC' | 'ASC';
  } | null>(null);
  const isMobile = useMediaQuery({ maxWidth: 768 }); // Tailwind breakpoint md

  const onChangeSorter = useCallback(
    (
      v: {
        sortKey: keyof T;
        order: 'DESC' | 'ASC';
      } | null,
    ) => {
      setSorter(v);

      onSort && onSort(v);
    },
    [onSort],
  );

  const handleValuesChange = useMemo(
    () =>
      lodash.debounce((_, allValues: B) => {
        onFilter && onFilter(allValues);
      }, 500),
    [onFilter],
  );

  const customColumns: ColumnsType<T> = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return columns?.map((item: any) => ({
      title: (
        <div
          className={clsx('font-medium flex gap-2 items-center', item.sort && 'cursor-pointer')}
          onClick={() => {
            if (item.sort) {
              if (!sorter) {
                onChangeSorter({
                  sortKey: item.key as keyof T,
                  order: 'ASC',
                });
              } else if (sorter.sortKey === item.key && sorter.order === 'ASC') {
                onChangeSorter({
                  sortKey: item.key as keyof T,
                  order: 'DESC',
                });
              } else {
                onChangeSorter(null);
              }
            }
          }}
        >
          {item.title as string}
          {item.sort && (
            <TableSortIcon order={sorter?.sortKey === item.key ? sorter?.order : 'NONE'} />
          )}
        </div>
      ),
      dataIndex: item.dataIndex,
      key: item.key,
      render: item.render,
    }));
  }, [columns, sorter, onChangeSorter]);

  const onResetFilter = () => {
    form.resetFields();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onFilter && onFilter({} as any);
  };

  return (
    <div className="w-full">
      {title && (
        <div className="mb-8">
          <p className="font-bold text-[28px] leading-[40px] dark:text-white">{title}</p>
        </div>
      )}

      {
        isFilterable && (
          <div className="flex justify-between max-sm:flex-col mb-6 gap-6">
            <div className="flex gap-4">
              <Button
                onClick={() => setShowFilter(!showFilter)}
                className="min-w-[120px] !h-14 !border-none !rounded-xl !font-semibold !text-black dark:!bg-[#101828] dark:!text-white"
              >
                Lọc
              </Button>
              <Button
                onClick={() => onResetFilter()}
                className="min-w-[120px] !h-14 !border-none !rounded-xl !font-semibold !text-[#C92929] dark:!bg-[#101828]"
              >
                Đặt lại bộ lọc
              </Button>
            </div>
            <div>{renderRightFilter ? renderRightFilter() : null}</div>
          </div>
        )
      }

      <div
        className={clsx(
          'flex overflow-hidden gap-0 transition-all duration-200',
          showFilter && 'gap-4',
        )}
      >
        <div className="flex-1 transition-all duration-200 w-[calc(100%-376px)]">
          <Table<T>
            columns={customColumns}
            dataSource={dataSource}
            loading={isLoading}
            rowKey={rowKey || 'id'}
            pagination={false}
            scroll={{ x: 'max-content' }}
            rowClassName={(_, index) =>
              index % 2 === 0 ? 'dark:bg-gray-900 bg-white' : 'dark:bg-gray-950 bg-gray-50'
            }
          />

          <div className="flex justify-center mt-4">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              onChange={onPageChange}
              hideOnSinglePage
            />
          </div>
        </div>

        {isMobile ? (
          <Drawer
            open={showFilter}
            styles={{ body: { padding: '12px 0 0 0' } }}
            width={300}
            onClose={() => setShowFilter(false)}
          >
            <div className="px-8 py-8 relative w-[300px]">
              <div
                onClick={() => setShowFilter(false)}
                className="absolute top-4 right-2 cursor-pointer w-[24px] h-[24px] hover:bg-gray-100 flex items-center justify-center rounded-sm transition-all duration-200"
              >
                <IoMdClose size={18} />
              </div>
              <h2 className="text-[16px] font-semibold mb-2">Lọc</h2>
              <p className="text-[14px] mb-8 text-[#8E979F]">Lọc dữ liệu theo các tiêu chí</p>

              <Form
                form={form}
                layout="vertical"
                className="mt-12"
                onValuesChange={handleValuesChange}
              >
                {filterForm?.map((item) => (
                  <Form.Item
                    key={item.name}
                    label={<span className="font-bold">{item.label}</span>}
                    name={item.name}
                  >
                    {item.component}
                  </Form.Item>
                ))}
              </Form>
            </div>
          </Drawer>
        ) : (
          <div
            className={clsx(
              `rounded-2xl bg-white dark:bg-gray-900 dark:text-gray-100 transition-all duration-200 ${showFilter ? 'w-[360px] border-1' : 'w-0 border-0'}`,
            )}
          >
            <div className="px-8 py-4 relative w-[360px]">
              <div
                onClick={() => setShowFilter(false)}
                className="absolute top-4 right-2 cursor-pointer w-[24px] h-[24px] hover:bg-gray-100 dark:hover:text-gray-900 flex items-center justify-center rounded-sm transition-all duration-200"
              >
                <IoMdClose size={18} />
              </div>
              <h2 className="text-[16px] font-semibold mb-2">Lọc</h2>
              <p className="text-[14px] mb-8 text-[#8E979F]">Lọc dữ liệu theo các tiêu chí</p>

              <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
                {filterForm?.map((item) => (
                  <Form.Item
                    key={item.name}
                    label={<span className="font-bold">{item.label}</span>}
                    name={item.name}
                  >
                    {item.component}
                  </Form.Item>
                ))}
              </Form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
