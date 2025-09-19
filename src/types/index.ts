interface SelectOption {
  label: string;
  value: string;
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

// Gabungkan semua tipe field menjadi satu
export type FormFieldConfig = TextField | SelectField;
