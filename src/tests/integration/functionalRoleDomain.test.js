const request = require("supertest")
const { app } = require("../../server") // Ensure this path is correct
const { FunctionalRole, Domain, FunctionalRoleDomain, EntityType, ApplicationRole } = require("../../models/associations")
require("./setupTestDB")

describe("Functional Role-Domain Associations API", () => {
  let functionalRole, domain

  describe("POST /api/functionalRoleDomains", () => {
    it("should create an association between a Functional Role and a Domain", async () => {
      functionalRole = await FunctionalRole.create({ name: "Admin" })
      domain = await Domain.create({ name: "Finance" })
      const response = await request(app)
      .post("/api/functionalRoleDomains")
      .send({ functionalRoleId: functionalRole.id, domainId: domain.id })

      // console.log("Response Body:", response.body) // ✅ Add this to debug

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty("id")
      expect(response.body.functionalRoleId).toBe(functionalRole.id) // ✅ Fixes undefined error
      expect(response.body.domainId).toBe(domain.id)

      // Verify database entry
      const association = await FunctionalRoleDomain.findOne({
        where: { functionalRoleId: functionalRole.id, domainId: domain.id },
      })

      expect(association).not.toBeNull()
      expect(association.functionalRoleId).toBe(functionalRole.id)
      expect(association.domainId).toBe(domain.id)
    })

    it("should prevent duplicate associations", async () => {
      const response = await request(app)
        .post(`/api/functionalRoleDomains`)
        .send({ functionalRoleId: functionalRole.id, domainId: domain.id })

      expect(response.status).toBe(400)
      expect(response.body.error).toBe("Functional Role is already assigned to this Domain")
    })

    it("should return an error if Functional Role or Domain does not exist", async () => {
      const nonexistsingUUID = "11111111-2222-3333-4444-555555555555"
      const response = await request(app)
        .post(`/api/functionalRoleDomains`)
        .send({ functionalRoleId: nonexistsingUUID, domainId: nonexistsingUUID })

      expect(response.status).toBe(404)
      expect(response.body.error).toBe("Functional Role or Domain not found")
    })
  })

  describe("GET /api/functionalRoleDomains", () => {
    it("should retrieve all Functional Role-Domain associations", async () => {
      const response = await request(app).get(`/api/functionalRoleDomains`)

      expect(response.status).toBe(200)
      expect(response.body.length).toBeGreaterThan(0)
      expect(response.body[0]).toHaveProperty("functionalRoleId", functionalRole.id)
      expect(response.body[0]).toHaveProperty("domainId", domain.id)
    })
  })

  describe("POST /api/functionalRoleDomains/allowed-application-roles-entity-types", () => {
    let functionalRole, domain, applicationRole, entityType1, entityType2, functionalRoleDomain

    const testData = {
      functionalRole: {
        name: "Medewerker Vergunningen",
      },
      domains: [
        {
          name: "Fysiek domein",
        }
      ],
      entityTypes: [
        {
          name: "Zaaktype Sloop"
        },
        {
          name: "Zaaktype Bouwvergunning"
        }
      ],
      applicationRoles: [
        {
          name: "Zaak behandelen",
          application: "ZAC"
        }
      ]
    }

    it('Should create test data', async () => {
      functionalRole = await FunctionalRole.create(testData.functionalRole)
      domain = await Domain.create(testData.domains[0])
      entityType1 = await EntityType.create(testData.entityTypes[0])
      await domain.addEntityType(entityType1)
      entityType2 = await EntityType.create(testData.entityTypes[1])
      await domain.addEntityType(entityType2)
      applicationRole = await ApplicationRole.create(testData.applicationRoles[0])

      // Create FunctionalRoleDomain association
      functionalRoleDomain = await FunctionalRoleDomain.create({
        functionalRoleId: functionalRole.id,
        domainId: domain.id,
      })

      // Assign Application Role to FunctionalRoleDomain association
      await functionalRoleDomain.setApplicationRoles([applicationRole])

      /* 
      const response = await request(app)
        .get(`/api/functionalRoleDomains/${functionalRoleDomain.id}/applicationRoles`)

      console.log(JSON.stringify(response.body, null, 2))
      */
    })

    it("should return allowed Application Roles and Entity Types for given Functional Roles", async () => {
      const response = await request(app)
        .post("/api/functionalRoleDomains/getAccessRights")
        .send({ functionalRoleIds: [functionalRole.id] })

      expect(response.status).toBe(200)
      expect(response.body.length).toBeGreaterThan(0) // Ensure at least one result

      // console.log("Response Body:", JSON.stringify(response.body, null, 2))

      const result = response.body[0] // Get first result
      expect(result).toHaveProperty("applicationRoles")
      expect(result).toHaveProperty("entityTypes")
      expect(Array.isArray(result.applicationRoles)).toBe(true) // applicationRoles must be an array
      expect(Array.isArray(result.entityTypes)).toBe(true) // entityTypes must be an array
      expect(result.applicationRoles.length).toBeGreaterThan(0)
      expect(result.entityTypes.length).toBeGreaterThan(0)

      // Validate Application Role structure
      expect(result.applicationRoles.length).toEqual(1)
      expect(result.applicationRoles.some(ar => ar.id === applicationRole.id)).toBe(true)

      // Validate Entity Type structure
      expect(result.entityTypes.length).toEqual(2)
      // Is entityType1 present?
      expect(result.entityTypes.some(entityType => entityType.id === entityType1.id)).toBe(true)
      // Is entityType2 present?
      expect(result.entityTypes.some(entityType => entityType.id === entityType2.id)).toBe(true)
    })

    it("should return 400 Bad Request if functionalRoleIds is missing", async () => {
      const response = await request(app)
        .post("/api/functionalRoleDomains/getAccessRights")
        .send({})

      expect(response.status).toBe(400)
      expect(response.body.error).toBe("functionalRoleIds must be a non-empty array")
    })

    it("should return 400 Bad Request if functionalRoleIds is not an array", async () => {
      const response = await request(app)
        .post("/api/functionalRoleDomains/getAccessRights")
        .send({ functionalRoleIds: "not-an-array" })

      expect(response.status).toBe(400)
      expect(response.body.error).toBe("functionalRoleIds must be a non-empty array")
    })

    it("should return an empty array if no associations exist", async () => {
      const newFunctionalRole = await FunctionalRole.create({ name: "Guest" })

      const response = await request(app)
        .post("/api/functionalRoleDomains/getAccessRights")
        .send({ functionalRoleIds: [newFunctionalRole.id] })

      expect(response.status).toBe(200)
      expect(response.body).toEqual([]) // ✅ Expect empty array
    })
  })
})
