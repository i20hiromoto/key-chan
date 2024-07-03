import { Sidemenu } from "@/components/ui/side_menu";
import React, { useEffect, useState, ChangeEvent } from 'react';
import Account from './account';
import Title from './title';
import fetchData from '../scr/fetchData';
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Card,CardContent,CardFooter } from "@/components/ui/card";
import axios from 'axios';
import { useRouter } from 'next/router';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
interface DataItem {
    id: number;
    name: string;
    status: boolean;
    student: string;
    // Add other properties here if needed
}


const Rent: React.FC = () => {
    const router = useRouter();
    const [data, setData] = useState<DataItem[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<string>('');
    const [sessionData, setSessionData] = useState<string | null>(null);

    useEffect(() => {
        const user = sessionStorage.getItem('user');
    if (!user) {
      alert('Please login first');
      router.push('/');
    }
        const fetchDataAndSetData = async () => {
            const fetchedData = await fetchData();
            setData(fetchedData);
        };
        fetchDataAndSetData();

        const userSessionData = sessionStorage.getItem('user');
        if (userSessionData) {
            setSessionData(userSessionData);
        }
    }, []);

    const roomdata = {
        name: selectedRoom,
        student: sessionData
    }
    const submit = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        try{
        const response = await axios.post('http://localhost:3001/api/rent/room',(roomdata),{
          headers: {
          'Content-Type': 'application/json'
          }
      });
            router.push('/select');
        }catch(error){
            console.error('An error occurred:', error);
            alert('An error occurred during login. Please try again.');
        }
    }

    const back = () => {
        router.push('/select');
    }
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', justifyContent: 'flex-start', paddingTop: '50px' }}>
            <form onSubmit={submit}>
            <Card className="w-[600px]">
            <h1>Rent Menu</h1>
            <CardContent>
            <Select onValueChange={(value: string) => setSelectedRoom(value)}>
                <SelectTrigger className="w-[250px]" id="selectroom">
                    <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Select Room</SelectLabel>
                        {data.map(item => (
                        <SelectItem key={item.id} value={item.name}>
                        {item.name}
                        </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            </CardContent>
            <CardFooter className="gap-4">
                <Button type="submit" className="w-[100px]">Submit</Button>
                <Button type="button" onClick={back} className="w-[100px]">Back</Button>
            </CardFooter>
            </Card>
            </form>
            <Account />
            <Title />
        </div>
    );
};

export default Rent;