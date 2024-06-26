import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/router';
import axios from 'axios';
import { CardFooter } from '@/components/ui/card';

interface User {
  id: number;
  username: string;
  s_number: number;
  password: string;
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // フォームのデフォルトの送信動作を防止
    try {
      const response = await axios.post('http://localhost:3001/login', { username,password }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status == 200) {
        //console.log('Login successful:', response.data.message);
        const user: User = { id: response.data.user.id, username: response.data.user.username , s_number: response.data.user.s_number, password: response.data.user.password};
        sessionStorage.setItem('user', JSON.stringify(user)); // ログイン情報をセッションストレージに保存

        router.push('/select'); // ログイン成功時にページ遷移
      } else {
        console.error('Login failed:', response.data.message);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred during login. Please try again.');
    }
  };
  
  return (
    <div className="flex justify-center">
      <form onSubmit={handleLogin}>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">UserName</Label>
            <Input id="username" placeholder="your ID" type="text" value={username} onChange={e => setUsername(e.target.value)}/>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Password</Label>
            <Input id="password" placeholder="your username" type="text" value={password} onChange={e => setPassword(e.target.value)}/>
          </div>
        </div>
        <CardFooter className="flex justify-between">
        <Button type="submit">Login</Button>
        <Button>Sign up</Button>
        </CardFooter>
      </form>
    </div>
  )
}

export default LoginPage;
