// Finance GraphQL Queries and Mutations

export const FEE_QUERIES = {
	BY_SCHOOL: `
    query FeesBySchool($schoolId: String!) {
      fees(schoolId: $schoolId) {
        id
        schoolId
        feeName
        description
        amount
        currency
        gradeLevel
        academicYear
        dueDate
        isMandatory
        formattedAmount
        isAllGrades
        createdAt
        updatedAt
      }
    }
  `,

	GET_BY_ID: `
    query GetFee($id: String!) {
      fee(id: $id) {
        id
        schoolId
        feeName
        description
        amount
        currency
        gradeLevel
        academicYear
        dueDate
        isMandatory
        formattedAmount
        isAllGrades
        createdAt
        updatedAt
      }
    }
  `,
};

export const PAYMENT_QUERIES = {
	BY_SCHOOL: `
    query PaymentsBySchool($schoolId: String!, $filters: PaymentFilters) {
      payments(schoolId: $schoolId, filters: $filters) {
        id
        schoolId
        studentId
        feeId
        amountPaid
        currency
        paymentMethod
        paymentMethodLabel
        paymentDate
        receiptNumber
        status
        remarks
        formattedAmount
        createdAt
        updatedAt
      }
    }
  `,

	BY_STUDENT: `
    query PaymentsByStudent($studentId: String!) {
      paymentsByStudent(studentId: $studentId) {
        id
        schoolId
        studentId
        feeId
        amountPaid
        currency
        paymentMethod
        paymentMethodLabel
        paymentDate
        receiptNumber
        status
        remarks
        formattedAmount
        createdAt
        updatedAt
      }
    }
  `,
};

export const INVOICE_QUERIES = {
	BY_SCHOOL: `
    query InvoicesBySchool($schoolId: String!, $filters: InvoiceFilters) {
      invoices(schoolId: $schoolId, filters: $filters) {
        id
        schoolId
        invoiceNumber
        studentId
        feeIds
        totalAmount
        amountPaid
        balance
        currency
        issueDate
        dueDate
        status
        formattedTotal
        formattedBalance
        paymentPercentage
        isOverdue
        createdAt
        updatedAt
      }
    }
  `,
};

export const FINANCE_QUERIES = {
	SUMMARY: `
    query FinanceSummary($schoolId: String!) {
      financeSummary(schoolId: $schoolId) {
        totalCollected
        totalPending
        totalOverdue
        currency
        studentsWithBalance
        totalStudents
        collectionRate
      }
    }
  `,
};

export const FEE_MUTATIONS = {
	CREATE: `
    mutation CreateFee($input: CreateFeeInput!) {
      createFee(input: $input) {
        id
        feeName
        amount
        currency
        gradeLevel
        academicYear
        dueDate
        isMandatory
      }
    }
  `,

	UPDATE: `
    mutation UpdateFee($id: String!, $input: UpdateFeeInput!) {
      updateFee(id: $id, input: $input) {
        id
        feeName
        amount
        currency
        gradeLevel
        academicYear
        dueDate
        isMandatory
      }
    }
  `,

	DELETE: `
    mutation DeleteFee($id: String!) {
      deleteFee(id: $id)
    }
  `,
};

export const PAYMENT_MUTATIONS = {
	RECORD: `
    mutation RecordPayment($input: CreatePaymentInput!) {
      recordPayment(input: $input) {
        id
        studentId
        feeId
        amountPaid
        currency
        paymentMethod
        paymentDate
        receiptNumber
        status
      }
    }
  `,
};

export const INVOICE_MUTATIONS = {
	GENERATE: `
    mutation GenerateInvoice($input: CreateInvoiceInput!) {
      generateInvoice(input: $input) {
        id
        invoiceNumber
        studentId
        totalAmount
        balance
        status
      }
    }
  `,

	UPDATE_STATUS: `
    mutation UpdateInvoiceStatus($id: String!, $status: String!) {
      updateInvoiceStatus(id: $id, status: $status) {
        id
        status
      }
    }
  `,
};
