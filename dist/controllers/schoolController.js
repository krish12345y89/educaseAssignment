import { ErrorSend } from '../utils/errorHandle.js';
class SchoolController {
    constructor(db) {
        this.addSchool = async (req, res, next) => {
            try {
                const { name, address, latitude, longitude } = req.body;
                console.log(this.db);
                const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
                const [result] = await this.db.query(query, [name, address, latitude, longitude]);
                res.status(201).json({
                    message: 'School added successfully',
                    schoolId: result.insertId,
                });
            }
            catch (err) {
                console.error(err);
                next(new ErrorSend('Error adding school', 500, false, true));
            }
        };
        this.listSchools = async (req, res, next) => {
            const { latitude, longitude } = req.query;
            const query = 'SELECT * FROM schools';
            try {
                const [schools] = await this.db.query(query);
                const haversine = (lat1, lon1, lat2, lon2) => {
                    const R = 6371; // Earth's radius in km
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
                next(new ErrorSend('Error fetching schools', 500, false, true));
            }
        };
        this.getAllSchools = async (req, res, next) => {
            const query = 'SELECT * FROM schools';
            try {
                const [schools] = await this.db.query(query);
                res.status(200).json({ schools });
            }
            catch (err) {
                console.error(err);
                next(new ErrorSend('Error fetching schools', 500, false, true));
            }
        };
        this.db = db;
    }
}
export default SchoolController;
