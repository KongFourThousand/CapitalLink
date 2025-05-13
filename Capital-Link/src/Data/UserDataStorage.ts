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
export const accountTypeMap: Record<string, string> = {
  loanAccount: "บัญชีสินเชื่อ",
  savingsAccount: "บัญชีสะสมทรัพย์",
  currentAccount: "บัญชีกระแสรายวัน",
  creditAccount: "บัญชีบัตรเครดิต",
};
export interface DepositHistoryItem {
  id: string;
  amount: number;
}
export interface DepositInfo {
  accountType: string;
  balance: number;
  accountNumber: string;
  accountHolder: string;
  interestRate: number; // % เช่น 3.25
  term: string; // เช่น '1 ปี'
  maturityInterest: number; // จำนวนดอกเบี้ยที่จะได้รับ
  depositDate: string; // วันที่ฝาก (format dd/MM/yyyy)
  maturityDate: string; // วันครบสัญญา
  history: DepositHistoryItem[];
}
export const mockDepositInfos: DepositInfo[] = [
  {
    accountType: "savingsAccount",
    balance: 1000000.0,
    accountNumber: "580-4-562571",
    accountHolder: "นาย ก",
    interestRate: 3.25,
    term: "1",
    maturityInterest: 32500,
    depositDate: "21/03/2024",
    maturityDate: "21/03/2025",
    history: [
      { id: "21/03/2024", amount: 500_000 },
      { id: "21/04/2024", amount: 500_000 },
    ],
  },
  {
    accountType: "savingsAccount",
    balance: 250000.0,
    accountNumber: "123-4-789888",
    accountHolder: "นาย ก",
    interestRate: 5,
    term: "3",
    maturityInterest: 25000,
    depositDate: "15/01/2025",
    maturityDate: "15/01/2028",
    history: [{ id: "15/01/2025", amount: 250_000 }],
  },
];
export const StatusLoanTypeMap: Record<string, string> = {
  Current: "ปกติ",
  Overdue: "ค้างชำระ",
};
export interface LoanHistoryItem {
  id: string;
  amount: number;
}
export interface LoanInfo {
  accountType: string; // ประเภทบัญชี
  balance: number; // ยอดสินเชื่อคงเหลือ (บาท)
  accountNumber: string; // เลขบัญชี (masked)
  accountHolder: string; // ชื่อผู้กู้
  interestRate: number; // อัตราดอกเบี้ย (%)
  depositDate: string; // วันเริ่มสัญญา (dd/MM/yyyy)
  dueDate: string; // วันถึงกำหนดชำระ (dd/MM/yyyy)
  nextInstallment: number; // ค่างวดครั้งถัดไป (บาท)
  paymentStatus: string; // สถานะการชำระ
  penaltyFee: number; // ค่าปรับค้างชำระ (บาท)
  daysUntilDue: number; // จำนวนวันเหลือจนถึงกำหนด (วัน)
  history: LoanHistoryItem[];
}
export const mockLoanInfos: LoanInfo[] = [
  {
    accountType: "loanAccount",
    balance: 1000000.0,
    accountNumber: "580-4-123571",
    accountHolder: "Mr. A",
    interestRate: 8.25,
    depositDate: "30/04/2024",
    dueDate: "30/04/2025",
    nextInstallment: 15500,
    paymentStatus: "Current", // On-time payment
    penaltyFee: 0,
    daysUntilDue: 15,
    history: [
      { id: "28/02/2025", amount: 25000 },
      { id: "31/01/2025", amount: 15500 },
      { id: "31/12/2024", amount: 15500 },
    ],
  },
  {
    accountType: "loanAccount",
    balance: 1000000.0,
    accountNumber: "580-4-123571",
    accountHolder: "Mr. A",
    interestRate: 8.25,
    depositDate: "30/04/2024",
    dueDate: "30/04/2025",
    nextInstallment: 15500,
    paymentStatus: "Overdue", // On-time payment
    penaltyFee: 1500,
    daysUntilDue: 15,
    history: [
      { id: "28/02/2025", amount: 15500 },
      { id: "31/01/2025", amount: 15500 },
      { id: "31/12/2024", amount: 15500 },
    ],
  },
];
