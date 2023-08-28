'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('allcode', [{
      key: '123',
      type : '123456',
      valueEn: 'Thanh',
      valueVi: 'Truong',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
   //Cancel thêm dữ liệu(khái Gniệm rollback)
  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
