import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button"
import Account from './account';
import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import axios from 'axios';


interface DataItem {
    id: number;
    name: string;
    status: boolean;
    student: string;
    // Add other properties here if needed
}



const Select: React.FC = () => {
    const router = useRouter();
    useEffect(() => {
        const user = sessionStorage.getItem('user');
        if (!user) {
          alert('Please login first');
          router.push('/');
        }
      }, [router]);
    const rent = () => {
        router.push('/rent'); // 別のページに遷移
    }
    const back = async() => {
        try {
            const response = await axios.post('http://localhost:3001/api/back/room',{student:sessionStorage.getItem('user')}, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
        location.reload();
    }catch(error){
        alert('An error occurred during login. Please try again.');
    } 
}
    const [data, setData] = useState<DataItem[]>([]);
    const fetchData = async (): Promise<DataItem[]> => {
        try {
            const response = await axios.get<DataItem[]>('http://localhost:3001/api/get/all');
            return response.data;
          } catch (error) {
            console.error('An error occurred while fetching data:', error);
            return [];
          }
    }
    const logout = async () => {
            sessionStorage.removeItem('user');
            router.push('/');
    }

    useEffect(() => {
        const fetchDataAndSetData = async () => {
            const fetchedData = await fetchData();
            setData(fetchedData);
        };

        fetchDataAndSetData();
    }, []);
    return (
        <div className="relative flex justify-center">
        <Card className="w-[600px]">
        <h1>Select Menu</h1>
        <CardHeader className="flex justify-between">
        <Button onClick={rent}>借りる</Button>
        <Button onClick={back}>返す</Button>
        </CardHeader>
        <CardContent>
            <Table>
                <TableCaption>Data from API</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[200px]">部屋名</TableHead>
                        <TableHead>貸し出し者</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map(item => (
                        <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.student}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
        <Account />
        </div>
    )
}
export default Select;