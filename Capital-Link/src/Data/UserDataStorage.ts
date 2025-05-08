export type StatusUserType = "underfind" | "docSub" | "docInCom" | "NewApp";
export interface DataUserType {
  name: string;
  lastname: string;
  phone: string;
  personalIdCard: string;
  contactIdCard: string;
  address: string;
  email: string;
  birthDate: string;
  companyRegisterNumber: string;
  userType: string;
  statusUser: StatusUserType;
}
export const DataUser: DataUserType = {
  name: "",
  lastname: "",
  phone: "",
  personalIdCard: "",
  contactIdCard: "",
  address: "",
  email: "",
  birthDate: "",
  companyRegisterNumber: "",
  userType: "",
  statusUser: "underfind",
};
