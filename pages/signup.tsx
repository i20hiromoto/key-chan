import { Button } from "@/components/ui/button"
import { useRouter } from 'next/router';
export default function Signup(){
    const router = useRouter();
    const back = () => {
        router.push('/'); // 別のページに遷移
      };
    return (
        <div>
        <h1>Sign up Page</h1>
        <Button onClick={back}>Registration</Button>
        </div>
    )
}