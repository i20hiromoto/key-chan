import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger as BaseDropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import styled from 'styled-components';
import { Button } from "@/components/ui/button"

interface User {
  username: string;
  s_number: number;
  password: string;
}

const DropdownMenuTrigger = styled(BaseDropdownMenuTrigger)`
  outline: 2px solid black;
  padding: 8px;
  cursor: pointer;
`;

const Account: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false); // DropdownMenuContentの開閉状態を管理するstate
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
      <DropdownMenuTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(!isOpen)}>My Account</Button>
      </DropdownMenuTrigger>
        {isOpen && (
          <DropdownMenuContent>
            <DropdownMenuLabel>Account Data</DropdownMenuLabel>
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
        )}
      </DropdownMenu>
    </div>
  );
};

export default Account;
