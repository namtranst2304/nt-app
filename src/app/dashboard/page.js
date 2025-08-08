import { fetchUserInfo } from '@/lib/api/auth';

export async function getServerSideProps() {
  const user = await fetchUserInfo();
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return { props: { user } };
}

export default function DashboardPage({ user }) {
  return (
    <div className="glass-card p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.username}!</h1>
      {/* ...dashboard content... */}
    </div>
  );
}
