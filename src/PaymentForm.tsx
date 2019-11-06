import React, { useState, useEffect, useCallback } from 'react'
import { useDatabase, Database } from './Database'
import { preventingDefault } from './eventHelpers'
import { IBAN, ReferenceNumber } from './types'

export const paymentAmountRegex = /^(\d{1,6})([,\.](\d{0,2}))?$/

function getAmountValues(input: string): { euros: string, cents: string } | undefined {
  const result = input.match(paymentAmountRegex)
  if (!result) {
    return undefined
  }
  const [, euros, , cents = ''] = result
  return {
    euros,
    cents,
  }
}
function formatDate(date: Date): string {
  return [
    date.getFullYear().toString().slice(2),
    (date.getMonth() + 1).toString(),
    date.getDate().toString(),
  ].map(part => part.padStart(2, '0'))
  .join('')
}

type PaymentFormProps = Readonly<{
  currentAmount: string
}>

const PaymentForm: React.FC<PaymentFormProps> = ({ currentAmount }) => {
  const [recipients, setRecipients] = useState<Database['recipients']['value'][]>([])
  const db = useDatabase()

  function formatBarcode(iban: IBAN, referenceNumber: ReferenceNumber, amount: string): string | undefined{
    const amounts = getAmountValues(amount)

    if (!amounts) {
      return undefined
    }

    const { euros, cents } = amounts

    return [
      '4',
      iban.slice(2),
      euros.padStart(6, '0'),
      cents.padStart(2, '0'),
      '000',
      referenceNumber.padStart(20, '0'),
      formatDate(new Date()),
    ].join('')
  }

  const writeBarcode = (recipient: Database['recipients']['value']) => {
    const barcode = formatBarcode(recipient.iban, recipient.referenceNumber, currentAmount)
    if (barcode) {
      navigator.clipboard.writeText(barcode)
    }
  }

  const refreshRecipients = useCallback(async () => {
    if (!db) {
      return
    }
    setRecipients(await db.getAll('recipients'))
  }, [db])

  useEffect(() => {
    refreshRecipients()
  }, [refreshRecipients, db])

  return (
    <>
      { recipients.map((recipient) => (
        <button key={recipient.id} type="button" onClick={preventingDefault(() => {writeBarcode(recipient)})}>
          <h2>{recipient.name}</h2>
          <p>{recipient.iban}</p>
        </button>
      )) }
    </>
  )
}

export default PaymentForm
