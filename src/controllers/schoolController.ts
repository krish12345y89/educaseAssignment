import { Request, Response, NextFunction } from 'express';
import { ErrorSend } from '../utils/errorHandle.js';

class SchoolController {
    private db: any;

    constructor(db: any) {
        this.db = db;
    }

    public addSchool = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, address, latitude, longitude } = req.body;
            console.log(this.db)
            const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
            const [result] = await this.db.query(query, [name, address, latitude, longitude]);
            res.status(201).json({
                message: 'School added successfully',
                schoolId: result.insertId,
            });
        } catch (err: any) {
            console.error(err);
            next(new ErrorSend('Error adding school', 500, false, true));
        }
    };

    public listSchools = async (req: Request, res: Response, next: NextFunction) => {
        const { latitude, longitude } = req.query;
        const query = 'SELECT * FROM schools';

        try {
            const [schools] = await this.db.query(query);
            const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
                const R = 6371; // Earth's radius in km
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

            const sortedSchools = schools.map((school: any) => ({
                ...school,
                distance: haversine(lat, lon, school.latitude, school.longitude),
            })).sort((a: any, b: any) => a.distance - b.distance);

            res.status(200).json({ schools: sortedSchools });
        } catch (err: any) {
            console.error(err);
            next(new ErrorSend('Error fetching schools', 500, false, true));
        }
    };

    public getAllSchools = async (req: Request, res: Response, next: NextFunction) => {
        const query = 'SELECT * FROM schools';

        try {
            const [schools] = await this.db.query(query);
            res.status(200).json({ schools });
        } catch (err: any) {
            console.error(err);
            next(new ErrorSend('Error fetching schools', 500, false, true));
        }
    };
}

export default SchoolController;
