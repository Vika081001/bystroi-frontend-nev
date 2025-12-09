export interface User {
  id: number;
  name: string;
  email?: string;
  contragent_phone: string;
  type: 'buyer' | 'seller';
  avatar?: string;
  company_name?: string;
  address?: string;
  registration_date?: string;
}