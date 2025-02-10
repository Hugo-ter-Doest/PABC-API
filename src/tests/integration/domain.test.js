const request = require("supertest");
const { app } = require("../../server"); // Import app, don't start server again

// Import test database setup
require("./setupTestDB");

describe("Domain API", () => {
  it("should create a Domain", async () => {
    const res = await request(app).post("/api/domains").send({ name: "Finance" });
    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toBe("Finance");
  });

  it("should get all Domains", async () => {
    const res = await request(app).get("/api/domains");
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  let domainId;
  let entityTypeId1, entityTypeId2;

  // 🟢 Create a Domain
  it("should create a Domain", async () => {
    const res = await request(app).post("/api/domains").send({ name: "HR" });
    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toBe("HR");
    domainId = res.body.id; // Store for later use
  });

  // 🔵 Get All Domains
  it("should get all Domains", async () => {
    const res = await request(app).get("/api/domains");
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // 🟡 Get a Specific Domain by ID
  it("should get a specific Domain by ID", async () => {
    const res = await request(app).get(`/api/domains/${domainId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toBe(domainId);
  });

  // 🔗 Create Entity Types for Relationship Testing
  it("should create two Entity Types", async () => {
    const res1 = await request(app).post("/api/entityTypes").send({ name: "Invoice" });
    expect(res1.statusCode).toEqual(201);
    entityTypeId1 = res1.body.id;

    const res2 = await request(app).post("/api/entityTypes").send({ name: "Receipt" });
    expect(res2.statusCode).toEqual(201);
    entityTypeId2 = res2.body.id;
  });

  // 🔗 Assign Entity Types to a Domain
  it("should assign Entity Types to a Domain", async () => {
    const res = await request(app)
      .post(`/api/domains/${domainId}/entityTypes`)
      .send({ entityTypeIds: [entityTypeId1, entityTypeId2] });

    expect(res.statusCode).toEqual(200);
    expect(res.body.domainId).toBe(domainId);
    expect(res.body.entityTypes.length).toBe(2);
  });

  // 🔍 Get Entity Types Assigned to a Domain
  it("should retrieve Entity Types assigned to a Domain", async () => {
    const res = await request(app).get(`/api/domains/${domainId}/entityTypes`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.domainId).toBe(domainId);
    expect(res.body.entityTypes.length).toBe(2);
  });
});
