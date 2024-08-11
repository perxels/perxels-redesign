// components/withAuth.tsx
import { ReactElement, ComponentType, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../firebaseConfig';  // Update path if needed

interface WithAuthProps {
  user?: User | null;
}

const withAuth = <P extends WithAuthProps>(WrappedComponent: ComponentType<P>): ComponentType<Omit<P, 'user'>> => {
  return (props: Omit<P, 'user'>): ReactElement => {
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
          setLoading(false);
        } else {
          router.push('/admin');
        }
      });

      return () => unsubscribe();
    }, [router]);

    if (loading) return <p>Loading...</p>;

    return <WrappedComponent user={user} {...(props as P)} />;
  };
};

export default withAuth;
