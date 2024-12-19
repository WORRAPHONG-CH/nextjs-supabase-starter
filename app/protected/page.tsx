
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import NextLogo from "@/components/next-logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-10">
      <span className="self-center "><NextLogo/></span>
      <div className="w-full flex flex-col gap-5">
        <h2 className="text-2xl text-center">Hello, Khun {user.email}</h2>
        <p className="text-xl font-semibold self-center">Role: {user.role}</p>
        <Button className="w-1/2 self-center">
        <Link href='/users'>Management User</Link>
        </Button>
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
        </div>
      </div>
      <div className="flex flex-col gap-2 items-center">
        <h2 className="font-bold text-2xl mb-4 self-start">Your user details</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
      
    </div>
  );
}
