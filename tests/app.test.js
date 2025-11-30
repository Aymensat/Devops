const request = require("supertest"); //the caller
const app = require("../server"); // our app..duh

describe("my URL shortener API general tests :) ", () => {
  let createdURL;

  it("should return healthy status on /metrics", async () => {
    const res = await request(app).get("/metrics");

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual("up");
  });

  it("should shorten a valid URL", async () => {
    const longUrl = "http://www.enicarthage.rnu.tn/";

    const res = await request(app).post("/encode-url").send({ url: longUrl });

    expect(res.statusCode).toEqual(200);
    expect(res.body.decodedUrl).toEqual(longUrl);
    expect(res.body.encodedUrl).toBeDefined();

    createdURL = res.body.encodedUrl;
  });

  it("should redirect to original URL", async () => {
    const res = await request(app).get(`/${createdURL}`).redirects(0);

    expect(res.statusCode).toEqual(302);

    expect(res.headers.location).toEqual("http://www.enicarthage.rnu.tn/");
  });

  it("should return 404 for a non exsitant ID", async () => {
    const res = await request(app).get("/id-24862");

    expect(res.statusCode).toEqual(404);
  });
});
