// export type StatusUserType =
//   | "underfind"
//   | "docSub"
//   | "docInCom"
//   | "NewApp"
//   | "NoApp";
export type StatusUserType = "underfind" | "NewApp";
export interface RegisterIndividualType {
  personalIdCard?: string;
  brithDate?: string;
  phone?: string;
}
export const RegisterIndividual: RegisterIndividualType = {
  personalIdCard: "",
  brithDate: "",
  phone: "",
};
export interface RegisterJuristicType {
  companyRegisterNumber?: string;
  contactIdCard?: string;
  phone?: string;
}
export const RegisterJuristic: RegisterJuristicType = {
  companyRegisterNumber: "",
  contactIdCard: "",
  phone: "",
};
export interface DataUserType {
  titlename: string;
  name: string;
  lastname: string;
  companyName: string;
  phone: string;
  personalIdCard: string;
  contactIdCard: string;
  idCardAddress: string;
  mailingAddress: string;
  email: string;
  birthDate: string;
  companyRegisterNumber: string;
  userType: string;
  statusUser: StatusUserType;
}
export const DataUser: DataUserType = {
  titlename: "",
  name: "",
  lastname: "",
  companyName: "",
  phone: "",
  personalIdCard: "",
  contactIdCard: "",
  idCardAddress: "",
  mailingAddress: "",
  email: "",
  birthDate: "",
  companyRegisterNumber: "",
  userType: "",
  statusUser: "underfind",
};
export const DataUsers: DataUserType[] = [
  {
    titlename: "นางสาว",
    name: "ณัฐฑริกา",
    lastname: "เกิดอิ่ม",
    companyName: "",
    phone: "0825931176",
    personalIdCard: "1569800000023",
    contactIdCard: "", // ไม่ใช้ในกรณีบุคคลธรรมดา
    idCardAddress: "กรุงเทพฯ",
    mailingAddress: "กรุงเทพฯ",
    email: "nattarikakoedim@gmail.com",
    birthDate: "26/05/2544",
    companyRegisterNumber: "", // ไม่ใช้ในกรณีบุคคลธรรมดา
    userType: "individual",
    statusUser: "NewApp",
  },
  {
    titlename: "นางสาว",
    name: "มะมะมะ",
    lastname: "หมูเด้ง",
    companyName: "",
    phone: "0911022724",
    personalIdCard: "1569800000023",
    contactIdCard: "", // ไม่ใช้ในกรณีบุคคลธรรมดา
    idCardAddress: "พะเยา",
    mailingAddress: "พะเยา",
    email: "nattarikakoedim@gmail.com",
    birthDate: "26/05/2544",
    companyRegisterNumber: "", // ไม่ใช้ในกรณีบุคคลธรรมดา
    userType: "individual",
    statusUser: "underfind",
  },
  {
    titlename: "",
    name: "",
    lastname: "",
    companyName: "บริษัท บอทแอนด์ไลฟ์ จำกัด",
    phone: "0987652022",
    personalIdCard: "", // ไม่ใช้ในกรณีนิติบุคคล
    contactIdCard: "1569800000023",
    idCardAddress: "กรุงเทพฯ",
    mailingAddress: "กรุงเทพฯ",
    email: "botandlife@a.co.th",
    birthDate: "", // ไม่ใช้ในกรณีนิติบุคคล
    companyRegisterNumber: "0105555000001",
    userType: "juristic",
    statusUser: "NewApp",
  },
  {
    titlename: "นางสาว",
    name: "พาณินี",
    lastname: "ไชยวรณ์",
    companyName: "",
    phone: "0980176332",
    personalIdCard: "1909802556459",
    contactIdCard: "", // ไม่ใช้ในกรณีบุคคลธรรมดา
    idCardAddress: "กรุงเทพฯ",
    mailingAddress: "กรุงเทพฯ",
    email: "mllalli@gmail.com",
    birthDate: "08/06/2544",
    companyRegisterNumber: "", // ไม่ใช้ในกรณีบุคคลธรรมดา
    userType: "individual",
    statusUser: "NewApp",
  },
  {
    titlename: "",
    name: "",
    lastname: "",
    companyName: "บริษัท BNL จำกัด",
    phone: "0888888888",
    personalIdCard: "", // ไม่ใช้ในกรณีนิติบุคคล
    contactIdCard: "1909802556459",
    idCardAddress: "กรุงเทพฯ",
    mailingAddress: "กรุงเทพฯ",
    email: "botnlife@a.co.th",
    birthDate: "", // ไม่ใช้ในกรณีนิติบุคคล
    companyRegisterNumber: "0105555000002",
    userType: "juristic",
    statusUser: "underfind",
  },
  // ... เพิ่ม mock อื่นได้ตามต้องการ
];
export const accountTypeMap: Record<string, string> = {
  loanAccount: "บัญชีสินเชื่อ",
  savingsAccount: "ใบรับฝากเงิน",
  currentAccount: "บัญชีกระแสรายวัน",
  creditAccount: "บัญชีบัตรเครดิต",
};
export interface DepositHistoryItem {
  id: string;
  date: string;
  amount: number;
}
export interface DepositInfo {
  id: string; // ใช้สำหรับการแสดงผลใน UI
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
    id: "1",
    accountType: "savingsAccount",
    balance: 1000000.0,
    accountNumber: "580-4-562571",
    accountHolder: "นางสาว ณัฐฑริกา เกิดอิ่ม",
    interestRate: 3.25,
    term: "1",
    maturityInterest: 32500,
    depositDate: "21/03/2024",
    maturityDate: "21/03/2025",
    history: [
      { id: "21/03/2024", date: "21/03/2024", amount: 500_000 },
      { id: "21/04/2024", date: "21/04/2024", amount: 500_000 },
    ],
  },
  {
    id: "2",
    accountType: "savingsAccount",
    balance: 250000.0,
    accountNumber: "123-4-789888",
    accountHolder: "นาย ก",
    interestRate: 5,
    term: "3",
    maturityInterest: 25000,
    depositDate: "15/01/2025",
    maturityDate: "15/01/2028",
    history: [{ id: "15/01/2025", date: "15/01/2025", amount: 250_000 }],
  },
  {
    id: "3",
    accountType: "savingsAccount",
    balance: 250000.0,
    accountNumber: "123-4-789888",
    accountHolder: "นาย ก",
    interestRate: 5,
    term: "3",
    maturityInterest: 25000,
    depositDate: "15/01/2025",
    maturityDate: "15/01/2028",
    history: [{ id: "15/01/2025", date: "15/01/2025", amount: 250_000 }],
  },
  {
    id: "4",
    accountType: "savingsAccount",
    balance: 250000.0,
    accountNumber: "123-4-789888",
    accountHolder: "นาย ก",
    interestRate: 5,
    term: "3",
    maturityInterest: 25000,
    depositDate: "15/01/2025",
    maturityDate: "15/01/2028",
    history: [{ id: "15/01/2025", date: "15/01/2025", amount: 250_000 }],
  },
  {
    id: "5",
    accountType: "savingsAccount",
    balance: 250000.0,
    accountNumber: "123-4-789888",
    accountHolder: "นาย ก",
    interestRate: 5,
    term: "3",
    maturityInterest: 25000,
    depositDate: "15/01/2025",
    maturityDate: "15/01/2028",
    history: [{ id: "15/01/2025", date: "15/01/2025", amount: 250_000 }],
  },
  {
    id: "6",
    accountType: "savingsAccount",
    balance: 250000.0,
    accountNumber: "123-4-789888",
    accountHolder: "นาย ก",
    interestRate: 5,
    term: "3",
    maturityInterest: 25000,
    depositDate: "15/01/2025",
    maturityDate: "15/01/2028",
    history: [{ id: "15/01/2025", date: "15/01/2025", amount: 250_000 }],
  },
  {
    id: "7",
    accountType: "savingsAccount",
    balance: 250000.0,
    accountNumber: "123-4-789888",
    accountHolder: "นาย ก",
    interestRate: 5,
    term: "3",
    maturityInterest: 25000,
    depositDate: "15/01/2025",
    maturityDate: "15/01/2028",
    history: [{ id: "15/01/2025", date: "15/01/2025", amount: 250_000 }],
  },
  {
    id: "8",
    accountType: "savingsAccount",
    balance: 250000.0,
    accountNumber: "123-4-789888",
    accountHolder: "นาย ก",
    interestRate: 5,
    term: "3",
    maturityInterest: 25000,
    depositDate: "15/01/2025",
    maturityDate: "15/01/2028",
    history: [{ id: "15/01/2025", date: "15/01/2025", amount: 250_000 }],
  },
  {
    id: "9",
    accountType: "savingsAccount",
    balance: 250000.0,
    accountNumber: "123-4-789888",
    accountHolder: "นาย ก",
    interestRate: 5,
    term: "3",
    maturityInterest: 25000,
    depositDate: "15/01/2025",
    maturityDate: "15/01/2028",
    history: [{ id: "15/01/2025", date: "15/01/2025", amount: 250_000 }],
  },
  {
    id: "10",
    accountType: "savingsAccount",
    balance: 250000.0,
    accountNumber: "123-4-789888",
    accountHolder: "นาย ก",
    interestRate: 5,
    term: "3",
    maturityInterest: 25000,
    depositDate: "15/01/2025",
    maturityDate: "15/01/2028",
    history: [{ id: "15/01/2025", date: "15/01/2025", amount: 250_000 }],
  },
  {
    id: "11",
    accountType: "savingsAccount",
    balance: 250000.0,
    accountNumber: "123-4-789888",
    accountHolder: "นาย ก",
    interestRate: 5,
    term: "3",
    maturityInterest: 25000,
    depositDate: "15/01/2025",
    maturityDate: "15/01/2028",
    history: [{ id: "15/01/2025", date: "15/01/2025", amount: 250_000 }],
  },
  {
    id: "12",
    accountType: "savingsAccount",
    balance: 250000.0,
    accountNumber: "123-4-789888",
    accountHolder: "นาย ก",
    interestRate: 5,
    term: "3",
    maturityInterest: 25000,
    depositDate: "15/01/2025",
    maturityDate: "15/01/2028",
    history: [{ id: "15/01/2025", date: "15/01/2025", amount: 250_000 }],
  },
  {
    id: "13",
    accountType: "savingsAccount",
    balance: 250000.0,
    accountNumber: "123-4-789888",
    accountHolder: "นาย ก",
    interestRate: 5,
    term: "3",
    maturityInterest: 25000,
    depositDate: "15/01/2025",
    maturityDate: "15/01/2028",
    history: [{ id: "15/01/2025", date: "15/01/2025", amount: 250_000 }],
  },
  {
    id: "14",
    accountType: "savingsAccount",
    balance: 250000.0,
    accountNumber: "123-4-789888",
    accountHolder: "นาย ก",
    interestRate: 5,
    term: "3",
    maturityInterest: 25000,
    depositDate: "15/01/2025",
    maturityDate: "15/01/2028",
    history: [{ id: "15/01/2025", date: "15/01/2025", amount: 250_000 }],
  },
  {
    id: "15",
    accountType: "savingsAccount",
    balance: 250000.0,
    accountNumber: "123-4-789888",
    accountHolder: "นาย ก",
    interestRate: 5,
    term: "3",
    maturityInterest: 25000,
    depositDate: "15/01/2025",
    maturityDate: "15/01/2028",
    history: [{ id: "15/01/2025", date: "15/01/2025", amount: 250_000 }],
  },
  {
    id: "16",
    accountType: "savingsAccount",
    balance: 250000.0,
    accountNumber: "123-4-789888",
    accountHolder: "นาย ก",
    interestRate: 5,
    term: "3",
    maturityInterest: 25000,
    depositDate: "15/01/2025",
    maturityDate: "15/01/2028",
    history: [{ id: "15/01/2025", date: "15/01/2025", amount: 250_000 }],
  },
  {
    id: "17",
    accountType: "savingsAccount",
    balance: 250000.0,
    accountNumber: "123-4-789888",
    accountHolder: "นาย ก",
    interestRate: 5,
    term: "3",
    maturityInterest: 25000,
    depositDate: "15/01/2025",
    maturityDate: "15/01/2028",
    history: [{ id: "15/01/2025", date: "15/01/2025", amount: 250_000 }],
  },
  {
    id: "18",
    accountType: "savingsAccount",
    balance: 250000.0,
    accountNumber: "123-4-789888",
    accountHolder: "นาย ก",
    interestRate: 5,
    term: "3",
    maturityInterest: 25000,
    depositDate: "15/01/2025",
    maturityDate: "15/01/2028",
    history: [{ id: "15/01/2025", date: "15/01/2025", amount: 250_000 }],
  },
  {
    id: "19",
    accountType: "savingsAccount",
    balance: 250000.0,
    accountNumber: "123-4-789888",
    accountHolder: "นาย ก",
    interestRate: 5,
    term: "3",
    maturityInterest: 25000,
    depositDate: "15/01/2025",
    maturityDate: "15/01/2028",
    history: [{ id: "15/01/2025", date: "15/01/2025", amount: 250_000 }],
  },
  {
    id: "20",
    accountType: "savingsAccount",
    balance: 250000.0,
    accountNumber: "123-4-789888",
    accountHolder: "นาย ก",
    interestRate: 5,
    term: "3",
    maturityInterest: 25000,
    depositDate: "15/01/2025",
    maturityDate: "15/01/2028",
    history: [{ id: "15/01/2025", date: "15/01/2025", amount: 250_000 }],
  },
  {
    id: "21",
    accountType: "savingsAccount",
    balance: 250000.0,
    accountNumber: "123-4-789888",
    accountHolder: "นาย ก",
    interestRate: 5,
    term: "3",
    maturityInterest: 25000,
    depositDate: "15/01/2025",
    maturityDate: "15/01/2028",
    history: [{ id: "15/01/2025", date: "15/01/2025", amount: 250_000 }],
  },
];
export const StatusLoanTypeMap: Record<string, string> = {
  Current: "ปกติ",
  Overdue: "ค้างชำระ",
};
export interface LoanHistoryItem {
  id: string;
  date: string; // วันที่ชำระ (format dd/MM/yyyy)
  amount: number;
  interest?: number; // จำนวนดอกเบี้ย (ถ้ามี)
  principalAmount?: number; // จำนวนเงินต้น (ถ้ามี)
  penaltyFee?: number; // ค่าปรับ (ถ้ามี)
}
export interface LoanInfo {
  id: string; // ใช้สำหรับการแสดงผลใน UI
  accountType: string; // ประเภทบัญชี
  balance: number; // ยอดสินเชื่อคงเหลือ (บาท)
  accountNumber: string; // เลขบัญชี (masked)
  accountHolder: string; // ชื่อผู้กู้
  interestRate: number; // อัตราดอกเบี้ย (%)
  LoanDate: string; // วันเริ่มสัญญา (dd/MM/yyyy)
  dueDate: string; // วันถึงกำหนดชำระ (dd/MM/yyyy)
  nextInstallment: number; // ค่างวดครั้งถัดไป (บาท)
  paymentStatus: string; // สถานะการชำระ
  penaltyFee: number; // ค่าปรับค้างชำระ (บาท)
  daysUntilDue: number; // จำนวนวันเหลือจนถึงกำหนด (วัน)
  history: LoanHistoryItem[];
}
export const mockLoanInfos: LoanInfo[] = [
  {
    id: "1",
    accountType: "loanAccount",
    balance: 1000000.0,
    accountNumber: "580-4-123571",
    accountHolder: "Mr. A",
    interestRate: 8.25,
    LoanDate: "30/04/2024",
    dueDate: "30/04/2025",
    nextInstallment: 15500,
    paymentStatus: "Current", // On-time payment
    penaltyFee: 0,
    daysUntilDue: 15,
    history: [
      {
        id: "28/02/2025",
        date: "28/02/2025",
        amount: 25000,
        interest: 6759,
        principalAmount: 18241,
        penaltyFee: 0,
      },
      {
        id: "31/01/2025",
        date: "31/01/2025",
        amount: 15500,
        interest: 6817,
        principalAmount: 8683,
        penaltyFee: 0,
      },
      {
        id: "31/12/2024",
        date: "31/12/2024",
        amount: 15500,
        interest: 6875,
        principalAmount: 8625,
        penaltyFee: 0,
      },
    ],
  },
  {
    id: "2",
    accountType: "loanAccount",
    balance: 1000000.0,
    accountNumber: "580-4-456571",
    accountHolder: "Mr. A",
    interestRate: 8.25,
    LoanDate: "30/04/2024",
    dueDate: "30/04/2025",
    nextInstallment: 15500,
    paymentStatus: "Overdue", // On-time payment
    penaltyFee: 1500,
    daysUntilDue: 15,
    history: [
      {
        id: "28/02/2025",
        date: "28/02/2025",
        amount: 15600,
        interest: 6817,
        principalAmount: 8683,
        penaltyFee: 100,
      },
      {
        id: "31/01/2025",
        date: "31/01/2025",
        amount: 15700,
        interest: 6817,
        principalAmount: 8683,
        penaltyFee: 200,
      },
      {
        id: "31/12/2024",
        date: "31/12/2024",
        amount: 16500,
        interest: 6875,
        principalAmount: 8625,
        penaltyFee: 1000,
      },
    ],
  },
];
