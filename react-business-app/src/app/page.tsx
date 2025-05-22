"use client";

import {useBaseContext} from "@/context/BaseContext";

export default function Home() {

  const { jwt } = useBaseContext();

  return <>
    <div className="page">
      {
         jwt ? jwt : "no jwt"
      }
    </div>
  </>
}
