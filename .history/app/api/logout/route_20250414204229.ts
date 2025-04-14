import { NextResponse } from "next/server";

export const POST = async () => {
  return NextResponse.json(
    { message: "انفصال الاتصال بنجاح" },
    {
      status: 200,
      headers: {
        "Set-Cookie": "userId=; Path=/; Max-Age=0; HttpOnly; Secure",
      },
    }
  );
};
