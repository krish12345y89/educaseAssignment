import express from "express";
import supertest from "supertest";
import SchoolController from "../controllers/schoolController.js"; // Import SchoolController

const mockDb = {
  query: jest.fn(),
};

const app = express();
app.use(express.json());

const schoolController = new SchoolController(mockDb);

app.post("/api/addSchool", schoolController.addSchool);
app.get("/api/listSchools", schoolController.listSchools);

const request = supertest(app);

describe("SchoolController Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/addSchool", () => {
    it("should add a school successfully", async () => {
      // Mock the database response as a Promise
      mockDb.query.mockResolvedValue([{ insertId: 1 }]);

      const response = await request.post("/api/addSchool").send({
        name: "Test School",
        address: "123 Test Street",
        latitude: 40.7128,
        longitude: -74.006,
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        "message",
        "School added successfully"
      );
      expect(response.body).toHaveProperty("schoolId", 1);
      expect(mockDb.query).toHaveBeenCalledWith(
        "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
        ["Test School", "123 Test Street", 40.7128, -74.006]
      );
    });
  });

  describe("GET /api/listSchools", () => {
    it("should list schools sorted by distance", async () => {
      // Mock database response with an array as the first element
      mockDb.query.mockResolvedValue([
        [
          { id: 1, name: "School A", latitude: 40.7127, longitude: -74.0059 },
          { id: 2, name: "School B", latitude: 40.7126, longitude: -74.0058 },
        ],
      ]);

      const response = await request.get("/api/listSchools").query({
        latitude: 40.7128,
        longitude: -74.006,
      });

      expect(response.status).toBe(200);
      expect(response.body.schools).toHaveLength(2);
      expect(response.body.schools[0].name).toBe("School A"); // Closest school
      expect(response.body.schools[1].name).toBe("School B");

      expect(mockDb.query).toHaveBeenCalledWith("SELECT * FROM schools");
    });
  });
});
