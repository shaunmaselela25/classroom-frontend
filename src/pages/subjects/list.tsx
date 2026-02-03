import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb.tsx';
import { ListView } from '@/components/refine-ui/views/list-view.tsx';
import { useMemo, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select.tsx';
import { SelectValue } from '@radix-ui/react-select';
import { DEPARTMENT_OPTIONS } from '@/constants';
import { CreateButton } from '@/components/refine-ui/buttons/create.tsx';
import { DataTable } from '@/components/refine-ui/data-table/data-table.tsx';
import { useTable } from '@refinedev/react-table';
import { Subject } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge.tsx';
import { Search } from 'lucide-react';

const SubjectsList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("all");

    const departmentFilters = selectedDepartment === 'all' ? [] : [{ field: 'department', operator: 'eq' as const, value: selectedDepartment }];
    const searchFilters = searchQuery ? [{ field: 'name', operator: 'contains' as const, value: searchQuery }] : [];

    const subjectTable = useTable<Subject>({
        columns: useMemo<ColumnDef<Subject>[]>(() => [
            {
                id: 'code',
                accessorKey: 'code',
                size: 100,
                header: () => <p className="column-title ml-2">Code</p>,
                cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>
            },
            {
                id: 'name',
                accessorKey: 'name',
                size: 200,
                header: () => <p className='column-title'>Name</p>,
                cell: ({ getValue }) => <span>{getValue<string>()}</span>,
                filterFn: 'includesString'
            },
            {
                id: 'department',
                accessorKey: 'department.name',
                size: 150,
                header: () => <p className='column-title'>Department</p>,
                cell: ({ row }) => {
                    const deptName = row.original.department?.name || 'N/A';
                    return <Badge variant='secondary'>{deptName}</Badge>;
                }
            },
            {
                id: 'description',
                accessorKey: 'description',
                size: 300,
                header: () => <p className='column-title'>Description</p>,
                cell: ({ getValue }) => <span className='truncate line-clamp-2'>{getValue<string>()}</span>
            }
        ], []),
        refineCoreProps: {
            resource: 'subjects',
            pagination: { pageSize: 10, mode: 'server' },
            filters: {
                permanent: [...departmentFilters, ...searchFilters]
            },
            sorters: { initial: [{ field: 'id', order: 'desc' }] }
        }
    });

    // Debug logging
    console.log('Subjects Table Data:', subjectTable.refineCore.tableQuery.data);
    console.log('Is Loading:', subjectTable.refineCore.tableQuery.isLoading);
    console.log('Error:', subjectTable.refineCore.tableQuery.error);
    console.log('Rows:', subjectTable.reactTable.getRowModel().rows);

    const tableData = subjectTable.refineCore.tableQuery.data;
    const isLoading = subjectTable.refineCore.tableQuery.isLoading;
    const error = subjectTable.refineCore.tableQuery.error;

    return (
        <ListView>
            <Breadcrumb />

            <h1 className="page-title">Subjects</h1>

            {/* DEBUG INFO */}
            <div className="bg-yellow-100 p-4 mb-4 rounded border-2 border-yellow-500">
                <p><strong>Debug Info:</strong></p>
                <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
                <p>Error: {error ? JSON.stringify(error) : 'None'}</p>
                <p>Data Count: {tableData?.data?.length || 0}</p>
                <p>Backend URL: {import.meta.env.VITE_BACKEND_BASE_URL}</p>
                <p>Total: {tableData?.total || 'N/A'}</p>
                <details className="mt-2">
                    <summary className="cursor-pointer font-bold">Raw Data (click to expand)</summary>
                    <pre className="text-xs overflow-auto max-h-60 mt-2 bg-white p-2 rounded">
                        {JSON.stringify(tableData, null, 2)}
                    </pre>
                </details>
            </div>

            <div className="intro-row">
                <div className="search-field">
                    <Search className="search-icon" />
                    <input
                        id="subject-search"
                        name="subject-search"
                        type="text"
                        placeholder="search by name..."
                        className="pl-10 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                        <SelectTrigger>
                            <SelectValue placeholder="filter by department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                All Departments
                            </SelectItem>
                            {DEPARTMENT_OPTIONS.map(department => (
                                <SelectItem key={department.value} value={department.value}>
                                    {department.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <CreateButton />
                </div>
            </div>
            <DataTable table={subjectTable} />
        </ListView>
    );
};

export default SubjectsList;