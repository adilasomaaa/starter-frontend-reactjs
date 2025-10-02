import React, { useCallback, useEffect, useState } from 'react'
import DashboardBreadcrumbs from '../../../components/Dashboard/Breadcrumbs'
import { type SortDescriptor, type Selection, Avatar, Chip } from '@heroui/react'
import DataTable, { type Column, type FilterConfig } from '../../../components/Dashboard/DataTable'
import type { RegisterPayload, Client, ClientUpdateStatusPayload } from '../../../models'
import { clientService } from '../../../services/ClientService'
import type { DisplayFieldConfig, FormFieldConfig } from '../../../types'
import InputModal from '../../../components/Dashboard/InputModal'
import { env } from "../../../lib/env";
import ShowModal from '../../../components/Dashboard/ShowModal'
import DeleteModal from '../../../components/Dashboard/DeleteModal'
import { useForm } from 'react-hook-form'
import { clientSchema, type ClientSchema } from '../../../schemas/ClientSchema'
import { zodResolver } from '@hookform/resolvers/zod'


const getFormFields = (mode: 'create' | 'update'): FormFieldConfig[] => {
    const allFields = {
        status: { 
            key: 'status', 
            label: 'Status', 
            type: 'select', 
            placeholder: 'Pilih status...', 
            options: [
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
                { label: 'Banned', value: 'banned' },
            ]  
        },
    } as const;
    

    return [
        allFields.status
    ];
};

const clientColumns: Column<Client>[] = [
    { 
        name: "NAME", 
        uid: "name", 
        sortable: true, 
        defaultVisible: true,
        renderCell: (client:Client) => (
            <div className='flex items-center gap-4'>
                <Avatar src={env.baseUrl + client.photo} />
                <span>{client.name}</span>
            </div>
        ),
    },
    { name: "Username", uid: "username", sortable: true, defaultVisible: true  },
    { name: "Email", uid: "user.email", sortable: true, defaultVisible: false  },
    { name: "Status", uid: "status", sortable: true, defaultVisible: true  },
    { name: "ACTIONS", uid: "actions", defaultVisible: true },
];

const ManageClient = () => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingClient, setDeletingClient] = useState<Client | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [users, setClient] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [paginationInfo, setPaginationInfo] = useState({
        page: 1,
        limit: 10,
        totalData: 5,
        totalPages: 1,
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
        watch,
      } = useForm<ClientSchema>({
        resolver: zodResolver(clientSchema),
        mode: 'onChange',
      });

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewingClient, setViewingClient] = useState<Client | null>(null);

    const handleOpenDeleteModal = (client: Client) => {
        setDeletingClient(client);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingClient(null);
    };

    const handleOpenEditModal = (client: Client) => {
        setEditingClient(client);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingClient(null);
        reset();
    };

    const userDisplayFields: DisplayFieldConfig<Client>[] = [
        { key: 'name', label: 'Nama Lengkap' },
        { key: 'username', label: 'Username' },
        { key: 'user.email', label: 'Email' },
        {
            key: 'status',
            label: 'Status',
            render: (user) => { // Contoh render kustom untuk status
                const status = user.status;
                const statusColorMap: Record<string, 'success' | 'warning' | 'danger' | 'default' | 'primary' | 'secondary' | undefined> = {
                    active: 'success',
                    pending: 'warning',
                    inactive: 'danger',
                };
                return (
                <Chip color={statusColorMap[status] || 'default'} size="sm" variant="flat">
                    {status}
                </Chip>
                );
            },
        },
        {
            key: 'createdAt',
            label: 'Tanggal Bergabung',
            render: (user) => new Date(user.user.createdAt).toLocaleDateString('id-ID', {
                year: 'numeric', month: 'long', day: 'numeric',
            }), // Contoh render kustom untuk format tanggal
        },
    ];

    const handleOpenViewModal = (client: Client) => {
        setViewingClient(client);
        setIsViewModalOpen(true);
    };
    
    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        setViewingClient(null);
    };

    const formMode = editingClient ? 'update' : 'create';
    
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
                { name: 'Inactive', uid: 'inactive' },
                { name: 'Banned', uid: 'banned' },
            ],
        },
    ];

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const statusValue = filterState.status instanceof Set && filterState.status.size > 0 
                ? Array.from(filterState.status).join(',')
                : undefined;

            const response = await clientService.index({
                page: paginationInfo.page,
                limit: paginationInfo.limit,
                search: filterValue || undefined,
                status: statusValue || undefined,
            });

            setClient(response.data);
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

    useEffect(() => {
        if (editingClient) {
            reset({
                status: editingClient.status || 'active',
            });
        }
    }, [editingClient, reset]);

    const onSubmit = async (formData: Record<string, any>) => {
        setIsSubmitting(true);
        try {
            if (editingClient) {
                await clientService.updateStatus(Number(editingClient.id), formData as ClientUpdateStatusPayload);
            } else {
                await clientService.create(formData as RegisterPayload);
            }
            handleCloseModal();
            await fetchUsers();
        } catch (error) {
            console.error("Gagal menyimpan data:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deletingClient) return;

        setIsSubmitting(true);
        try {
            await clientService.delete(deletingClient.id);
            handleCloseDeleteModal();
            await fetchUsers(); // Refresh data tabel
        } catch (error) {
            console.error("Gagal menghapus pengguna:", error);
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
            columns={clientColumns}
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

            onEditItem={handleOpenEditModal}
            onViewItem={handleOpenViewModal}
            onDeleteItem={handleOpenDeleteModal}
        />

        <InputModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title={editingClient ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
            fields={activeFormFields}
            register={register}
            onSubmit={handleSubmit(onSubmit)}
            errors={errors}
            setValue={setValue} // 👈 Teruskan ke modal
            watch={watch}
            isLoading={isSubmitting}
        />

        <ShowModal<Client>
            isOpen={isViewModalOpen}
            onClose={handleCloseViewModal}
            title="Detail Pengguna"
            data={viewingClient}
            fields={userDisplayFields}
        />

        <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
            title="Hapus Pengguna"
            message={`Apakah Anda yakin ingin menghapus pengguna "${deletingClient?.name}"? Aksi ini tidak dapat dibatalkan.`}
            isLoading={isSubmitting}
        />
    </div>
  )
}

export default ManageClient