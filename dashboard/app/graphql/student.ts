// Student GraphQL Queries and Mutations

export const STUDENT_QUERIES = {
	GET_ALL: `
    query GetStudents {
      students {
        id
        schoolId
        studentId
        firstNameKm
        lastNameKm
        firstNameEn
        lastNameEn
        gradeLevel
        status
        fullName
        age
        contact {
          email
          phone
        }
      }
    }
  `,

	GET_BY_ID: `
    query GetStudent($id: String!) {
      student(id: $id) {
        id
        schoolId
        studentId
        firstNameKm
        lastNameKm
        firstNameEn
        lastNameEn
        dateOfBirth {
          day
          month
          year
        }
        gender
        gradeLevel
        status
        fullName
        fullNameEn
        age
        guardians {
          name
          relationship
          phone
          email
          isEmergencyContact
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
        nationalId
        firstNameKm
        lastNameKm
        firstNameEn
        lastNameEn
        dateOfBirth {
          day
          month
          year
        }
        gradeLevel
        gender
        status
        fullName
        nationality
        religion
        contact {
          email
          phone
          address {
            province
          }
        }
        guardians {
          name
          relationship
          phone
          email
          isEmergencyContact
        }
      }
    }
  `,

	BY_CLASS: `
    query StudentsByClass($classId: String!) {
      studentsByClass(classId: $classId) {
        id
        studentId
        firstNameKm
        lastNameKm
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
        firstNameKm
        lastNameKm
        gradeLevel
        status
      }
    }
  `,

	UPDATE: `
    mutation UpdateStudent($id: String!, $input: UpdateStudentInput!) {
      updateStudent(id: $id, input: $input) {
        id
        firstNameKm
        lastNameKm
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
