import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from 'next/router';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

const f =23;
const Sidemenu =()=> {
    const router = useRouter();
    const home = () => {
        router.push('/'); // 別のページに遷移
    };

    return (
        <div className="sidebar">
                <Card className="w-[150px]">
                    <button onClick={home} style={{ fontSize: 40 }}>Top</button>
                    <ScrollArea style={{ height: "100vh" }}>
                        <ul className="sidebar-menu">
                            <li style={{ fontSize: f }}>Services</li>
                            <li style={{ fontSize: f }}>Contact</li>
                            <li style={{ fontSize: f }}>FAQ</li>
                            <li style={{ fontSize: f }}>Support</li>
                            <li style={{ fontSize: f }}>Blog</li>
                            <li style={{ fontSize: f }}>Careers</li>
                            <li style={{ fontSize: f }}>Testimonials</li>
                            <li style={{ fontSize: f }}>Gallery</li>
                        </ul>
                    </ScrollArea>
                </Card>
            </div>
    );
}

export {Sidemenu};