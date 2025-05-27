"use sever";
const prod = false;

export async function apiWeb(fn, data, type, method) {
  const urlProd = "http://47.129.131.246:8765/app";
  const urlTest = "http://192.168.1.145:3000/test";

  try {
    if (prod) {
      //   let body = JSON.stringify(data);
      //   let res = await fetch(urlProd + fn, {
      //     method: "PUT",
      //     headers: {
      //       "content-type": "application/octet-stream",
      //     },
      //     body: body,
      //   });
      //   //      console.log(res);
      //   let resBuffer = await res.arrayBuffer();
      //   //      console.log(resBuffer);
      //   //    let bf=Buffer.from([...new Uint8Array(resBuffer)]);
      //   //    console.log('bf',bf);
      //   //    let uz=zlib.unzipSync(bf);
      //   //    console.log('uz',uz.toString());
      //   //    let resJSON=JSON.parse(uz);
      //   //    let resJSON = JSON.parse(
      //   let response = zlib
      //     .unzipSync(Buffer.from([...new Uint8Array(resBuffer)]))
      //     .toString();
      //   //    );
      //   if (type == "json") {
      //     return JSON.parse(response);
      //   } else {
      //     return response;
      //   }
    } else {
      const body = JSON.stringify(data);
      let res: Response;
      if (method === "PUT") {
        res = await fetch(urlTest + fn, {
          method: method,
          headers: {
            "content-type": "application/json",
          },
          // headers: headers,
          body: body,
        });
      }
      if (method === "POST") {
        res = await fetch(urlTest + fn, {
          method: method,
          headers: {
            "content-type": "application/json",
          },
          // headers: headers,
          body: body,
        });
      }
      if (method === "GET") {
        res = await fetch(urlTest + fn, {
          method: method,
          headers: {
            "content-type": "application/json",
          },
          // headers: headers,
        });
      }
      // else if (method === "GET") {
      //   // console.log("fn", fn);
      //   res = await fetch(urlS3 + fn, {
      //     method: method,
      //   });
      //   // console.log("res -----------", res);
      // }

      if (type === "json") {
        return await res.json();
      }
      return await res;
    }
  } catch (err) {
    console.log("api err", err);
    if (type === "json") {
      return {};
    }
    return "";
  }
}
export async function api(fn, data, type, method) {
  const urlProd = "http://47.129.131.246:8765/app";
  const urlTest = "http://192.168.1.44:3000/";

  try {
    if (prod) {
      //   let body = JSON.stringify(data);
      //   let res = await fetch(urlProd + fn, {
      //     method: "PUT",
      //     headers: {
      //       "content-type": "application/octet-stream",
      //     },
      //     body: body,
      //   });
      //   //      console.log(res);
      //   let resBuffer = await res.arrayBuffer();
      //   //      console.log(resBuffer);
      //   //    let bf=Buffer.from([...new Uint8Array(resBuffer)]);
      //   //    console.log('bf',bf);
      //   //    let uz=zlib.unzipSync(bf);
      //   //    console.log('uz',uz.toString());
      //   //    let resJSON=JSON.parse(uz);
      //   //    let resJSON = JSON.parse(
      //   let response = zlib
      //     .unzipSync(Buffer.from([...new Uint8Array(resBuffer)]))
      //     .toString();
      //   //    );
      //   if (type == "json") {
      //     return JSON.parse(response);
      //   } else {
      //     return response;
      //   }
    } else {
      const body = JSON.stringify(data);
      let res: Response;
      if (method === "PUT") {
        res = await fetch(urlTest + fn, {
          method: method,
          headers: {
            "content-type": "application/json",
          },
          // headers: headers,
          body: body,
        });
      }
      if (method === "POST") {
        res = await fetch(urlTest + fn, {
          method: method,
          headers: {
            "content-type": "application/json",
          },
          // headers: headers,
          body: body,
        });
      }
      // else if (method === "GET") {
      //   // console.log("fn", fn);
      //   res = await fetch(urlS3 + fn, {
      //     method: method,
      //   });
      //   // console.log("res -----------", res);
      // }

      if (type === "json") {
        return await res.json();
      }
      return await res;
    }
  } catch (err) {
    console.log("api err", err);
    if (type === "json") {
      return {};
    }
    return "";
  }
}
