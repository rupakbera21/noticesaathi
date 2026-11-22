import { NoticeType } from '@/schemas/notice'

const NOTICE_TYPE_LABELS: Record<string, { en: string; hi?: string; bn?: string }> = {
  ASMT_10_SCRUTINY: {
    en: 'Scrutiny of Returns (ASMT-10)',
    hi: 'रिटर्न की जांच में विसंगति की सूचना (ASMT-10)',
    bn: 'রিটার্ন স্ক্রুটিনি সংক্রান্ত অসঙ্গতির নোটিশ (ASMT-10)',
  },
  DRC_01_DEMAND_FRAUD: {
    en: 'Demand Show Cause Notice (Section 74 - Fraud / Wilful Misstatement)',
    hi: 'मांग और कारण बताओ नोटिस - धारा 74 (धोखाधड़ी/गलत बयानी)',
    bn: 'ডিমান্ড ও কারণ দর্শানোর নোটিশ - ধারা ৭৪',
  },
  DRC_01_DEMAND_NON_FRAUD: {
    en: 'Demand Show Cause Notice (Section 73)',
    hi: 'मांग और कारण बताओ नोटिस (धारा 73)',
    bn: 'ডিমান্ড ও কারণ দর্শানোর নোটিশ (ধারা ৭৩)',
  },
  GSTR_3A_NON_FILER: {
    en: 'Notice to Return Defaulter (GSTR-3A)',
    hi: 'रिटर्न न भरने पर नोटिस (GSTR-3A)',
    bn: 'রিটার্ন দাখিল না করার নোটিশ (GSTR-3A)',
  },
  REG_17_REGISTRATION_CANCEL: {
    en: 'Show Cause Notice for Registration Cancellation (REG-17)',
    hi: 'पंजीकरण रद्दीकरण का कारण बताओ नोटिस (REG-17)',
    bn: 'নিবন্ধন বাতিলের কারণ দর্শানোর নোটিশ (REG-17)',
  },
  RFD_08_REFUND_SCN: {
    en: 'Show Cause Notice for Rejection of Refund Claim (RFD-08)',
    hi: 'रिफंड अस्वीकृति का कारण बताओ नोटिस (RFD-08)',
    bn: 'রিফান্ড বাতিলের কারণ দর্শানোর নোটিশ (RFD-08)',
  },
}

export function getNoticeTypeDesc(type: NoticeType, lang: string = 'en'): string {
  const label = NOTICE_TYPE_LABELS[type]
  if (!label) return 'Official GST Notice'
  if (lang === 'hi' && label.hi) return label.hi
  if (lang === 'bn' && label.bn) return label.bn
  return label.en
}

export function getSuggestedDocuments(type: NoticeType): string[] {
  if (type === 'ASMT_10_SCRUTINY') {
    return ['GSTR-2B ITC reconciliation sheet', 'Original supplier tax invoices', 'Bank payment proof of tax paid']
  }
  if (type === 'GSTR_3A_NON_FILER') {
    return ['Filed GSTR-3B return copy and ARN receipt', 'Challan payment receipt for tax liability']
  }
  return ['Copies of filed GST returns', 'Purchase and sales registers for the period']
}
