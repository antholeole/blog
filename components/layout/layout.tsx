import { Container } from 'react-bootstrap'
import { Header } from './header'
import Head from 'next/head'
import favicon from '../../public/favicon.ico'

export const Layout = ({ children, title }: React.PropsWithChildren<{title?: string }>) => {
    return <main className="bg-light">
        <Head>
        <link rel="favicon icon" href={favicon.src} type="image/x-icon" />
        <title>Ant{'\''}s Blog {title && `- ${title}`}</title>
        </Head>
        <Header/>
        <div className="d-flex justify-content-center bg-light">
            <div className="wrapper w-100 mx-4 mt-3">
            {children}
            </div>
        </div>
        </main>
  }