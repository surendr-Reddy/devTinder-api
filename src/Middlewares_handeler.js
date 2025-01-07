const express = require("express");

const app = express();

// app.use("/", (res, request, next) => {
//   console.log("middlewares1");

//   next();
// });

// app.get("/user", (res, request, next) => {
//   console.log("middlewares2");
//   request.send("request handeler1");
// });
// app.get("/user1", (res, request, next) => {
//   console.log("middlewares3");
//   request.send("request handeler3");
// });
 app.listen(3000, () => {
   console.log("server started on 30001");
 });

// app.get("/usererror", (res, request, next) => {
//   throw Error("error occurend");
//   try {
//     console.log("send data");
//     throw Error("error occurend");
//   } catch (error) {
//     request.send("erroror for");
//   }
// });

// app.use("/", (err, res, request, next) => {
//   if (err) {
//     console.log("middlewareserrrpor");
//   }
//   request.send("erooror");
//   console.log("hi");
// });

// app.use("/", (res, request, next) => {
//   console.log("test2");
//   next()
// });
// app.get("/test", (res, request, next) => {
//     console.log("jekekekek");
//     // request.send("hey")
//       next();
//   throw Error("error occurend");

//   try {
//     console.log("send data");
//     throw Error("error occurend");
//   } catch (error) {
//     request.send("erroror for");
//   }
// });
// app.get("/test", (res, request, next) => {
//     request.send("ttyest");
//     // request.send("hey")
//       })
// app.use("/", (res, request, next) => {
//     request.send("ttyest");
//   log
// });
app.get("/test1", (res, request, next) => {
    console.log("excute4");
    
      next();})

      app.get("/test1", (res, request, next) => {
        
       
        
          next();})
