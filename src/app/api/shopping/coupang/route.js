import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  // 쿠팡 api >  사업자 정보 필요 --> 대안방법 찾는중
  // TODO: 쿠팡 파트너스 API 연동
  // const accessKey = process.env.COUPANG_ACCESS_KEY;
  // const secretKey = process.env.COUPANG_SECRET_KEY;
  // HMAC 서명 후 요청 (쿠팡 파트너스 API 인증 방식)

  return NextResponse.json({ message: "쿠팡 API 미연동 상태입니다.", query });
}
