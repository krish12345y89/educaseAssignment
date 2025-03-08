class SchoolController {
    constructor(db) {
        this.addSchool = async (req, res, next) => {
            try {
                const { name, address, latitude, longitude } = req.body;
                const query = "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
                const [result] = await this.db.query(query, [name, address, latitude, longitude]);
                res.status(201).json({ message: "School added successfully", schoolId: result.insertId });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: "Error adding school" });
            }
        };
        this.listSchools = async (req, res, next) => {
            try {
                const { latitude, longitude } = req.query;
                if (!latitude || !longitude) {
                    return res.status(400).json({ error: "Latitude and longitude required" });
                }
                const query = "SELECT * FROM schools";
                const [schools] = await this.db.query(query);
                const haversine = (lat1, lon1, lat2, lon2) => {
                    const R = 6371; // Radius of Earth in km
                    const dLat = (lat2 - lat1) * (Math.PI / 180);
                    const dLon = (lon2 - lon1) * (Math.PI / 180);
                    const a = Math.sin(dLat / 2) ** 2 +
                        Math.cos(lat1 * (Math.PI / 180)) *
                            Math.cos(lat2 * (Math.PI / 180)) *
                            Math.sin(dLon / 2) ** 2;
                    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                };
                const lat = parseFloat(latitude);
                const lon = parseFloat(longitude);
                const sortedSchools = schools.map((school) => ({
                    ...school,
                    distance: haversine(lat, lon, school.latitude, school.longitude),
                })).sort((a, b) => a.distance - b.distance);
                res.status(200).json({ schools: sortedSchools });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: "Error fetching schools" });
            }
        };
        this.getAllSchools = async (req, res, next) => {
            try {
                const query = "SELECT * FROM schools";
                const [schools] = await this.db.query(query);
                res.status(200).json({ schools });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: "Error fetching schools" });
            }
        };
        this.db = db;
    }
}
export default SchoolController;
