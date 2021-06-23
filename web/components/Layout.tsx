import Head from 'next/head'

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Head>
        <title>Fuel Quotes App</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {children}
    </>
  )
}

export default Layout
