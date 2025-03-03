// In FeeTable model
FeeTable.belongsTo(Student, {
    foreignKey: 'StudentId',
    as: 'student'
  });
  
  // In Student model
  Student.hasMany(FeeTable, {
    foreignKey: 'StudentId',
    as: 'feeRecords'
  });