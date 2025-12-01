import { Suspense } from 'react';
import ProfileClient from '@/components/profile/ProfileClient';

export const dynamic = 'force-dynamic';

export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ProfileClient />
    </Suspense>
  );
}

// "use client";

// import TopBar from "@/components/TopBar/TopBar";
// import ProfileHeader from "./ProfileHeader";
// import ProfileCard from "./ProfileCard";
// import ProfileForm from "./ProfileForm";
// import { User } from "@/types/user";
// import { useAuth } from "@/context/AuthContext";
// import LoaderScreenDynamic from "@/components/LoaderScreen/LoaderScreenDynamic";

// const ProfilePage: React.FC = () => {
//   const { user, isLoading } = useAuth();

//   if (isLoading) return <LoaderScreenDynamic />;

//   return (
//     <div className="min-h-screen p-3">
//       <TopBar />
//       <ProfileHeader />
//       <div className="px-4 sm:px-6 lg:px-8 bg-backgroundGray py-10 rounded-b-2xl">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <ProfileCard />
//         </div>
//         <ProfileForm user={user as User} />
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;
