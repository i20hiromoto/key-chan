import * as React from "react"
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SelectComponent() {
  const router = useRouter();
  const back = () => {
    router.push('/'); // 別のページに遷移
  };
  const go = () => {
    router.push('/rent'); // 別のページに遷移
  }
  //const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {}
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle>Select menu</CardTitle>
        <CardDescription>Please select mode</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
          <Label htmlFor="framework">Mode select</Label>
          <Select>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="rent">借りる</SelectItem>
                  <SelectItem value="back">返す</SelectItem>
                </SelectContent>
              </Select>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={back}>Cancel</Button>
        <Button onClick={go}>Enter</Button>
      </CardFooter>
    </Card>
  )
}