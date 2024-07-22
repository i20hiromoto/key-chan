import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios";
import fetchData from "../scr/fetchData";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DataItem {
  id: number;
  name: string;
  status: boolean;
  student: string;
  // Add other properties here if needed
}

const RentDialog: React.FC<{
  item: DataItem[];
  onSubmit: (selectedRoom: string, sessionData: string | null) => void;
  onClose: () => void;
}> = ({ item, onSubmit, onClose }) => {
  const [data, setData] = useState<DataItem[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [sessionData, setSessionData] = useState<string | null>(
    sessionStorage.getItem("user")
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = axios.post(
        "http://localhost:3001/api/rent/room",
        roomdata,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred during login. Please try again.");
    }
    onSubmit(selectedRoom, sessionData);
  };

  const roomdata = {
    name: selectedRoom,
    student: sessionData,
  };

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    const fetchDataAndSetData = async () => {
      const fetchedData = await fetchData();
      setData(fetchedData);
    };
    fetchDataAndSetData();

    const userSessionData = sessionStorage.getItem("user");
    if (userSessionData) {
      setSessionData(userSessionData);
    }
  }, []);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>部屋を選択</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>部屋選択</AlertDialogTitle>
          <AlertDialogDescription>
            部屋を選択して決定をクリックしてください
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit}>
          <Select onValueChange={(value: string) => setSelectedRoom(value)}>
            <SelectTrigger className="w-[250px]" id="selectroom">
              <SelectValue placeholder="部屋を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>選択</SelectLabel>
                {data.map((item) => (
                  <SelectItem key={item.id} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex gap-4 mt-4">
            <AlertDialogAction type="submit" disabled={!selectedRoom}>
              決定
            </AlertDialogAction>
            <AlertDialogCancel onClick={onClose}>キャンセル</AlertDialogCancel>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RentDialog;
