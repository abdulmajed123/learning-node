import type { IncomingMessage, ServerResponse } from "http";
import { insertProduct, readProduct } from "../service/product.service";
import type { Iproduct } from "../types/product.type";
import { parseBody } from "../utility/parseBodey";
import { sendResponse } from "../utility/sendResponse";

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
    try {
      const products = readProduct();
      return sendResponse(
        res,
        200,
        true,
        "Products retrived successfully",
        products,
      );
    } catch (error) {
      return sendResponse(res, 500, false, "Something Went Wrong", error);
    }
  } else if (method === "GET" && id !== null) {
    // Get Single Product
    const products = readProduct();
    const product = products.find((p: Iproduct) => p.id === id);
    if (!product) {
      try {
        return sendResponse(res, 404, false, "Products Not Found");
      } catch (error) {
        return sendResponse(res, 500, false, "Something Went Wrong", error);
      }
    }
    sendResponse(res, 200, true, "Products retrived successfully");
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
  } else if (method === "DELETE" && id !== null) {
    const products = readProduct();
    const index = products.findIndex((p: Iproduct) => p.id === id);
    if (index < 0) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Products Not Found",
          data: null,
        }),
      );
    }

    products.splice(index, 1);
    // products.newProduct();
    insertProduct(products);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Products Delete successfully",
        data: null,
      }),
    );
  }
};
