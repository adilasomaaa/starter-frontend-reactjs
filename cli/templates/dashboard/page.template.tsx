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
  __Name__,
  __Name__CreatePayload,
  __Name__UpdatePayload
} from "../../models";
import { __name__Service } from "../../services/__Name__Service";
import type { DisplayFieldConfig, FormFieldConfig } from "../../types";
import InputModal from "../../components/Dashboard/InputModal";
import { env } from "../../lib/env";
import ShowModal from "../../components/Dashboard/ShowModal";
import DeleteModal from "../../components/Dashboard/DeleteModal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const getFormFields = (mode: "create" | "update"): FormFieldConfig[] => {
  const allFields = {
    status: {
      key: "status",
      label: "Status",
      type: "select",
      placeholder: "Pilih status...",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Banned", value: "banned" },
      ],
    },
  } as const;

  return [allFields.status];
};

const __name__Columns: Column<__Name__>[] = [
  {
    name: "NAME",
    uid: "name",
    sortable: true,
    defaultVisible: true,
    renderCell: (item: __Name__) => (
      <div className="flex items-center gap-4">
        <Avatar src={env.baseUrl + item.photo} />
        <span>{item.name}</span>
      </div>
    ),
  },
  { name: "Username", uid: "username", sortable: true, defaultVisible: true },
  { name: "Email", uid: "user.email", sortable: true, defaultVisible: false },
  { name: "Status", uid: "status", sortable: true, defaultVisible: true },
  { name: "ACTIONS", uid: "actions", defaultVisible: true },
];

const Manage__Name__ = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<__Name__ | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<__Name__ | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState<__Name__[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paginationInfo, setPaginationInfo] = useState({
    page: 1,
    limit: 10,
    totalData: 0,
    totalPages: 1,
  });
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<__Name__ | null>(null);

  const handleOpenDeleteModal = (item: __Name__) => {
    setDeletingItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingItem(null);
  };

  const handleOpenEditModal = (item: __Name__) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    reset();
    setEditingItem(null);
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
  } = useForm<__Name__Schema>({
    resolver: zodResolver(__name__Schema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (editingItem) {
      reset({...editingItem});
    } else {
      reset({
        email: "",
        username: "",
        roles: [],
      });
    }
  }, [editingItem, reset]);

  const displayFields: DisplayFieldConfig<__Name__>[] = [
    { key: "name", label: "Nama Lengkap" },
    { key: "username", label: "Username" },
    { key: "user.email", label: "Email" },
    {
      key: "status",
      label: "Status",
      render: (item: __Name__) => {
        const status = item.status;
        const statusColorMap: Record<string, "success" | "warning" | "danger"> =
          {
            active: "success",
            pending: "warning",
            inactive: "danger",
            banned: "danger",
          };
        return (
          <Chip
            color={statusColorMap[status] || "default"}
            size="sm"
            variant="flat"
          >
            {status}
          </Chip>
        );
      },
    },
    {
      key: "createdAt",
      label: "Tanggal Bergabung",
      render: (item: __Name__) =>
        new Date(item.createdAt).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
    },
  ];

  const handleOpenViewModal = (item: __Name__) => {
    setViewingItem(item);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingItem(null);
  };

  const formMode = editingItem ? "update" : "create";
  const activeFormFields = getFormFields(formMode);

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
      const response = await __name__Service.index({
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
        await __name__Service.update(
          Number(editingItem.id),
          formData as __Name__UpdatePayload
        );
      } else {
        await __name__Service.create(formData as __Name__UpdatePayload);
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
      await __name__Service.delete(deletingItem.id);
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
      <h1 className="text-2xl font-semibold my-4">Manage __NAME_TITLE__</h1>
      <DataTable
        data={items}
        isLoading={isLoading}
        columns={__name__Columns}
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
          editingItem ? "Edit __NAME_TITLE__" : "Tambah __NAME_TITLE__ Baru"
        }
        fields={activeFormFields}
        register={register}
        onSubmit={handleSubmit(onSubmit)}
        errors={errors}
        setValue={setValue}
        watch={watch}
        isLoading={isSubmitting}
      />
      <ShowModal<__Name__>
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        title="Detail __NAME_TITLE__"
        data={viewingItem}
        fields={displayFields}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Hapus __NAME_TITLE__"
        message={`Apakah Anda yakin ingin menghapus "${deletingItem?.name}"? Aksi ini tidak dapat dibatalkan.`}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Manage__Name__;
