// Student GraphQL Queries and Mutations

export const STUDENT_QUERIES = {
	GET_ALL: `
    query GetStudents {
      students {
        id
        schoolId
        studentId
        firstName
        lastName
        firstNameKm
        lastNameKm
        gradeLevel
        status
        fullName
        age
      }
    }
  `,

	GET_BY_ID: `
    query GetStudent($id: String!) {
      student(id: $id) {
        id
        schoolId
        studentId
        firstName
        lastName
        firstNameKm
        lastNameKm
        dateOfBirth {
          day
          month
          year
        }
        gender
        gradeLevel
        status
        fullName
        fullNameKm
        age
        guardians {
          firstName
          lastName
          relationship
          phone
          email
          isPrimary
        }
        enrollment {
          enrollmentDate
          enrollmentType
          entryGrade
        }
        healthInfo {
          bloodType
          allergies
          medicalConditions
        }
      }
    }
  `,

	BY_SCHOOL: `
    query StudentsBySchool($schoolId: String!) {
      studentsBySchool(schoolId: $schoolId) {
        id
        studentId
        firstName
        lastName
        gradeLevel
        status
        fullName
      }
    }
  `,

	BY_CLASS: `
    query StudentsByClass($classId: String!) {
      studentsByClass(classId: $classId) {
        id
        studentId
        firstName
        lastName
        fullName
        status
      }
    }
  `,
};

export const STUDENT_MUTATIONS = {
	CREATE: `
    mutation CreateStudent($input: CreateStudentInput!) {
      createStudent(input: $input) {
        id
        schoolId
        studentId
        firstName
        lastName
        gradeLevel
        status
      }
    }
  `,

	UPDATE: `
    mutation UpdateStudent($id: String!, $input: UpdateStudentInput!) {
      updateStudent(id: $id, input: $input) {
        id
        firstName
        lastName
        gradeLevel
        status
      }
    }
  `,

	DELETE: `
    mutation DeleteStudent($id: String!) {
      deleteStudent(id: $id)
    }
  `,
};
