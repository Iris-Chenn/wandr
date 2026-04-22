import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = formData.get("email") as string;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // TODO Week 7: store in Supabase
    // const supabase = createClient(...)
    // await supabase.from('waitlist').insert({ email, created_at: new Date() })

    console.log("Waitlist signup:", email);

    // Redirect back with success param
    const referer = request.headers.get("referer") || "/";
    const url = new URL(referer);
    url.searchParams.set("waitlist", "success");
    return NextResponse.redirect(url.toString());
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
