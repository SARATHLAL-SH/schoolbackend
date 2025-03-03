const sequelize = require("../sequelize");
const { Sequelize, DataTypes } = require("sequelize");

const FeeTable = sequelize.define(
  "FeeTable",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    StudentId: {
      type: DataTypes.INTEGER,
      references: {
        model: "studentdetails",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW,
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amountPaid: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
    },
    lateFee: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
    },
    recieved: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "NA",
    },
    total: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
    },
    discount: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
    },
    due: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
    },
    credit: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
    },
    advance: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Unpaid",
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Monthly",
    },
  },
  {
    tableName: "feeTable",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["StudentId", "month"], // Ensures that (StudentId, month) is unique
      },
    ],
  }
);

//
FeeTable.beforeCreate(async (fee) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const { Student } = require("../modals");

  // Fetch the student's details
  const student = await Student.findByPk(fee.StudentId);
  if (!student) {
    throw new Error(`Student with ID ${fee.StudentId} not found.`);
  }

  // Get the student's admission date
  let admissionDate = student.admissionDate;

  // If admissionDate is a string, parse it into a Date object
  if (typeof admissionDate === "string") {
    admissionDate = new Date(admissionDate);
  }

  // Ensure admissionDate is a valid Date object
  if (!(admissionDate instanceof Date) || isNaN(admissionDate)) {
    throw new Error(
      `Invalid admission date for student with ID ${fee.StudentId}.`
    );
  }

  // Calculate the number of months since admission
  const currentDate = new Date();
  const admissionMonth = admissionDate.getMonth() + 1; // getMonth() returns 0-11
  const currentMonth = currentDate.getMonth() + 1;
  const admissionYear = admissionDate.getFullYear();
  const currentYear = currentDate.getFullYear();

  const monthsSinceAdmission =
    (currentYear - admissionYear) * 12 + (currentMonth - admissionMonth);

  // Determine the month value for the fee record
  const existingFeeRecords = await FeeTable.findAll({
    where: { StudentId: fee.StudentId },
    order: [["month", "ASC"]],
  });

  if (existingFeeRecords.length === 0) {
    // First fee record: Use the admission month
    fee.month = admissionMonth;
    fee.due = 0;
    fee.credit = 0;
  } else {
    // Subsequent fee records: Increment the month value
    const lastFeeRecord = existingFeeRecords[existingFeeRecords.length - 1];
    fee.month = lastFeeRecord.month + 1;
    fee.due = lastFeeRecord.due;
    fee.credit = lastFeeRecord.credit;
  }

  // Set the title dynamically if not provided
  if (!fee.title && fee.month >= 1 && fee.month <= 12) {
    fee.title = `Monthly Fee of ${monthNames[fee.month - 1]}`;
  }

  // Set default values for other fields
  fee.total = student.monthlyFee || 0;
  fee.amountPaid = fee.amountPaid || 0;
  fee.discount = fee.discount || 0;
  // fee.credit = Math.max(
  //   fee.amountPaid - fee.total - fee.discount - fee.lateFee,
  //   0
  // );
});

