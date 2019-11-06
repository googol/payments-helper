import React, { useState } from 'react';
import './App.css';
import { DatabaseProvider } from './Database'
import NewRecipientForm from './NewRecipientForm'
import PaymentForm, { paymentAmountRegex } from './PaymentForm'
import { preventingDefault } from './eventHelpers'

function regexToInputPattern(input: RegExp): string {
  return input.toString().slice(1, -1)
}

const App: React.FC = () => {
  const [currentAmount, setCurrentAmount] = useState('0')
  const [formKey, setFormKey] = useState(0)
  const refreshRecipients = () => {setFormKey(prev => prev + 1)}
  return (
    <DatabaseProvider>
      <div className="App">
        <h1>Maksuapustaja</h1>
        <form>
          <label>Amount: <input type="text" inputMode="numeric" value={currentAmount} onChange={preventingDefault((e) => setCurrentAmount(e.target.value))} pattern={regexToInputPattern(paymentAmountRegex)} /></label>
          <br />
          <PaymentForm key={formKey} currentAmount={currentAmount} />
        </form>
        <NewRecipientForm onRecipientAdded={() => refreshRecipients()} />
      </div>
    </DatabaseProvider>
  );
}

export default App;
