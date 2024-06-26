import { Button } from "@/components/ui/button"
import { useRouter } from 'next/router';

const router = useRouter();
export default function Logout() {
    const logout = async () => {
        sessionStorage.removeItem('user');
        router.push('/');
    }
    return (
        <form onSubmit={logout}>
        <div className="flex justify-center align-center">
        <Button>Logout</Button>
        </div>
        </form>
    );
}