import Head from "next/head";
import Link from "next/link";

const LoggedInLinks = [
  { href: "/quote", name: "Get Quote" },
  { href: "/profile", name: "Profile" },
];

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Head>
        <title>Fuel Quotes App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <nav className="bg-gray-900 py-2 text-white flex justify-between">
          <div className="hidden sm:block"></div>
          <div>
            {LoggedInLinks.map(({ name, href }, index) => (
              <Link key={`nav-link-${index}`} href={href}>
                <a className="text-xl font-medium hover:opacity-80 p-4">
                  {name}
                </a>
              </Link>
            ))}
          </div>
          <div>
            <Link href="/logout">
              <a className="text-xl font-medium hover:opacity-80 mr-5">
                Logout
              </a>
            </Link>
          </div>
        </nav>
        {children}
      </div>
    </>
  );
};

export default Layout;
