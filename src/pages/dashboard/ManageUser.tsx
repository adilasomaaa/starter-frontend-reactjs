import React, { useCallback, useEffect, useState } from 'react'
import DashboardBreadcrumbs from '../../components/Dashboard/Breadcrumbs'
import { type SortDescriptor, type Selection, Avatar } from '@heroui/react'
import DataTable, { type Column, type FilterConfig } from '../../components/Dashboard/DataTable'
import type { RegisterPayload, User, UserUpdatePayload } from '../../models'
import { userService } from '../../services/UserService'
import type { FormFieldConfig } from '../../types'
import InputModal from '../../components/Dashboard/InputModal'
import { env } from "../../lib/env";


const getFormFields = (mode: 'create' | 'update'): FormFieldConfig[] => {
    // Definisikan semua field yang mungkin ada
    const allFields = {
        name: { key: 'name', label: 'Nama Lengkap', type: 'text', placeholder: 'Masukkan nama...' },
        email: { key: 'user.email', label: 'Email', type: 'email', placeholder: 'contoh@email.com' },
        username: { key: 'username', label: 'Username', type: 'text', placeholder: 'Masukkan username...' },
        password: { 
            key: 'password', 
            label: 'Password', 
            type: 'password', 
            // Placeholder berbeda untuk create dan update
            placeholder: mode === 'create' ? 'Masukkan password baru...' : 'Kosongkan jika tidak ingin diubah' 
        }
    }as const;

    // Kembalikan field berdasarkan mode
    if (mode === 'create') {
        return [
            allFields.name,
            allFields.email,
            allFields.username,
            allFields.password,
        ];
    } else { // mode === 'update'
        return [
            allFields.name,
            allFields.email,
            allFields.username,
        ];
    }
};

const userColumns: Column<User>[] = [
        { 
            name: "NAME", 
            uid: "name", 
            sortable: true, 
            defaultVisible: true,
            renderCell: (user:User) => (
                <div className='flex items-center gap-4'>
                    <Avatar src={env.baseUrl + user.photo} />
                    <span>{user.name}</span>
                </div>
            ),
        },
        { name: "Username", uid: "username", sortable: true, defaultVisible: true  },
        { name: "Email", uid: "user.email", sortable: true, defaultVisible: false  },
        { name: "Status", uid: "status", sortable: true, defaultVisible: true  },
        { name: "ACTIONS", uid: "actions", defaultVisible: true },
    ];

const ManageUser = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [paginationInfo, setPaginationInfo] = useState({
        page: 1,
        limit: 10,
        totalData: 5,
        totalPages: 1,
    });

    const handleOpenCreateModal = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const formMode = editingUser ? 'update' : 'create';
    
    const activeFormFields = getFormFields(formMode);

    const [filterValue, setFilterValue] = useState("");
    const [statusFilter, setStatusFilter] = useState<Selection>(new Set());
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: 'name',
        direction: 'ascending',
    });

    const [filterState, setFilterState] = useState<Record<string, Selection | string>>({});

    const filterConfig: FilterConfig[] = [
        {
        key: 'status', // harus cocok dengan nama query param di API
        label: 'Status',
        type: 'dropdown',
        selectionMode: 'multiple',
        options: [
            { name: 'Active', uid: 'active' },
            { name: 'Pending', uid: 'pending' },
            { name: 'Inactive', uid: 'inactive' },
        ],
        },
    ];

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const statusValue = filterState.status instanceof Set && filterState.status.size > 0 
                ? Array.from(filterState.status).join(',')
                : undefined;


            const response = await userService.index({
                page: paginationInfo.page,
                limit: paginationInfo.limit,
                search: filterValue || undefined,
                status: statusValue || undefined,
            });

            setUsers(response.data);
            setPaginationInfo(response.meta);
        } catch (error) {
            console.error("Gagal mengambil data pengguna:", error);
        } finally {
            setIsLoading(false);
        }
    }, [
        paginationInfo.page, 
        paginationInfo.limit, 
        filterValue, 
        filterState, 
    ]);

    useEffect(() => {
            const timer = setTimeout(() => {
            fetchUsers();
        }, 500); // Debounce

        return () => {
            clearTimeout(timer);
        };
    }, [fetchUsers]);

    const handleSubmit = async (formData: Record<string, any>) => {
        setIsSubmitting(true);
        try {
        if (editingUser) {
            await userService.update(Number(editingUser.id), formData as UserUpdatePayload);
        } else {
            await userService.create(formData as RegisterPayload);
        }
            handleCloseModal();
            await fetchUsers(); // Panggil fungsi untuk refresh data tabel
        } catch (error) {
            console.error("Gagal menyimpan data:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
  return (
    <div>
        <DashboardBreadcrumbs/>
        <h1 className='text-2xl font-semibold my-4'>Manage User</h1>
        <DataTable
            data={users}
            isLoading={isLoading}
            columns={userColumns}
            paginationInfo={paginationInfo}
            setPaginationInfo={setPaginationInfo}
            
            filterValue={filterValue}
            setFilterValue={setFilterValue}

            filters={filterConfig}
            filterState={filterState}
            setFilterState={setFilterState}
            
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            
            sortDescriptor={sortDescriptor}
            setSortDescriptor={setSortDescriptor}

            onAddNew={handleOpenCreateModal}
            onEditItem={handleOpenEditModal}
        />

        <InputModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title={editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
            fields={activeFormFields}
            initialData={editingUser || undefined} // Kirim data user yang sedang diedit
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
        />
    </div>
  )
}

export default ManageUser