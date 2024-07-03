import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/router';
import axios from 'axios';
import Title from './title';
import { CardFooter } from '@/components/ui/card';

interface User {
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
      const response = await axios.post('http://localhost:3001/login', { username, password }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 200) {
        const user: User = { username: response.data.user.username, s_number: response.data.user.s_number, password: response.data.user.password };
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

  const signUp = () => {
    router.push('/signup');
  }
  
  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleLogin} className="w-full max-w-md mt-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label style={{fontSize: '20px'}}></Label>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="username">UserName</Label>
            <Input id="username" placeholder="your ID" type="text" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" placeholder="your password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
        </div>
        <div className="mt-4">
          <CardFooter className="flex justify-between">
            <Button type="submit" className="w-[100px]">Login</Button>
            <Button type="button" className="w-[100px]" onClick={signUp}>Sign up</Button>
          </CardFooter>
        </div>
      </form>
      <Title/>
    </div>
  );
  
}

export default LoginPage;
