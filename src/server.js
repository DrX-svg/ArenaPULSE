import express from "express";

const app = express();
const port = 3000;

app.get("/", (request, response) => {
    response.send("ArenaPULSE server is running");
});

app.listen(port, () => {
    console.log(`ArenaPULSE server listening on port ${port}`);
});
// console.log("ArenaPulse development server"); 