FeeTable.beforeUpdate(async (fee, options) => {
  const { Student } = require("../modals");

  // Fetch the associated student
  const student = await Student.findByPk(fee.StudentId);
  if (!student) {
    throw new Error(`Student with ID ${fee.StudentId} not found.`);
  }

  // Fetch all fee records for the student, sorted by month
  let fees = await FeeTable.findAll({
    where: { StudentId: fee.StudentId },
    order: [["month", "ASC"]],
  });

  if (!fees.length) {
    throw new Error(`No fee records found for student ID ${fee.StudentId}`);
  }

  function updateDues(data, paymentMonth, amountPaid, advance) {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    // Iterate through the fee records and update the due amounts
    for (let i = 0; i < data.length; i++) {
      if (data[i].month === paymentMonth) {
        console.log("advance 0");
        if (advance > 0) {
          console.log("advance 1");
          console.log(
            data[i].amountPaid,
            "+",
            advance,
            "+",
            data[i].credit,
            "+",
            data[i].discount,
            "-",
            data[i].total,
            "+",
            data[i].lateFee,
            "+",
            data[i].due
          );
          let checkAdvance =
            data[i].amountPaid +
            advance +
            data[i].credit +
            data[i].discount -
            (data[i].total + data[i].lateFee + data[i].due);
          console.log("=", checkAdvance);
          if (currentMonth === paymentMonth) {
            console.log("advance 2");
            if (checkAdvance <= 0) {
              console.log("advance 3");
              data[i].due = checkAdvance;
              data[i].advance = 0;
              data[i].credit = 0;
            } else {
              console.log("advance 4");
              data[i].due = 0;
              data[i].advance = checkAdvance;
              data[i].credit = 0;
            }
          } else {
            console.log("advance 5");
            if (checkAdvance <= 0) {
              console.log("advance 6");

              data[i].due =
                data[i].total +
                data[i].lateFee +
                data[i].due -
                (data[i].amountPaid +
                  advance +
                  data[i].credit +
                  data[i].discount);

              console.log("amountpaid", data[i].amountPaid);
              console.log("advance", advance);
              data[i].amountPaid = advance;
              console.log("amountpaid", data[i].amountPaid);
              data[i].credit = 0;
              data[i].advance = 0;
              data[i].status = "Paid";
            } else {
              console.log("advance 7");

              while (checkAdvance > 0 && i < data.length) {
                console.log("advance 8");

                if (checkAdvance >= data[i].total) {
                  console.log("advance 9");

                  // Fully pay the current row
                  data[i].amountPaid = data[i].total;
                  checkAdvance -= data[i].total;
                  console.log("checkkAdvance 2", checkAdvance);
                  data[i].due = 0;
                  data[i].status = "Paid";

                  if (i + 1 < data.length) {
                    console.log("advance 10>");
                    data[i].credit = 0;
                    data[i].advance = 0;

                    // Apply remaining checkAdvance to the next row
                    if (checkAdvance >= data[i + 1].total) {
                      data[i + 1].amountPaid = data[i + 1].total;
                      data[i + 1].credit = checkAdvance - data[i + 1].total;
                      checkAdvance -= data[i + 1].total;
                      console.log("checkkAdvance 3", checkAdvance);
                      data[i + 1].status = "Paid";
                    } else {
                      data[i + 1].amountPaid = checkAdvance;
                      data[i + 1].due -= checkAdvance;
                      checkAdvance = 0;
                    }
                  }
                } else {
                  // Partially pay current row
                  data[i].amountPaid += checkAdvance;
                  data[i].due -= checkAdvance;
                  checkAdvance = 0;
                }

                i++;
              }
              if (checkAdvance > 0) {
                data[i - 1].credit = checkAdvance;
                checkAdvance = 0;
              }
            }
          }
        } else {
          if (amountPaid < data[i].total) {
            // Update the due for the current month
            console.log("step 11");
            if (data[i - 1]) {
              console.log("step 12");
              const prevDue = data[i - 1].due || 0;
              const prevCredit = data[i - 1].credit || 0;
              if (prevDue > 0) {
                console.log("step 13");
                data[i].due =
                  prevDue +
                  data[i].total +
                  fee.lateFee -
                  (amountPaid + fee.discount);
              } else {
                console.log("step 14");
                const currentPay =
                  prevCredit +
                  amountPaid +
                  fee.discount -
                  (data[i].total + fee.lateFee);
                //if credit
                if (currentPay > 0) {
                  console.log("step 15");
                  data[i].due = 0;
                  data[i].credit = currentPay;
                  if (data[i + 1]) {
                    console.log("step 16");
                    data[i + 1].credit = currentPay;
                  }
                } else {
                  //if due
                  console.log("step 17");
                  data[i].due =
                    data[i].total +
                    fee.lateFee -
                    (prevCredit + amountPaid + fee.discount);
                  data[i].credit = 0;
                }
              }
            } else {
              // no prevdata
              console.log("is it here");
              console.log(
                data[i].total,
                "+",
                fee.lateFee,
                "+",
                amountPaid,
                "+",
                fee.discount
              );
              console.log(
                data[i].total + fee.lateFee - (amountPaid + fee.discount)
              );
              data[i].due =
                data[i].total + fee.lateFee - (amountPaid + fee.discount);
              data[i].credit = 0;
            }
            if (data[i + 1]) {
              console.log("why here");

              data[i + 1].due = data[i].due || 0;
              data[i + 1].credit = 0;
            }
            //
            //
          } else {
            console.log("paid amount greater than total===========>");

            // data[i].due = 0;
            //if prev data is available
            if (data[i - 1]) {
              console.log("step 1");

              if (data[i - 1].due > 0) {
                console.log("step 2");
                const currentDue =
                  data[i - 1].due +
                  data[i].total +
                  fee.lateFee -
                  (amountPaid + fee.discount);
                if (currentDue > 0) {
                  console.log("step 3");
                  data[i].credit = 0;
                  data[i].due = currentDue;
                } else {
                  console.log("step 4");
                  data[i].credit =
                    amountPaid +
                    fee.discount -
                    (data[i - 1].due + data[i].total + fee.lateFee);
                  data[i].due = 0;
                }
              } else {
                console.log("step 5");
                const currentCredit =
                  data[i - 1].credit +
                  amountPaid +
                  fee.discount -
                  (data[i].total + fee.lateFee);
                if (currentCredit > 0) {
                  console.log("step 6");
                  data[i].credit = currentCredit;
                  data[i].due = 0;
                } else {
                  console.log("step 7");
                  data[i].credit = 0;
                  data[i].due =
                    data[i].total +
                    fee.lateFee -
                    (data[i - 1].credit + amountPaid + fee.discount);
                }
              }
            } else {
              // if prev data is not available
              console.log("step 8");
              // data[i].credit = (amountPaid + fee.discount) - (data[i].total + fee.lateFee);
              if (data[i + 1]) {
                console.log("step 9");
                data[i].credit =
                  amountPaid + fee.discount - (data[i].total + fee.lateFee);
                data[i + 1].credit =
                  amountPaid + fee.discount - (data[i].total + fee.lateFee);
                data[i + 1].due = 0;
                data[i].due = 0;
              } else {
                console.log("step 10");
                data[i].credit =
                  amountPaid + fee.discount - (data[i].total + fee.lateFee);
                data[i].due = 0;
              }
            }
          }
        }
      }
    }

    return data;
  }

  // Update the dues array
  let updatedFees = updateDues(fees, fee.month, fee.amountPaid, fee.advance);

  await Promise.all(
    updatedFees.map(async (updatedFee) => {
      await FeeTable.update(
        {
          due: Math.max(updatedFee.due, 0),
          credit: updatedFee.credit,
          lateFee: updatedFee.lateFee,
          advance: updatedFee.advance,
          amountPaid: updatedFee.amountPaid,
          status: updatedFee.status,
        },
        { where: { id: updatedFee.id } }
      );
    })
  );

  console.log("All fee records updated successfully.");
});

module.exports = FeeTable;
