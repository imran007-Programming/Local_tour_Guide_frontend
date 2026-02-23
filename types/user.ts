export type User = {
  data: {
    id: string;
    name: string;
    email: string;
    role: "TOURIST" | "GUIDE" | "ADMIN";
    profilePic: string | null;
    bio: string | null;
    languages: string[];
    tourist?: {
      preferences: string[],
      createdAt: string

    },
    guide?: {
      expertise: string[],
      dailyRate: number
    }

  };
};
