import type { NextPage } from 'next'
import Image from 'react-bootstrap/Image'
import { Layout } from '../components/layout/layout'

const Home: NextPage = () => {
  return (
    <Layout>
   <div className="p-5 bg-light">
        <div className="container-fluid py-5 d-flex flex-column text-center">
              <div>
                <Image src="/memojis/fistbump.png" alt="A emoji of Anthony" width="150" height="150" />
              </div>
            <h1 className="display-5 fw-bold">
              Anthony Oleinik
              </h1>
            <p className="fs-5">
              Ramblings of a lunatic. Building <a href="https://getclub.app">Club App.</a> 
              {' '}I write about what I&lsquo;m learning and what I&lsquo;m building.
            </p>
        </div>
    </div>
    </Layout>
  )
}

export default Home
