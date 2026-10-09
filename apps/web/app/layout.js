import './globals.css';
import { Inter } from 'next/font/google';
import Providers from './providers';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'Internship Tracker — Find Internships at Top Companies',
  description: 'Discover and track internship opportunities at top tech companies in India.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function isExtError(e) {
                  if (!e) return false;
                  var msg = (e.message || '') + '';
                  var file = (e.filename || '') + '';
                  var stack = (e.error && e.error.stack || '') + '';
                  return file.indexOf('chrome-extension://') !== -1 ||
                         file.indexOf('moz-extension://') !== -1 ||
                         msg.indexOf('chrome: call method') !== -1 ||
                         msg.indexOf('chrome-extension://') !== -1 ||
                         stack.indexOf('chrome-extension://') !== -1;
                }
                window.addEventListener('error', function(e) {
                  if (isExtError(e)) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                  }
                }, true);
                window.addEventListener('unhandledrejection', function(e) {
                  var r = e.reason;
                  var msg = (r && r.message || r || '') + '';
                  var stack = (r && r.stack || '') + '';
                  if (msg.indexOf('chrome: call method') !== -1 || msg.indexOf('chrome-extension://') !== -1 || stack.indexOf('chrome-extension://') !== -1) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                  }
                }, true);
              })();
            `
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col text-gray-900 bg-gray-50`}>
        <Providers>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
