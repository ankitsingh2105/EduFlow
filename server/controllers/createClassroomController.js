<<<<<<< HEAD
import bcrypt from 'bcrypt';
import Client from '../config/dbConn.js'; // Assuming you've already set up a PostgreSQL client
import responseCode from '../config/responseCode.js';
import { config } from 'dotenv';
config();

export const createClassroomHandler = async (req, res) => {
    try {
        const { professor_name, department, course, year, isIndividual, class_id, subject_name } = req.body;

        // Validate input fields
        if (!professor_name || !department || !course || !year || isIndividual === undefined || !class_id || !subject_name) {
            return res.status(400).json({ msg: 'All fields are required.' });
        }

        // Insert classroom into the database
        const query = `
            INSERT INTO classroom (professor_name, department, course, year, isIndividual, class_id, subject_name)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;

        const values = [
            professor_name,
            department,
            course,
            year,
            isIndividual,
            class_id,
            subject_name
        ];

        // Execute the query to insert the classroom
        await Client.query(query, values);

        // Now update students' class_id who match department, course, and year
        const updateStudentQuery = `
            UPDATE student
            SET class_id = array_append(class_id, $1) 
            WHERE department = ANY($2)
              AND enrolled_course = ANY($3)
              AND current_year = ANY($4)
        `;

        const updateValues = [
            class_id, // New classroom's ID
            department, // Department array
            course, // Course array
            year // Year array
        ];

        // Execute the query to update students
        await Client.query(updateStudentQuery, updateValues);

        return res.status(200).json({ msg: 'Classroom created and students updated successfully.' });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
=======
import bcrypt from "bcrypt";
import Client from "../config/dbConn.js"; // PostgreSQL client
import responseCode from "../config/responseCode.js";
import { config } from "dotenv";
config();

// Function to generate class ID
const generateClassId = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const milliseconds = String(currentDate.getMilliseconds()).padStart(3, "0");

  return `CLASS-${year}${month}${day}${milliseconds}`;
};

export const createClassroomHandler = async (req, res) => {
  try {
    const {
      email,
      department,
      course,
      year,
      isIndividual,
      subject_name,
    } = req.body;
    const class_id = generateClassId();

    if (!email || !department || !course || !year || isIndividual === undefined || !subject_name) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    const professorQuery = `
      SELECT fname, lname, class_id
      FROM professor
      WHERE email = $1
    `;
    const professorResult = await Client.query(professorQuery, [email]);

    if (professorResult.rows.length === 0) {
      return res.status(404).json({ msg: "Professor not found." });
    }

    const { fname, lname, class_id: professorClassIds } = professorResult.rows[0];
    const professor_name = `${fname} ${lname}`;

    const updatedProfessorClassIds = professorClassIds ? [...professorClassIds, class_id] : [class_id];

    const insertClassroomQuery = `
      INSERT INTO classroom (professor_name, department, course, year, isIndividual, class_id, subject_name)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    const classroomValues = [
      professor_name,
      department,
      course,
      year,
      isIndividual,
      class_id,
      subject_name,
    ];
    await Client.query(insertClassroomQuery, classroomValues);

    const updateStudentQuery = `
      UPDATE student
      SET class_id = array_append(class_id, $1)
      WHERE department = ANY($2)
        AND enrolled_course = ANY($3)
        AND current_year = ANY($4)
    `;
    const updateStudentValues = [class_id, department, course, year];
    await Client.query(updateStudentQuery, updateStudentValues);

    const updateProfessorQuery = `
      UPDATE professor
      SET class_id = $1
      WHERE email = $2
    `;
    await Client.query(updateProfessorQuery, [updatedProfessorClassIds, email]);

    return res.status(200).json({
      msg: "Classroom created and students updated successfully.",
      class_id,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
>>>>>>> e73594a2d3ade0c4c7f2c32547d6738bd23e6f4a
};
