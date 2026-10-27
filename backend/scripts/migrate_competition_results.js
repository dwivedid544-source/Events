require('dotenv').config();
const db = require('../db');

async function run() {
  try {
    console.log('🚀 Migrating CompetitionResult and EventEntry tables in MySQL...');

    // 1. Add checkInStatus and checkedInAt columns to EventEntry if not present
    try {
      await db.query("ALTER TABLE `EventEntry` ADD COLUMN `checkInStatus` VARCHAR(50) DEFAULT 'Not Arrived'");
      console.log('✅ Added checkInStatus column to EventEntry');
    } catch (e) {
      if (!e.message.includes('Duplicate column')) console.log('checkInStatus note:', e.message);
    }
    try {
      await db.query("ALTER TABLE `EventEntry` ADD COLUMN `checkedInAt` DATETIME DEFAULT NULL");
      console.log('✅ Added checkedInAt column to EventEntry');
    } catch (e) {
      if (!e.message.includes('Duplicate column')) console.log('checkedInAt note:', e.message);
    }

    // 2. Create CompetitionResult table
    await db.query(`
      CREATE TABLE IF NOT EXISTS \`CompetitionResult\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`eventId\` VARCHAR(191) DEFAULT NULL,
        \`eventName\` VARCHAR(191) NOT NULL,
        \`club\` VARCHAR(191) DEFAULT NULL,
        \`state\` VARCHAR(191) DEFAULT NULL,
        \`stateCode\` VARCHAR(10) DEFAULT NULL,
        \`placement\` VARCHAR(50) DEFAULT NULL,
        \`place\` INT DEFAULT 1,
        \`winnerDog\` VARCHAR(191) NOT NULL,
        \`winnerDogReg\` VARCHAR(191) DEFAULT NULL,
        \`breed\` VARCHAR(191) DEFAULT 'Coonhound',
        \`owner\` VARCHAR(191) DEFAULT NULL,
        \`participant\` VARCHAR(191) NOT NULL,
        \`score\` VARCHAR(50) DEFAULT '0 Pts',
        \`date\` VARCHAR(50) DEFAULT NULL,
        \`status\` VARCHAR(50) DEFAULT 'Published',
        \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX \`idx_results_event\` (\`eventId\`),
        INDEX \`idx_results_state\` (\`stateCode\`),
        INDEX \`idx_results_club\` (\`club\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);
    console.log('✅ CompetitionResult table created successfully in MySQL `club`!');

    // 3. Seed initial competition results
    const results = [
      ['res-1', 'evt-1', 'Oak Ridge Championship Hunt', 'Oak Ridge Hunting Club', 'Tennessee', 'TN', '1st Place', 1, "Thunder's Southern Belle", 'UKC-892401', 'Treeing Walker Coonhound', 'Lalit Panchole', 'Lalit Panchole', '375 Pts', 'Sep 19, 2026', 'Published'],
      ['res-2', 'evt-2', 'Cumberland Mountain Field Trial', 'Cumberland Mountain Club', 'Kentucky', 'KY', '1st Place', 1, 'Blue Ridge Midnight Rambler', 'PKC-441092', 'Bluetick Coonhound', 'Lalit Panchole', 'Lalit Panchole', '325 Pts', 'Sep 12, 2026', 'Published']
    ];

    for (const r of results) {
      await db.query(
        'INSERT INTO `CompetitionResult` (id, eventId, eventName, club, state, stateCode, placement, place, winnerDog, winnerDogReg, breed, owner, participant, score, date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE placement=VALUES(placement)',
        r
      );
    }
    console.log('🎉 Initial competition results seeded successfully!');
  } catch (err) {
    console.error('❌ Migration Error:', err.message);
  } finally {
    process.exit(0);
  }
}

run();
