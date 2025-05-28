import Layout from '../components/Layout';
import './globals.css';

export const metadata = {
  title: 'Sistema de Biblioteca',
  description: 'Gestiona tu colección de libros de manera eficiente',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
