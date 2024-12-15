
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import NextLogo from "./next-logo";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // if has no env.local file
  if (!hasEnvVars) {
    return (
      <>
        <div className="flex gap-4 items-center">
          <div>
            <Badge
              variant={"default"}
              className="font-normal pointer-events-none"
            >
              Please update .env.local file with anon key and url
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              size="sm"
              variant={"default"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-in">Login</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant={"default"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-up">Register</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }
  // user exists ?
  return user ? (
    // if user exists?
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      {/* <form action={signOutAction}> */}
        <Button type="submit" variant={"outline"}>
          Sign out
        </Button>
      {/* </form> */}
    </div>
  ) : (
    // if user not exist ( not sign in yet)
    <div className="flex gap-3">
      
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Register</Link>
      </Button>
    </div>
  );
}
