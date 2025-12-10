export interface Profile {
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  bio?: string;
  phone?: string;
  dni?: string;
  address?: string;
  publicName?: string;
}

export interface User {
  _id: string;
  email: string;
  walletAddress?: string;
  profile?: Profile;
  manglaiCompanyId?: string | null;
}
