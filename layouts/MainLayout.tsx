import React, { Fragment, PropsWithChildren } from 'react'
import { Footer, Header } from '../components'

interface MainLayoutProps extends PropsWithChildren {}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <Fragment>
        <Header />
        {children}
        <Footer />
    </Fragment>
  )
}