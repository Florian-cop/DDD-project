export interface CreateCustomerDTO {
  email: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
}

export interface UpdateCustomerDTO {
  email?: string;
  firstname?: string;
  lastname?: string;
  phoneNumber?: string;
}

export interface CustomerResponseDTO {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  fullname: string;
  phoneNumber: string;
}
