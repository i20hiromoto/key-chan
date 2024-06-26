import { Sidemenu } from "@/components/ui/side_menu";
import React, { useEffect, useState, ChangeEvent } from 'react';
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
import { Card,CardContent } from "@/components/ui/card";
import axios from 'axios';
import { useRouter } from 'next/router';
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

    // const rentKey = async () => {

    //     try {
    //         const response = await axios.put('/data/${id}', newData);
    //         if (response.status === 200) {
    //           console.log('Data updated successfully');
    //         } else {
    //           console.error('Failed to update data');
    //         }
    //       } catch (error) {
    //         console.error('Error:', error);
    //       }
    //     };
    // };
    
    return (
        <div className="flex justify-center align-center">
            <form onSubmit={submit}>
            <Card className="w-[600px]">
            <h1>Rent Menu</h1>
            <CardContent>
            <Select onValueChange={(value: string) => setSelectedRoom(value)}>
                <SelectTrigger className="w-[180px]" id="selectroom">
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
            <CardContent>
                <Button type="submit">借りる</Button> 
            </CardContent>
            </Card>
            </form>
        </div>
    );
};

export default Rent;