import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

const game_id = 'cs2'
// eslint-disable-next-line import/no-anonymous-default-export
export const POST = async (req: any, res: any) => {
  const formData = await req.formData();

  const file = formData.get("file");
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename =  file.name.replaceAll(" ", "_");
  console.log(filename);
  try {
    await writeFile(
      path.join(process.cwd(), "public/assets/" + filename),
      buffer
    );
    // return NextResponse.json({ Message: "Success", status: 201 });
  } catch (error) {
    console.log("Error occured ", error);
   //  return NextResponse.json({ Message: "Failed", status: 500 });
  }

  const newFormData = new FormData();
  formData.append("file", file);


  const result = await fetch(`${process.env.REPLAY_API_URL!}/games/${game_id}/replay`, {
    method: "POST",
    body: newFormData,

  })

  const resultJson = await result.json();
  

  return NextResponse.json(resultJson, { status: result.status });
};

export default POST
