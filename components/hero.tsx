import { Button } from "./ui/button";
import Link from "next/link";
export default function Header() {
  return (
    <div className="flex flex-col gap-8 items-center">
    
      <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center ">
        The demo register app with file attachments
      </p>
      <Button className="bg-gradient-to-tr from-green-700 to-green-600">
        <Link href='/register'>Leave contact here</Link>
        </Button>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
