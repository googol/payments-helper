import React, { useState } from 'react'
import { IBAN, ReferenceNumber, fiIbanRegex, referenceNumberRegex } from './types'
import { preventingDefault } from './eventHelpers'
import { useDatabase } from './Database'

function regexToHtmlInputPattern(regex: RegExp): string {
  return regex.toString().slice(1, -1)
}

interface Props {
  onRecipientAdded: () => void
}

const NewRecipientForm: React.FC<Props> = ({ onRecipientAdded }) => {
  const [name, setName] = useState('')
  const [iban, setIban] = useState('')
  const [referenceNumber, setReferenceNumber] = useState('')

  const db = useDatabase()

  const handleSubmit = () => {
    console.log(db, iban, referenceNumber)
    if (!db) {
      return
    }
    if (!IBAN.guard(iban)) {
      console.log(iban)
      console.log('iban guard failed')
        return
    }
    if (!ReferenceNumber.guard(referenceNumber)) {
      console.log('refnum guard failed')
      return
    }
    db.add('recipients', { name, iban, referenceNumber })
    setName('')
    setIban('')
    setReferenceNumber('')
    onRecipientAdded()
  }

  return (
    <div>
      <h2>Uusi maksunsaaaja</h2>
      <form onSubmit={preventingDefault(handleSubmit)}>
        <label>Nimi: <input type="text" value={name} onChange={(e) => setName(e.target.value)} /></label>
        <label>IBAN: <input type="text" value={iban} onChange={(e) => setIban(e.target.value)} pattern={regexToHtmlInputPattern(fiIbanRegex)} /></label>
        <label>Viitenumero: <input type="text" value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} pattern={regexToHtmlInputPattern(referenceNumberRegex)} /></label>
        <button type="submit">Tallenna saaja</button>
      </form>
    </div>
  )
}

export default NewRecipientForm
