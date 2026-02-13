import ProfileEditForm from "../../../_components/profile/ProfileEditForm";

export const metadata = {
  title: "Edit Profile | Job Mitra",
  description: "Edit your professional profile on Job Mitra",
};

export default function EditProfilePage() {
  return <ProfileEditForm role="talent" viewPath="/talent/profile" />;
}
