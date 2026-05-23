import type { IncomingMessage, ServerResponse } from "http";
import { readProduct } from "../service/product.service";

export const productController = (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const url = req.url;
  const method = req.method;

  // Get All Products
  if (url === "/products" && method === "GET") {
    // const products = [
    //   { id: 12, name: "Mouse" },
    //   { id: 13, name: "Mouse2" },
    // ];
    const products = readProduct();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ message: "This is Product Route", data: products }),
    );
  }
};
