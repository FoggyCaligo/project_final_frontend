import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  // TODO: 네이버 쇼핑 검색 API 연동
  // const clientId = process.env.NAVER_CLIENT_ID;
  // const clientSecret = process.env.NAVER_CLIENT_SECRET;
  // const url = `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(query)}&display=5`;
  // const res = await fetch(url, {
  //   headers: {
  //     "X-Naver-Client-Id": clientId,
  //     "X-Naver-Client-Secret": clientSecret,
  //   },
  // });
  // const data = await res.json();
  // return NextResponse.json(data);

  return NextResponse.json({ message: "네이버 API 미연동 상태입니다.", query });
}
