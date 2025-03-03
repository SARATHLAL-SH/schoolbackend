const { Op } = require("sequelize");
const Student = require("../../modals/Student"); // Adjust the path as needed
const FeeTable = require("../../modals/FeeTable");

const generateMonthlyFees = async () => {
  try {
    const students = await Student.findAll(); // Get all students

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    for (const student of students) {
      const admissionDate = new Date(student.admissionDate);
      let month = admissionDate.getMonth() + 1;
      let year = admissionDate.getFullYear();

      while (year < currentYear || (year === currentYear && month <= currentMonth)) {
        // Check if fee record already exists
        const existingFee = await FeeTable.findOne({
          where: {
            StudentId: student.id,
            date: new Date(year, month - 1, 1), // First day of the month
          },
        });

        if (!existingFee) {
          let due = 0;
          let credit = 0;
          
          // Fetch previous month's fee record
          const lastMonthFee = await FeeTable.findOne({
            where: {
              StudentId: student.id,
              date: { [Op.lt]: new Date(year, month - 1, 1) },
            },
            order: [["date", "DESC"]],
          });

          if (lastMonthFee) {
            due = lastMonthFee.due;
            credit = lastMonthFee.credit;
          }

          // Calculate total fee for the month
          let total = student.monthlyFee + due;

          // If credit is available, deduct it
          if (credit >= total) {
            credit -= total;
            total = 0;
          } else {
            total -= credit;
            credit = 0;
          }

          // Insert the new fee record
          await FeeTable.create({
            StudentId: student.id,
            date: new Date(year, month - 1, 1), // First day of the month
            title: `Monthly Fee for ${new Date(year, month - 1).toLocaleString('default', { month: 'long' })}`,
            amountPaid: 0,
            lateFee: 0,
            recieved: "",
            total: total,
            discount: 0,
            due: total, // Initially, due = total
            credit: credit,
            status: "Unpaid",
            type: "Monthly Fee",
          });
        }

        // Move to the next month
        month++;
        if (month > 12) {
          month = 1;
          year++;
        }
      }
    }
  } catch (error) {
    console.error("Error generating monthly fees:", error);
  }
};

// Run this function at the beginning of every month (Use cron job)
generateMonthlyFees();
