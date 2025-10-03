export interface AccountSetupResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string | null;
  phone_number: string;
}