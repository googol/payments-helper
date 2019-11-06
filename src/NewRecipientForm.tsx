import React, { useState } from 'react'
import { IBAN, ReferenceNumber, parseIban, parseReferenceNumber } from './types'
import { preventingDefault } from './eventHelpers'
import { useDatabase } from './Database'

type Props = Readonly<{
  onRecipientAdded: () => void
}>

const NewRecipientForm: React.FC<Props> = ({ onRecipientAdded }) => {
  const [name, setName] = useState('')
  const [iban, setIban] = useState('FI')
  const [referenceNumber, setReferenceNumber] = useState('')

  const db = useDatabase()

  const handleSubmit = () => {
    if (!db) {
      return
    }

    const parsedIban = parseIban(iban)
    if (!parsedIban) {
      console.log(iban)
      console.log('iban guard failed')
        return
    }
    const parsedReferenceNumber = parseReferenceNumber(referenceNumber)
    if (!parsedReferenceNumber) {
      console.log('refnum guard failed')
      return
    }
    db.add('recipients', { name, iban: parsedIban, referenceNumber: parsedReferenceNumber })
    setName('')
    setIban('FI')
    setReferenceNumber('')
    onRecipientAdded()
  }

  return (
    <div>
      <h2>Uusi maksunsaaaja</h2>
      <form onSubmit={preventingDefault(handleSubmit)}>
        <label>Nimi: <input type="text" value={name} onChange={(e) => setName(e.target.value)} /></label>
        <label>IBAN: <input type="text" inputMode="numeric" value={iban} onChange={(e) => setIban(e.target.value)} pattern="^\s*FI(\s*\d){16}\s*$" /></label>
        <label>Viitenumero: <input type="text" inputMode="numeric" value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} pattern="^(\s*\d){4,20}\s*$" /></label>
        <button type="submit">Tallenna saaja</button>
      </form>
    </div>
  )
}

export default NewRecipientForm
