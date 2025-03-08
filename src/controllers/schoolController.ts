import { Request, Response, NextFunction } from "express";

class SchoolController {
    private db: any;

    constructor(db: any) {
        this.db = db;
    }

    public addSchool = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, address, latitude, longitude } = req.body;
            const query = "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
            const [result] = await this.db.query(query, [name, address, latitude, longitude]);

            res.status(201).json({ message: "School added successfully", schoolId: result.insertId });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error adding school" });
        }
    };

    public listSchools = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
        try {
            const { latitude, longitude } = req.query;
            if (!latitude || !longitude) {
                return res.status(400).json({ error: "Latitude and longitude required" });
            }

            const query = "SELECT * FROM schools";
            const [schools] = await this.db.query(query);

            const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
                const R = 6371; // Radius of Earth in km
                const dLat = (lat2 - lat1) * (Math.PI / 180);
                const dLon = (lon2 - lon1) * (Math.PI / 180);
                const a =
                    Math.sin(dLat / 2) ** 2 +
                    Math.cos(lat1 * (Math.PI / 180)) *
                        Math.cos(lat2 * (Math.PI / 180)) *
                        Math.sin(dLon / 2) ** 2;
                return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            };

            const lat = parseFloat(latitude as string);
            const lon = parseFloat(longitude as string);

            const sortedSchools = (schools as any[]).map((school) => ({
                ...school,
                distance: haversine(lat, lon, school.latitude, school.longitude),
            })).sort((a, b) => a.distance - b.distance);

            res.status(200).json({ schools: sortedSchools });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error fetching schools" });
        }
    };

    public getAllSchools = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = "SELECT * FROM schools";
            const [schools] = await this.db.query(query);
            res.status(200).json({ schools });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error fetching schools" });
        }
    };
}

export default SchoolController;
