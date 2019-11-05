import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { DatabaseProvider, useDatabase, Database } from './Database'
import NewRecipientForm from './NewRecipientForm'
import PaymentForm from './PaymentForm'

const App: React.FC = () => {
  const refreshRecipients = () => {}
  return (
    <DatabaseProvider>
      <div className="App">
        <h1>Maksuapustaja</h1>
        <PaymentForm />
      </div>
      <NewRecipientForm onRecipientAdded={() => refreshRecipients()} />
    </DatabaseProvider>
  );
}

export default App;
