import { Container } from 'react-bootstrap'
import { Header } from './header'

export const Layout = ({ children }: React.PropsWithChildren<{}>) => {
    return <main className="bg-light">
        <Header/>
        
        <div className="d-flex justify-content-center bg-light">
            <div className="wrapper w-100 mx-4 mt-3">
            {children}
            </div>
        </div>
        
        </main>
  }