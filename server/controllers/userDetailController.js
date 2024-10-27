import bcrypt from 'bcrypt';
import Client from '../config/dbConn.js';
import responseCode from '../config/responseCode.js';
import { config } from 'dotenv';
config();
export const userDetailController = async (req, res) => {
    try {
        const { email } = req.body;
        if (email.includes("@stu.manit.ac.in")) {
            let response = await Client.query('SELECT * FROM student WHERE email = $1', [email])
            return res.send(response.rows[0]);
        }
        let response = await Client.query('SELECT * FROM professor WHERE email = $1', [email])
        return res.send(response.rows[0]);

    }
    catch (err) {

    }
};
