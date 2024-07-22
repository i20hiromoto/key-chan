import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import Account from "./account";
import Title from "./title";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

import axios from "axios";

interface DataItem {
  id: number;
  name: string;
  status: boolean;
  student: string;
  // Add other properties here if needed
}

const Select: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState<DataItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (!user) {
      alert("Please login first");
      router.push("/");
    } else {
      setIsClient(true);
    }
  }, [router]);

  const rent = () => {
    router.push("/rent"); // 別のページに遷移
  };

  const back = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/back/room",
        { student: sessionStorage.getItem("user") },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      location.reload();
    } catch (error) {
      alert("An error occurred during login. Please try again.");
    }
  };

  const fetchData = async (): Promise<DataItem[]> => {
    try {
      const response = await axios.get<DataItem[]>(
        "http://localhost:3001/api/get/all"
      );
      return response.data;
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
      return [];
    }
  };

  const logout = async () => {
    sessionStorage.removeItem("user");
    router.push("/");
  };

  useEffect(() => {
    if (isClient) {
      const fetchDataAndSetData = async () => {
        const fetchedData = await fetchData();
        setData(fetchedData);
      };

      fetchDataAndSetData();
    }
  }, [isClient]);

  if (!isClient) {
    return <div>Loading...</div>; // クライアントサイドのレンダリングが完了するまでローディング表示
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[600px] h-[500px]">
        <CardHeader className="flex justify-between">
          <Button onClick={rent}>借りる</Button>
          <Button onClick={back}>返す</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <ScrollArea className="h-80 w-500 rounded-md border">
              <thead className="sticky top-0 bg-white z-10">
                <TableHead className="w-[200px] sticky">部屋名</TableHead>
                <TableHead>借り主</TableHead>
              </thead>
              <TableCaption>Data from API</TableCaption>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.student}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </ScrollArea>
          </Table>
        </CardContent>
      </Card>
      <Account />
      <Title />
    </div>
  );
};

export default Select;
