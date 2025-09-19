import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
} from "@heroui/react"; // Asumsi 'SortDescriptor' & 'Selection' diekspor dari sini
import type { SortDescriptor, Selection } from "@heroui/react";
import { ChevronDownIcon, PlusIcon, SearchIcon, MoreVerticalIcon } from "lucide-react";

interface BaseFilter {
  key: string;
  label: string;
}

interface DropdownFilter extends BaseFilter {
  type: 'dropdown';
  options: { name: string; uid: string }[];
  selectionMode?: 'single' | 'multiple';
}

interface DateFilter extends BaseFilter {
  type: 'date';
}

export type FilterConfig = DropdownFilter | DateFilter;

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading: boolean;

  paginationInfo: { page: number; limit: number; totalData: number; totalPages: number };
  setPaginationInfo: React.Dispatch<React.SetStateAction<any>>;

  filters?: FilterConfig[];
  filterState?: Record<string, any>;
  setFilterState?: React.Dispatch<React.SetStateAction<any>>;
  
  filterValue: string;
  setFilterValue: (value: string) => void;
  
  statusFilter?: Selection;
  setStatusFilter?: (keys: Selection) => void;
  
  sortDescriptor: SortDescriptor;
  setSortDescriptor: (descriptor: SortDescriptor) => void;

  // Opsi Tambahan
  statusOptions?: { name: string; uid: string }[];
  statusColorMap?: Record<string, 'success' | 'danger' | 'warning' | 'default' | 'primary' | 'secondary'>;
  initialVisibleColumns?: string[];

  onAddNew?: () => void;
  onEditItem?: (item: T) => void;
  onDeleteItem?: (item: T) => void;
  onViewItem?: (item: T) => void;
}

function getNestedValue<T>(obj: T, path: string): any {
  return path.split('.').reduce((acc:any, part) => acc && acc[part], obj);
}

export type Column<T> = {
  name: string;
  uid: string // 'actions' adalah kolom spesial
  sortable?: boolean;
  defaultVisible?: boolean;
  renderCell?: (item: T) => React.ReactNode;
};

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

