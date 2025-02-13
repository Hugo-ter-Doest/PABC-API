const request = require("supertest");
const { app } = require("../../server"); // Ensure this path is correct
const { FunctionalRole, Domain, FunctionalRoleDomain } = require("../../models/associations");
require("./setupTestDB");

describe("Functional Role-Domain Associations API", () => {
  let functionalRole, domain;

  describe("POST /api/functionalRoleDomains", () => {
    it("should create an association between a Functional Role and a Domain", async () => {
      functionalRole = await FunctionalRole.create({ name: "Admin" });
      domain = await Domain.create({ name: "Finance" });
      const response = await request(app)
      .post("/api/functionalRoleDomains")
      .send({ functionalRoleId: functionalRole.id, domainId: domain.id });

      // console.log("Response Body:", response.body); // ✅ Add this to debug

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.functionalRoleId).toBe(functionalRole.id); // ✅ Fixes undefined error
      expect(response.body.domainId).toBe(domain.id);

      // Verify database entry
      const association = await FunctionalRoleDomain.findOne({
        where: { FunctionalRoleId: functionalRole.id, DomainId: domain.id },
      });

      expect(association).not.toBeNull();
      expect(association.FunctionalRoleId).toBe(functionalRole.id);
      expect(association.DomainId).toBe(domain.id);
    });

    it("should prevent duplicate associations", async () => {
      const response = await request(app)
        .post(`/api/functionalRoleDomains`)
        .send({ functionalRoleId: functionalRole.id, domainId: domain.id });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Functional Role is already assigned to this Domain");
    });

    it("should return an error if Functional Role or Domain does not exist", async () => {
      const nonexistsingUUID = "11111111-2222-3333-4444-555555555555"
      const response = await request(app)
        .post(`/api/functionalRoleDomains`)
        .send({ functionalRoleId: nonexistsingUUID, domainId: nonexistsingUUID });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Functional Role or Domain not found");
    });
  });

  describe("GET /api/functionalRoleDomains", () => {
    it("should retrieve all Functional Role-Domain associations", async () => {
      const response = await request(app).get(`/api/functionalRoleDomains`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty("FunctionalRoleId", functionalRole.id);
      expect(response.body[0]).toHaveProperty("DomainId", domain.id);
    });
  });
});
