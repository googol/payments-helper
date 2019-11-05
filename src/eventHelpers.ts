import React from 'react'

export const preventingDefault = <E extends React.SyntheticEvent>(handler: (event: E) => void) => (event: E) => {
  event.preventDefault()
  handler(event)
}


