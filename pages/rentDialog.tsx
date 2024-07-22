import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import Account from "./account";
import Title from "./title";
import Rent from "./rent";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DataItem {
  id: number;
  name: string;
  status: boolean;
  student: string;
}

const Select: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState<DataItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (!user) {
      alert("ログインしてください");
      router.push("/");
    } else {
      setIsClient(true);
    }
  }, [router]);

  const fetchData = async (): Promise<DataItem[]> => {
    try {
      const response = await axios.get<DataItem[]>(
        "http://localhost:3001/api/get/all"
      );
      return response.data;
    } catch (error) {
      console.error("データの取得中にエラーが発生しました:", error);
      return [];
    }
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
    return <div>読み込み中...</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Card className="w-[600px] h-[500px]">
        <CardHeader className="flex justify-between">
          <Button onClick={() => setDialogOpen(true)}>借りる</Button>
          <Button
            onClick={async () => {
              try {
                await axios.post(
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
                alert("エラーが発生しました。もう一度お試しください。");
              }
            }}
          >
            返す
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <ScrollArea className="h-80 w-500 rounded-md border">
              <thead className="sticky top-0 bg-white z-10">
                <TableHead className="w-[200px] sticky">部屋名</TableHead>
                <TableHead>借り主</TableHead>
              </thead>
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
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogTrigger />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>部屋を借りる</AlertDialogTitle>
            <AlertDialogContent>
              {/* RentForm コンポーネントを表示 */}
              <Rent />
            </AlertDialogContent>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Select;
