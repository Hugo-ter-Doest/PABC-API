const request = require("supertest")
const { app } = require("../../server") // Import app, not starting a new server

// Import test database setup (ensures DB reset & server starts)
require("./setupTestDB")

describe("Application Role API", () => {
  let applicationRoleId

  it("should create a Application Role", async () => {
    const res = await request(app).post("/api/applicationRoles").send({ name: "Viewer" })
    expect(res.statusCode).toEqual(201)
    expect(res.body.name).toBe("Viewer")
    applicationRoleId = res.body.id // Store for later tests
  })

  it("should get all Application Roles", async () => {
    const res = await request(app).get("/api/applicationRoles")
    expect(res.statusCode).toEqual(200)
    expect(res.body.length).toBeGreaterThan(0)
  })

  it("should get a specific Application Role by ID", async () => {
    const res = await request(app).get(`/api/applicationRoles/${applicationRoleId}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body.id).toBe(applicationRoleId)
  })

  it("should update a Application Role", async () => {
    const res = await request(app).put(`/api/applicationRoles/${applicationRoleId}`).send({ name: "Editor" })
    expect(res.statusCode).toEqual(200)
    expect(res.body.name).toBe("Editor")
  })

  it("should delete a Application Role", async () => {
    const res = await request(app).delete(`/api/applicationRoles/${applicationRoleId}`)
    expect(res.statusCode).toEqual(204) // No content response
  })

  it("should return 404 for a deleted Application Role", async () => {
    const res = await request(app).get(`/api/applicationRoles/${applicationRoleId}`)
    expect(res.statusCode).toEqual(404)
  })
})
