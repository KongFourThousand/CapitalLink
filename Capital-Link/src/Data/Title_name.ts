export type TitleItem = {
  code: string;
  name: string;
  flag: "E" | "T";
};

export const titles: TitleItem[] = [
  { code: "001", name: "MISS", flag: "E" },
  { code: "002", name: "MR.", flag: "E" },
  { code: "003", name: "Mrs.", flag: "E" },
  { code: "004", name: "เด็กชาย", flag: "T" },
  { code: "005", name: "เด็กหญิง", flag: "T" },
  { code: "006", name: "คณะบุคคล", flag: "T" },
  { code: "007", name: "ท.ญ.", flag: "T" },
  { code: "008", name: "นาง", flag: "T" },
  { code: "009", name: "นางสาว", flag: "T" },
  { code: "010", name: "นาย", flag: "T" },
  { code: "011", name: "นิติบุคคลอาคารชุด", flag: "T" },
  { code: "013", name: "บจก.", flag: "T" },
  { code: "014", name: "บมจ.", flag: "T" },
  { code: "015", name: "บล.", flag: "T" },
  { code: "016", name: "พ.ต.อ.", flag: "T" },
  { code: "017", name: "มูลนิธิ", flag: "T" },
  { code: "018", name: "ว่าที่ร้อยตรี", flag: "T" },
  { code: "019", name: "สมาคม", flag: "T" },
  { code: "020", name: "สหกรณ์ออมทรัพย์", flag: "T" },
  { code: "021", name: "หม่อมหลวง", flag: "T" },
  { code: "022", name: "ห้างหุ้นส่วนสามัญ", flag: "T" },
  { code: "023", name: "ห้างหุ้นส่วนจำกัด", flag: "T" },
  { code: "024", name: "น.ส.", flag: "T" },
  { code: "025", name: "พล.ต.ท.", flag: "T" },
  { code: "026", name: "ว่าที่ ร้อยตรีหญิง", flag: "T" },
  { code: "027", name: "น.อ.", flag: "T" },
  { code: "028", name: "โรงเรียน", flag: "T" },
  { code: "029", name: "พระมหา", flag: "T" },
  { code: "030", name: "ร.ต.", flag: "T" },
  { code: "031", name: "สหกรณ์เครดิตยูเนี่ยน", flag: "T" },
  { code: "099", name: "กองมรดก", flag: "T" },
  { code: "000", name: "-", flag: "T" },
];
