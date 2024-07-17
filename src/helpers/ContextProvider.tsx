"use client";
import {
  ReactNode,
  createContext,
  useState,
  FC,
  useEffect,
} from "react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import GetAutoUserDetails from "../../actions/autoLogin";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  username: string;
  verified: boolean;
  role: string;
}

interface UserContextValue {
  getUserDetails: User[];
  setGetUserDetails: React.Dispatch<React.SetStateAction<User[]>>;
}

export const userContext = createContext<UserContextValue | undefined>(
  undefined
);

const GlobalContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [getUserDetails, setGetUserDetails] = useState<User[]>([]);
  const { toast } = useToast();
  const router = useRouter();


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await GetAutoUserDetails();
        if (res.status === false) {
          toast({
            title: "Error",
            description: res.msg,
          });
          router.push("/login");
          return;
        } 
        setGetUserDetails([{
          id: res.id || '',
          username: res.username || '',
          verified: res.verified || false,
          role: res.role || '',
        }]);
        if(getUserDetails){
            router.push('/');
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong, try again",
        });
        router.push('/login')
      }
    };

    fetchUser();
  }, []);
  return (
    <userContext.Provider value={{ getUserDetails, setGetUserDetails }}>
      <Toaster />
      {children}
    </userContext.Provider>
  );
};

export default GlobalContextProvider;