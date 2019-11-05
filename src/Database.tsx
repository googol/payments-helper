import React, { useState, useEffect, useContext } from 'react'
import * as idb from 'idb'
import { IBAN, ReferenceNumber } from './types'

export interface Database extends idb.DBSchema {
  recipients: {
    key: number
    value: {
      id?: number
      name: string
      iban: IBAN
      referenceNumber: ReferenceNumber
    }
  }
}

type DbType = idb.IDBPDatabase<Database> | undefined
const DatabaseContext = React.createContext<DbType>(undefined)

export const DatabaseProvider: React.FC = ({ children }) => {
  const [currentDb, setDb] = useState<DbType>(undefined)

  useEffect(() => {
    idb.openDB<Database>('payment-helper-db', 1, {
      upgrade: async (db, oldVersion, newVersion, transaction) => {
        db.createObjectStore('recipients', { keyPath: 'id', autoIncrement: true })
      },
    }).then((db) => setDb(db))
  }, [])

  return (
    <DatabaseContext.Provider value={ currentDb }>
      {children}
    </DatabaseContext.Provider>
  )
}

export function useDatabase() {
  return useContext(DatabaseContext)
}
