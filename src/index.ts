import { Ami } from "./Ami";

const ami = new Ami({ user: "test", secret: "test" }, "localhost", 5038);

ami.connect().then((conn) => {
  console.log(conn);
});
