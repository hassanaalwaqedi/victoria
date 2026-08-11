import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Victoria Cake & Chocolate";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await fetch(new URL("./victoria-logo.png", import.meta.url)).then((response) => response.arrayBuffer());
  return new ImageResponse(<div style={{ alignItems: "center", background: "#fdf8ef", display: "flex", height: "100%", justifyContent: "center", width: "100%" }}><img alt="Victoria Cake & Chocolate" height="560" src={logo as unknown as string} style={{ objectFit: "contain", width: "560px" }} /></div>, size);
}
