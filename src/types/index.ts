interface SelectOption {
  label: string;
  value: string | number;
}

// Tipe dasar untuk semua field
interface BaseField {
  key: string; // Harus cocok dengan properti di DTO backend
  label: string;
  placeholder?: string;
  defaultValue?: any;
}

// Tipe spesifik untuk berbagai jenis input
interface TextField extends BaseField {
  type: "text" | "email" | "password";
}

interface SelectField extends BaseField {
  type: "select";
  readonly options: readonly SelectOption[];
}

interface MultiSelectField extends BaseField {
  type: "multi-select";

  readonly options: readonly SelectOption[];
}

// Gabungkan semua tipe field menjadi satu
export type FormFieldConfig = TextField | SelectField | MultiSelectField;

export type DisplayFieldConfig<T> = {
  key: string; // Path ke data, mendukung notasi titik (e.g., 'profile.name')
  label: string; // Label yang akan ditampilkan (e.g., 'Nama Lengkap')
  render?: (item: T) => React.ReactNode; // Fungsi render kustom (opsional)
};
