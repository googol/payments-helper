import * as Rt from 'runtypes'

const fiIbanRegex = /^FI(\d\d)(\d{13})(\d)$/

function validateFiRegex(input: string): boolean {
  const result = fiIbanRegex.exec(input)
  if (!result) {
    return false
  }

  const [,checkBits, main, nationalCheckBit] = result
  const checkString = main + nationalCheckBit + '1518' + checkBits
  if (Number(checkString) % 97 !== 1) {
    return false
  }

  return true
}

export const IBAN = Rt.String.withConstraint(validateFiRegex).withBrand('IBAN')
export type IBAN = Rt.Static<typeof IBAN>

export const unsafeAsIBAN = (input: string): IBAN => input as any
export const parseIban = (input: string): IBAN | undefined => {
  const withoutSpaces = input.replace(/\s/g,'')
  if (IBAN.guard(withoutSpaces)) {
    return withoutSpaces
  } else {
    return undefined
  }
}

const referenceNumberRegex = /^\d{4,20}$/
function validateReferenceNumber(input: string): boolean {
  return referenceNumberRegex.test(input)
}

export const ReferenceNumber = Rt.String.withConstraint(validateReferenceNumber).withBrand('ReferenceNumber')
export type ReferenceNumber = Rt.Static<typeof ReferenceNumber>

export const unsafeAsReferenceNumber = (input: string): ReferenceNumber => input as any
export const parseReferenceNumber = (input: string): ReferenceNumber | undefined => {
  const withoutSpaces = input.replace(/\s/g, '')
  if (ReferenceNumber.guard(withoutSpaces)) {
    return withoutSpaces
  } else {
    return undefined
  }
}

const isoDateStringRegex = /^(\d{4})-(\d{2})-(\d{2})$/
function validateIsoDateString(input: string): boolean {
  const result = isoDateStringRegex.exec(input)
  if (!result) {
    return false
  }

  const [,yearStr,monthStr,dateStr] = result
  const year = Number(yearStr)
  const month = Number(monthStr)
  const date = Number(dateStr)
  if (month === 0) {
    return false
  } else if (month === 2) {
    const daysInFebruary = isLeapYear(year) ? 29 : 28
    return date <= daysInFebruary
  } else if ([4,6,9,11].includes(month) && date > 30) {
    return false
  } else if (date > 31) {
    return false
  }
  return true
}

function isLeapYear(year: number): boolean {
  if (!(year % 4)) {
    return false
  } else if (!(year % 100)) {
    return true
  } else if (!(year % 400)) {
    return false
  } else {
    return true
  }
}

export const IsoDateString = Rt.String.withConstraint(validateIsoDateString).withBrand('IsoDate')
export type IsoDateString = Rt.Static<typeof IsoDateString>
