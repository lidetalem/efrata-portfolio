import { getProfile } from "@/lib/queries";
import { ProfileForm } from "./profile-form";

export const dynamic = "force-dynamic";

export default async function ProfileAdminPage() {
  const profile = await getProfile();
  return <ProfileForm profile={profile} />;
}