const DataTable = <T extends { id: React.Key; [key: string]: any }>({
  data,
  columns,
  isLoading,
  filters,
  filterState,
  setFilterState,
  paginationInfo,
  setPaginationInfo,
  filterValue,
  setFilterValue,
  statusFilter,
  setStatusFilter,
  sortDescriptor,
  setSortDescriptor,
  statusOptions = [],
  statusColorMap = {},
  onAddNew,
  onEditItem,
  onDeleteItem,
  onViewItem,
}: DataTableProps<T>) => {
  // State internal untuk UI, tidak berhubungan dengan data fetching
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const initialVisibleColumns = React.useMemo(() => {
    return new Set(
      columns.filter(col => col.defaultVisible).map(col => col.uid)
    );
  }, [columns]);
  
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    initialVisibleColumns
  );

  // --- MEMOS & CALLBACKS ---

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid as string),
    );
  }, [visibleColumns, columns]);

  const onPageChange = React.useCallback(
    (page: number) => {
      setPaginationInfo((prev: any) => ({ ...prev, page }));
    },
    [setPaginationInfo],
  );

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setPaginationInfo((prev: any) => ({
        ...prev,
        limit: Number(e.target.value),
        page: 1,
      }));
    },
    [setPaginationInfo],
  );

  const onSearchChange = React.useCallback(
    (value?: string) => {
      setFilterValue(value || '');
      setPaginationInfo((prev: any) => ({ ...prev, page: 1 }));
    },
    [setFilterValue, setPaginationInfo],
  );

  const onClear = React.useCallback(() => {
    setFilterValue('');
    setPaginationInfo((prev: any) => ({ ...prev, page: 1 }));
  }, [setFilterValue, setPaginationInfo]);


  // --- RENDER FUNCTIONS ---

  const renderCell = React.useCallback((item: T, columnKey: React.Key) => {
    const column = columns.find((col) => col.uid === (columnKey as string));

    // Prioritas 1: Cek apakah ada override dari komponen induk
    if (column?.renderCell) {
        return column.renderCell(item);
    }

    // Prioritas 2: Jika tidak ada override, gunakan render default internal
    const cellValue = getNestedValue(item, columnKey as string);

    switch (columnKey) {
      case 'name': // Asumsi kolom 'name' akan selalu menampilkan User
        return (
          cellValue as string
        );
      case 'status':
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[cellValue as string]}
            size="sm"
            variant="flat"
          >
            {cellValue as string}
          </Chip>
        );
      case 'actions':
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <MoreVerticalIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="view" onPress={() => onViewItem?.(item)}>View</DropdownItem>
                <DropdownItem key="edit" onPress={() => onEditItem?.(item)}>Edit</DropdownItem>
                <DropdownItem key="delete" onPress={() => onDeleteItem?.(item)}>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue as React.ReactNode;
    }
  }, [columns, statusColorMap]);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            {filters && filterState && setFilterState && filters.map((filter) => {
              switch (filter.type) {
                case 'dropdown':
                  return (
                    <Dropdown key={filter.key}>
                      <DropdownTrigger className="hidden sm:flex">
                        <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                          {filter.label}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label={`${filter.label} Filter`}
                        closeOnSelect={false}
                        selectedKeys={filterState[filter.key] || new Set()}
                        selectionMode={filter.selectionMode || 'multiple'} 
                        onSelectionChange={(keys) => {
                          setFilterState(prev => ({ ...prev, [filter.key]: keys }));
                        }}
                      >
                        {filter.options.map((option) => (
                          <DropdownItem key={option.uid} className="capitalize">
                            {capitalize(option.name)}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  );
                case 'date':
                  // Contoh untuk filter tanggal (bisa diganti dengan komponen DatePicker dari library UI Anda)
                  return (
                    <div key={filter.key}>
                       <label className="text-sm">{filter.label}</label>
                       <Input
                          type="date"
                          value={filterState[filter.key] || ''}
                          onChange={(e) => {
                             setFilterState(prev => ({ ...prev, [filter.key]: e.target.value }));
                          }}
                       />
                    </div>
                  );
                default:
                  return null;
              }
            })}
            {statusOptions.length > 0 && (
              <Dropdown>
                <DropdownTrigger className="hidden sm:flex">
                  <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                    Status
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Table Columns"
                  closeOnSelect={false}
                  selectedKeys={statusFilter}
                  selectionMode="multiple"
                  onSelectionChange={setStatusFilter}
                >
                  {statusOptions.map((status) => (
                    <DropdownItem key={status.uid} className="capitalize">
                      {capitalize(status.name)}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            )}
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid as string} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {onAddNew && (
            <Button color="primary" endContent={<PlusIcon />}  onPress={onAddNew}>
              Add New
            </Button>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {paginationInfo.totalData} items
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
              defaultValue={paginationInfo.limit}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    onSearchChange,
    onClear,
    statusFilter,
    setStatusFilter,
    statusOptions,
    visibleColumns,
    setVisibleColumns,
    columns,
    onRowsPerPageChange,
    paginationInfo.totalData,
    paginationInfo.limit,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === 'all'
            ? 'All items selected'
            : `${selectedKeys.size} of ${data.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={paginationInfo.page}
          total={paginationInfo.totalPages}
          onChange={onPageChange}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={paginationInfo.page <= 1} size="sm" variant="flat" onPress={() => onPageChange(paginationInfo.page - 1)}>
            Previous
          </Button>
          <Button isDisabled={paginationInfo.page >= paginationInfo.totalPages} size="sm" variant="flat" onPress={() => onPageChange(paginationInfo.page + 1)}>
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, data.length, paginationInfo, onPageChange]);

  return (
    <Table
      isHeaderSticky
      aria-label="Example table with dynamic data"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid as string}
            align={column.uid === 'actions' ? 'center' : 'start'}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={data}
        isLoading={isLoading}
        emptyContent={!isLoading && 'No data found'}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default DataTable;