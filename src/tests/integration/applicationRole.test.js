const request = require("supertest")
const { app } = require("../../server") // Import app, not starting a new server

// Import test database setup (ensures DB reset & server starts)
require("./setupTestDB")

describe("Application Role API", () => {
  let applicationRoleName

  const applicationRole1 = {
    name: "Viewer",
    application: "ZAC"
  }

  it("should create a Application Role", async () => {
    const res = await request(app).post("/api/applicationRoles").send(applicationRole1)
    expect(res.statusCode).toEqual(201)
    expect(res.body.name).toBe(applicationRole1.name)
    expect(res.body.application).toBe(applicationRole1.application)
    applicationRoleName = res.body.name // Store for later tests
  })

  it("should get all Application Roles", async () => {
    const res = await request(app).get("/api/applicationRoles")
    expect(res.statusCode).toEqual(200)
    expect(res.body.length).toBeGreaterThan(0)
  })

  it("should get a specific Application Role by name", async () => {
    const res = await request(app).get(`/api/applicationRoles/${applicationRoleName}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body.name).toBe(applicationRoleName)
  })

  const applicationRole2 = {
    name: "Editor",
    application: "ZAC"
  }

  it("should update a Application Role", async () => {
    const res = await request(app).put(`/api/applicationRoles/${applicationRoleName}`).send(applicationRole2)
    expect(res.statusCode).toEqual(200)
    expect(res.body.name).toBe("Editor")
  })

  it("should delete a Application Role", async () => {
    const res = await request(app).delete(`/api/applicationRoles/${applicationRole2.name}`)
    expect(res.statusCode).toEqual(204) // No content response
  })

  it("should return 404 for a deleted Application Role", async () => {
    const res = await request(app).get(`/api/applicationRoles/${applicationRole2.name}`)
    expect(res.statusCode).toEqual(404)
  })
})
