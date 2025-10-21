import { Button } from "@/components/ui/button";
import { USER_LOGIN } from "@/routes/user.route";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className=" flex flex-col justify-center items-center h-screen">
      <h1 className="font-bold text-4xl text-zinc-600">
        Rajput Gensets & Solar
      </h1>
      <Link href={USER_LOGIN}>
        <Button className="cursor-pointer">Explore More</Button>
      </Link>
    </div>
  );
};

export default page;
