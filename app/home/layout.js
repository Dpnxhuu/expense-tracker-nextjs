import React, { Children } from 'react'

export const metadata = {
    title: " Home - Track you expenses",
   description: "Track your personal expenses with category breakdowns",
}

export default function HomeLayout({children}) {
  return (
    <>
      {children}
    </>
  )
}
