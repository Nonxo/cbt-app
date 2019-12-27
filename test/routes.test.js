const request = require("supertest");
// const express = require("express");
// const app = express();
const app = require("../server");

// beforeAll(async (done) => {
//   dbConnection = await mongoose.connect(...)
//   done()
// })
console.log(app.connection);
describe("Post Endpoints", () => {
  it("should create a new user", async done => {
    await request(app.connection)
      .post("/users/")
      .send({
        firstName: "Bode",
        lastName: "Nwabuokei",
        phoneNumber: "0703029585923",
        dateOfBirth: "12-02-2010",
        email: "jode@gmail.com",
        password: "bode123"
      })
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect(404);
    done();
  });
});

// await dbConnection.close()
// dbConnection.on('disconnected', done)
// })
