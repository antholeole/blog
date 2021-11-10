import type { AppProps } from 'next/app'
import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { SSRProvider } from '@react-aria/ssr'

function MyApp({ Component, pageProps }: AppProps) {
  return <SSRProvider>
    <Component className="bg-light" {...pageProps} />
  </SSRProvider>
}

export default MyApp
