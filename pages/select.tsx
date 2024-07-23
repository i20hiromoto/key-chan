import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import Account from "./account";
import Title from "./title";
import RentDialog from "./rentDialog";
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (!user) {
      alert("Please login first");
      router.push("/");
    } else {
      setIsClient(true);
    }
  }, [router]);

  const back = async () => {
    try {
      const response = await axios.post(
        "https://keychan-backend.vercel.app/room",
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
        "https://keychan-backend.vercel.app/api/get/all"
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

  const handleSubmit = (selectedRoom: string, sessionData: string | null) => {
    // Handle the form submission logic here
    console.log(`Selected Room: ${selectedRoom}, Session Data: ${sessionData}`);
    setIsDialogOpen(false); // Close the dialog after submission
    location.reload();
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
          <RentDialog
            item={data}
            onSubmit={handleSubmit}
            onClose={() => setIsDialogOpen(false)}
          />
          <Button onClick={back}>返す</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <ScrollArea className="h-80 w-500 rounded-md border">
              <thead className="sticky top-0 bg-white z-10">
                <TableHead>部屋名</TableHead>
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
      {isDialogOpen && (
        <RentDialog
          item={data}
          onSubmit={handleSubmit}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default Select;
