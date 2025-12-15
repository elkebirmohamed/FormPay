export interface FormData {
  machineId: string;
  email: string;
}

export interface FormErrors {
  machineId?: string;
  email?: string;
}

export enum StorageKeys {
  MACHINE_ID = 'pos_ai_machine_id',
  EMAIL = 'pos_ai_email'
}