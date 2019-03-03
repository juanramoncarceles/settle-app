const express = require("express");
const morgan = require("morgan");
const gastosRouter = require("./routes/gastosRouter");
const usuariosRouter = require("./routes/usuariosRouter");
const settleUpsRouter = require("./routes/settleUpsRouter");

// URL
const hostname = "localhost";
const port = 3001;

// Creacion app express
const app = express();
app.use(morgan("dev"));

app.use("/gastos", gastosRouter);
app.use("/usuarios", usuariosRouter);
app.use("/settleUps", settleUpsRouter);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
