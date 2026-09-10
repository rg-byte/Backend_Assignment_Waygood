import connectDatabase from "../config/database.js";
import Application from "../models/Application.js";
import Program from "../models/Program.js";
import Student from "../models/Student.js";
import University from "../models/University.js";
import seedData from "../data/seedData.js";

async function seed() {
  await connectDatabase();

  await Promise.all([
    Application.deleteMany({}),
    Program.deleteMany({}),
    Student.deleteMany({}),
    University.deleteMany({}),
  ]);

  const universities = await University.insertMany(seedData.universities);

  const universityByName = universities.reduce((accumulator, university) => {
    accumulator[university.name] = university;
    return accumulator;
  }, {});

  const programs = await Program.insertMany(
    seedData.programs.map((program) => ({
      ...program,
      university: universityByName[program.universityName]._id,
    }))
  );

  const programByTitle = programs.reduce((accumulator, program) => {
    accumulator[program.title] = program;
    return accumulator;
  }, {});

  const students = await Student.create(seedData.students);

  const studentByEmail = students.reduce((accumulator, student) => {
    accumulator[student.email] = student;
    return accumulator;
  }, {});

  const applicationsToCreate = seedData.applications.map((applicationSeed) => {
    const student = studentByEmail[applicationSeed.studentEmail];
    const program = programByTitle[applicationSeed.programTitle];

    if (!student) {
      throw new Error(
        `Seed error: no student found with email "${applicationSeed.studentEmail}".`
      );
    }

    if (!program) {
      throw new Error(
        `Seed error: no program found with title "${applicationSeed.programTitle}".`
      );
    }

    return {
      student: student._id,
      program: program._id,
      university: program.university,
      intake: applicationSeed.intake,
      status: applicationSeed.status,
      timeline: applicationSeed.timeline.map((entry) => ({
        status: entry.status,
        note: entry.note,
      })),
    };
  });

  await Application.insertMany(applicationsToCreate);

  console.log(
    `Seeded ${universities.length} universities, ${programs.length} programs, ${students.length} students, ${applicationsToCreate.length} applications.`
  );
}

seed()
  .then(() => {
    console.log("Database seeded successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });