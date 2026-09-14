"use client"
import { SessionProvider } from "next-auth/react"
import { Provider } from "react-redux"
import { store } from "../store/store"

export function Providers({children}){
    return (
        <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
            <Provider store={store}>
                {children}
            </Provider>
        </SessionProvider>
    )
}