import './globals.css';

export const metadata = {
  title: 'SMP Atelier - Admin Console',
  description: 'Super Master Products - Luxury Fashion Admin Dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/smp-logo.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
