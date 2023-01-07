import React, { Fragment, PropsWithChildren } from 'react'
import { Footer, Header } from '../components'

interface MainLayoutProps extends PropsWithChildren {
  isDark?: boolean
}

export const MainLayout = ({ children, isDark }: MainLayoutProps) => {
  return (
    <Fragment>
      <Header isDark={isDark} />
      {children}
      <Footer />
    </Fragment>
  )
}
