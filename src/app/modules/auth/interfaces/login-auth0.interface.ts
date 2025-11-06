export interface UserDB {
    id: string; // Es un UUID
    email: string;
    password: string | null;
    first_name: string | null;
    last_name: string | null;
    gender: string | null;
    photo: string | null;
    phone_number: string | null;
    timezone: string | null;
    is_active: boolean;
    is_staff: boolean;
    is_superuser: boolean;
    created_at: string; // Fechas como string ISO
    updated_at: string;
    last_login: string | null;
    birthdate: string | null;
    emailConfirmationToken: string | null;
    emailConfirmationExpires: string | null;
    emailConfirmed: boolean;
    resetPasswordToken: string | null;
    resetPasswordExpires: string | null;
    hardSkills: any[]; // Array vacío
    roles: any[];     // Array vacío
}

export interface UserAuthResponse {
    user: UserDB; // <-- Contiene el objeto de usuario completo
    register_complete: boolean; // <-- El flag que acompaña la respuesta
}
