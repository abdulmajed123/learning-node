import type { IncomingMessage, ServerResponse } from "http";

export const productController = (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const url = req.url;
  const method = req.method;
  if (url === "/products" && method === "GET") {
    const products = [
      { id: 12, name: "Mouse" },
      { id: 13, name: "Mouse2" },
    ];
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ message: "This is Product Route", data: products }),
    );
  }
};
