import type { IncomingMessage, ServerResponse } from "http";
import { insertProduct, readProduct } from "../service/product.service";
import type { Iproduct } from "../types/product.type";
import { parseBody } from "../utility/parseBodey";

export const productController = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const url = req.url;
  const method = req.method;
  const urlParts = url?.split("/");
  const id =
    urlParts && urlParts[1] === "products" ? Number(urlParts[2]) : null;
  console.log(id);
  // const id =
  //   urlParts && urlParts[1] === "products" && urlParts[2]
  //     ? Number(urlParts[2])
  //     : null;

  // Get All Products
  if (url === "/products" && method === "GET") {
    // const products = [
    //   { id: 12, name: "Mouse" },
    //   { id: 13, name: "Mouse2" },
    // ];
    const products = readProduct();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Products retrived successfully",
        data: products,
      }),
    );
  } else if (method === "GET" && id !== null) {
    // Get Single Product
    const products = readProduct();
    const product = products.find((p: Iproduct) => p.id === id);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Products retrived successfully",
        data: product,
      }),
    );
  } else if (method === "POST" && url === "/products") {
    // created product by post method
    const body = await parseBody(req);
    const products = readProduct();

    const newProduct = {
      id: Date.now(),
      ...body,
    };
    // console.log(newProduct);
    products.push(newProduct);
    insertProduct(products);
    console.log(products);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Products create successfully",
        data: newProduct,
      }),
    );
  } else if (method === "PUT" && id !== null) {
    const body = await parseBody(req);
    const products = readProduct();

    const index = products.findIndex((p: Iproduct) => p.id === id);
    console.log(index);
    if (index < 0) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Products Not Found",
          data: null,
        }),
      );
    }
    console.log(products[index]);
    products[index] = { id: products[index].id, ...body };
    insertProduct(products);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Product Update  Successfully",
        data: products[index],
      }),
    );
  }
};
