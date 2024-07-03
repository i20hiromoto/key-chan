import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  username: string;
  s_number: number;
  password: string;
}

const Account: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
    router.push('/'); // ログアウト後にログインページにリダイレクト
  };

  return (
    <div className="fixed top-0 right-0 m-4">
      <DropdownMenu>
        <DropdownMenuTrigger>My Account</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {user ? (
            <>
              <DropdownMenuItem>Username: {user.username}</DropdownMenuItem>
              <DropdownMenuItem>Student Number: {user.s_number}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem>No user data available</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Account;
