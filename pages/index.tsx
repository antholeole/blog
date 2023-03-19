import { readFileSync } from 'fs'
import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import path from 'path'
import Image from 'react-bootstrap/Image'
import { Layout } from '../components/layout/layout'

const Home = ({ quotes }: InferGetStaticPropsType<typeof getStaticProps>) => {

  const today = new Date(Date.now())
  today.setHours(0, 0, 0, 0)
  const dayOfYear = today.getUTCDate() + (today.getUTCMonth() * 31)
  const todaysQuote = quotes[dayOfYear % quotes.length]

  return (
    <Layout>
      <div className="p-5 bg-light">
        <div className="container-fluid py-5 d-flex flex-column text-center">
          <div>
            <Image src="/memojis/fistbump.png" alt="A emoji of Anthony" width="150" height="150" />
          </div>
          <h1 className="display-5 fw-bold pb-3">
            Anthony Oleinik
          </h1>
          <hr/>
          <p>
            {todaysQuote.quote}
          </p>
          <small><b>- {todaysQuote.author}</b></small>

          <ul>
          </ul>
        </div>
      </div>
    </Layout>
  )
}

export default Home

export const getStaticProps: GetStaticProps<{
  quotes: {
    quote: string;
    author: string;
  }[]
}> = async () => {
  const quotes = JSON.parse(readFileSync(path.join(process.cwd(), 'quotes.json')).toString())['quotes']

  return {
    props: { quotes }
  }
}

