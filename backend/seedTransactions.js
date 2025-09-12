const { faker } = require('@faker-js/faker');

const categories = require("./seedCategories"); // the array above

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const transactions = [];

for (let i = 0; i < 50; i++) {
  // Randomly pick a category
  const category = categories[Math.floor(Math.random() * categories.length)];

  transactions.push({
    type: category.type === "both" ? (Math.random() < 0.5 ? "income" : "expense") : category.type,
    amount: parseFloat((Math.random() * 2000 + 50).toFixed(2)), // 50 - 2050
    description: faker.lorem.sentence(),
    category: category.name,
    date: randomDate(new Date("2025-01-01"), new Date()),
    notes: faker.lorem.words(5),
  });
}

module.exports = transactions;
