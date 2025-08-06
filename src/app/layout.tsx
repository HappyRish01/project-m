import {getUserFromTokenWithoutGivenToken  } from '../lib/server/auth';
import {AuthProvider} from '@/components/AuthProvider';
import './globals.css';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromTokenWithoutGivenToken();
  // console.log("from layout user:", user);
  return (
    <html lang="en">
      <body>
        <AuthProvider initialUser={user}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}