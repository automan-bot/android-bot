const fs = require("fs");
const { argv } = require("process");
const packageJSON = require("./package.json");
if (!argv[2]) {
  throw new Error("未获取到版本号，修改版本失败");
}
packageJSON.version = argv[2];
fs.writeFileSync(
  "./package.json",
  JSON.stringify(packageJSON, null, 2),
  "utf-8"
);
