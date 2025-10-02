import React, { useCallback, useEffect, useState } from "react";
import DashboardBreadcrumbs from "../../components/Dashboard/Breadcrumbs";
import {
  type SortDescriptor,
  type Selection,
  Avatar,
  Chip,
} from "@heroui/react";
import DataTable, {
  type Column,
  type FilterConfig,
} from "../../components/Dashboard/DataTable";
import type {
  Role,
  RoleCreatePayload,
  RoleUpdatePayload
} from "../../models";
import { roleService } from "../../services/RoleService";
import type { DisplayFieldConfig, FormFieldConfig } from "../../types";
import InputModal from "../../components/Dashboard/InputModal";
import { env } from "../../lib/env";
import ShowModal from "../../components/Dashboard/ShowModal";
import DeleteModal from "../../components/Dashboard/DeleteModal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { roleSchema, type RoleSchema } from "../../schemas/RoleSchema";
import { permissionsService } from "../../services/PermissionsService";
import type { Permissions } from "../../models/permissions";

const getFormFields = (mode: "create" | "update", availablePermissions: Permissions[]): FormFieldConfig[] => {
  const allFields = {
    name: { key: "name", label: "Nama Role", type: "text", placeholder: "Masukkan nama role..." },
    permissions: {
      key: "permissions",
      label: "Permissions",
      type: "multi-select",
      placeholder: "Pilih permissions...",
      options: availablePermissions.map(perm => ({
        label: perm.name,
        value: perm.id, // Gunakan id sebagai value
      })),
    },
  } as const;

  return [
    allFields.name,
    allFields.permissions
  ];
};

const roleColumns: Column<Role>[] = [
  {
    name: "NAME",
    uid: "name",
    sortable: true,
    defaultVisible: true
  },
  { name: "Permissions", 
    uid: "permissions", 
    sortable: true, 
    defaultVisible: true, 
    renderCell: (item) => 
      <div className="flex flex-wrap gap-2">
          {item.permissions.map((perm, index) => (
            <Chip key={index} variant="flat">
              {perm}
            </Chip>
          ))}
        </div> 
  },
  { name: "ACTIONS", uid: "actions", defaultVisible: true },
];

const ManageRole = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<Role | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Role | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paginationInfo, setPaginationInfo] = useState({
    page: 1,
    limit: 10,
    totalData: 0,
    totalPages: 1,
  });
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<Role | null>(null);

  const [permissions, setPermissions] = useState<Permissions[]>([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const perms = await permissionsService.index();
        setPermissions(perms.data);
      } catch (error) {
        console.error("Gagal mengambil permissions:", error);
      }
    }

    fetchPermissions();
  }, []);

  const handleOpenDeleteModal = (item: Role) => {
    setDeletingItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingItem(null);
  };

  const handleOpenCreateModal = () => {
    reset();
    setEditingItem(null);
    setIsModalOpen(true);
  };
  const handleOpenEditModal = (item: Role) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RoleSchema>({
    resolver: zodResolver(roleSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (editingItem) {
      const roleIds = editingItem.permissions
      .map(permission => 
        permissions.find(role => role.name === permission)?.id
      )
      .filter(id => id !== undefined) as number[];

      reset({...editingItem, permissions: roleIds });
    } else {
      reset({
        name: "",
        permissions: [],
      });
    }
  }, [editingItem, reset]);

  const displayFields: DisplayFieldConfig<Role>[] = [
    { key: "name", label: "Nama Lengkap" },
    
    {
      key: "permissions",
      label: "Permissions",
      render: (item: Role) => (
        <div className="flex flex-wrap gap-2">
          {item.permissions.map((perm, index) => (
            <Chip key={index} variant="flat">
              {perm}
            </Chip>
          ))}
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Tanggal Bergabung",
      render: (item: Role) =>
        new Date(item.createdAt ?? "").toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
    },
  ];

  const handleOpenViewModal = (item: Role) => {
    setViewingItem(item);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingItem(null);
  };

  const formMode = editingItem ? "update" : "create";
  const activeFormFields = getFormFields(formMode, permissions);

  const [filterValue, setFilterValue] = useState("");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  const [filterState, setFilterState] = useState<
    Record<string, Selection | string>
  >({});

  const filterConfig: FilterConfig[] = [
    {
      key: "status",
      label: "Status",
      type: "dropdown",
      selectionMode: "multiple",
      options: [
        { name: "Active", uid: "active" },
        { name: "Pending", uid: "pending" },
        { name: "Banned", uid: "banned" },
      ],
    },
  ];

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const statusValue =
        filterState.status instanceof Set && filterState.status.size > 0
          ? Array.from(filterState.status).join(",")
          : undefined;
      const response = await roleService.index({
        page: paginationInfo.page,
        limit: paginationInfo.limit,
        search: filterValue || undefined,
        status: statusValue || undefined,
      });
      setItems(response.data);
      setPaginationInfo(response.meta);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [paginationInfo.page, paginationInfo.limit, filterValue, filterState]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems();
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [fetchItems]);

  const onSubmit = async (formData: Record<string, any>) => {
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await roleService.update(
          Number(editingItem.id),
          formData as RoleUpdatePayload
        );
      } else {
        await roleService.create(formData as RoleCreatePayload);
      }
      handleCloseModal();
      await fetchItems();
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    setIsSubmitting(true);
    try {
      await roleService.delete(deletingItem.id);
      handleCloseDeleteModal();
      await fetchItems();
    } catch (error) {
      console.error("Gagal menghapus:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <DashboardBreadcrumbs />
      <h1 className="text-2xl font-semibold my-4">Manage Role</h1>
      <DataTable
        data={items}
        isLoading={isLoading}
        columns={roleColumns}
        paginationInfo={paginationInfo}
        setPaginationInfo={setPaginationInfo}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        filters={filterConfig}
        filterState={filterState}
        setFilterState={setFilterState}
        sortDescriptor={sortDescriptor}
        setSortDescriptor={setSortDescriptor}
        onAddNew={handleOpenCreateModal}
        onEditItem={handleOpenEditModal}
        onViewItem={handleOpenViewModal}
        onDeleteItem={handleOpenDeleteModal}
      />
      <InputModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          editingItem ? "Edit Role" : "Tambah Role Baru"
        }
        fields={activeFormFields}
        register={register}
        onSubmit={handleSubmit(onSubmit)}
        errors={errors}
        setValue={setValue}
        watch={watch}
        isLoading={isSubmitting}
      />
      <ShowModal<Role>
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        title="Detail Role"
        data={viewingItem}
        fields={displayFields}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Hapus Role"
        message={`Apakah Anda yakin ingin menghapus "${deletingItem?.name}"? Aksi ini tidak dapat dibatalkan.`}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default ManageRole;
