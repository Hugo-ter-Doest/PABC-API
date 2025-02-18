const request = require("supertest")
const { app } = require("../../server") // Import app

// Import test database setup
require("./setupTestDB")

describe("Entity Type API", () => {
  let entityTypeId

  it("should create an Entity Type", async () => {
    const res = await request(app).post("/api/entityTypes").send({ name: "Invoice" })
    expect(res.statusCode).toEqual(201)
    expect(res.body.name).toBe("Invoice")
    entityTypeId = res.body.id // Store for later tests
  })

  // 🔗 Create Domains for Relationship Testing
  it("should create two Domains", async () => {
    const res1 = await request(app).post("/api/domains").send({ name: "Finance" })
    expect(res1.statusCode).toEqual(201)
    domainId1 = res1.body.id

    const res2 = await request(app).post("/api/domains").send({ name: "HR" })
    expect(res2.statusCode).toEqual(201)
    domainId2 = res2.body.id
  })

  // 🔗 Assign Entity Type to Domains
  it("should assign an Entity Type to multiple Domains", async () => {
    const res = await request(app)
      .post(`/api/domains/${domainId1}/entityTypes`)
      .send({ entityTypeIds: [entityTypeId] })

    expect(res.statusCode).toEqual(200)
    expect(res.body.domainId).toBe(domainId1)
  })

  it("should assign the same Entity Type to another Domain", async () => {
    const res = await request(app)
      .post(`/api/domains/${domainId2}/entityTypes`)
      .send({ entityTypeIds: [entityTypeId] })

    expect(res.statusCode).toEqual(200)
    expect(res.body.domainId).toBe(domainId2)
  })

  // 🔍 Get Domains Assigned to an Entity Type
  it("should retrieve Domains for a given Entity Type", async () => {
    const res = await request(app).get(`/api/entityTypes/${entityTypeId}/domains`)
    expect(res.statusCode).toEqual(200)
    expect(res.body.entityTypeId).toBe(entityTypeId)
    expect(res.body.domains.length).toBe(2)
  })

  it("should get all Entity Types", async () => {
    const res = await request(app).get("/api/entityTypes")
    expect(res.statusCode).toEqual(200)
    expect(res.body.length).toBeGreaterThan(0)
  })

  it("should get a specific Entity Type by ID", async () => {
    const res = await request(app).get(`/api/entityTypes/${entityTypeId}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body.id).toBe(entityTypeId)
  })

  it("should update an Entity Type", async () => {
    const res = await request(app).put(`/api/entityTypes/${entityTypeId}`).send({ name: "Receipt" })
    expect(res.statusCode).toEqual(200)
    expect(res.body.name).toBe("Receipt")
  })

  it("should delete an Entity Type", async () => {
    const res = await request(app).delete(`/api/entityTypes/${entityTypeId}`)
    expect(res.statusCode).toEqual(204)
  })

  it("should return 404 for a deleted Entity Type", async () => {
    const res = await request(app).get(`/api/entityTypes/${entityTypeId}`)
    expect(res.statusCode).toEqual(404)
  })
})
