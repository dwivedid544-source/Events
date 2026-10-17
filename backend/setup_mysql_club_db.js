const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function setupMySQL() {
  console.log('🚀 Connecting to MySQL server on 127.0.0.1 (XAMPP / phpMyAdmin)...');

  try {
    // 1. Connect without database first to ensure `club` database exists
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '',
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL Server!');

    // Create database if not exists
    await connection.query('CREATE DATABASE IF NOT EXISTS `club`;');
    await connection.query('USE `club`;');

    console.log('🛠️ Creating all 11 project tables in `club` database...');

    // 1. User Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`User\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`email\` VARCHAR(191) NOT NULL UNIQUE,
        \`passwordHash\` VARCHAR(191) NOT NULL,
        \`name\` VARCHAR(191) NOT NULL,
        \`role\` VARCHAR(50) DEFAULT 'MEMBER',
        \`phone\` VARCHAR(50),
        \`stateCode\` VARCHAR(10),
        \`clubId\` VARCHAR(191),
        \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 2. Member Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`Member\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`name\` VARCHAR(191) NOT NULL,
        \`email\` VARCHAR(191) NOT NULL UNIQUE,
        \`phone\` VARCHAR(50),
        \`state\` VARCHAR(191),
        \`club\` VARCHAR(191),
        \`status\` VARCHAR(50) DEFAULT 'Active',
        \`duesAmount\` DOUBLE DEFAULT 35.0,
        \`joinDate\` VARCHAR(50),
        \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 3. StateAssociation Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`StateAssociation\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`name\` VARCHAR(191) NOT NULL,
        \`code\` VARCHAR(10) NOT NULL UNIQUE,
        \`organizations\` VARCHAR(191) DEFAULT 'UKC,PKC',
        \`adminName\` VARCHAR(191),
        \`clubsCount\` INT DEFAULT 0,
        \`membersCount\` INT DEFAULT 0,
        \`eventsCount\` INT DEFAULT 0,
        \`revenue\` DOUBLE DEFAULT 0.0,
        \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 4. LocalClub Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`LocalClub\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`name\` VARCHAR(191) NOT NULL,
        \`city\` VARCHAR(191) NOT NULL,
        \`county\` VARCHAR(191),
        \`state\` VARCHAR(191) NOT NULL,
        \`stateCode\` VARCHAR(10) NOT NULL,
        \`stateId\` VARCHAR(191) NOT NULL,
        \`zip\` VARCHAR(20),
        \`distanceMiles\` DOUBLE,
        \`dogType\` VARCHAR(191),
        \`federation\` VARCHAR(191),
        \`eventType\` VARCHAR(191),
        \`membersCount\` INT DEFAULT 0,
        \`eventsCount\` INT DEFAULT 0,
        \`entriesCount\` INT DEFAULT 0,
        \`revenue\` DOUBLE DEFAULT 0.0,
        \`adminName\` VARCHAR(191),
        \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 5. Event Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`Event\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`name\` VARCHAR(191) NOT NULL,
        \`federation\` VARCHAR(191) NOT NULL,
        \`sport\` VARCHAR(191),
        \`type\` VARCHAR(191) NOT NULL,
        \`club\` VARCHAR(191) NOT NULL,
        \`clubId\` VARCHAR(191) NOT NULL,
        \`state\` VARCHAR(191) NOT NULL,
        \`stateCode\` VARCHAR(10) NOT NULL,
        \`city\` VARCHAR(191) NOT NULL,
        \`date\` VARCHAR(50) NOT NULL,
        \`fee\` DOUBLE NOT NULL,
        \`entriesCount\` INT DEFAULT 0,
        \`maxCapacity\` INT DEFAULT 50,
        \`status\` VARCHAR(50) DEFAULT 'Registration Open',
        \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 6. EventEntry Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`EventEntry\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`eventId\` VARCHAR(191) NOT NULL,
        \`dogId\` VARCHAR(191),
        \`participant\` VARCHAR(191) NOT NULL,
        \`handlerPhone\` VARCHAR(50),
        \`fee\` DOUBLE NOT NULL,
        \`paymentStatus\` VARCHAR(50) DEFAULT 'Paid',
        \`confirmationCode\` VARCHAR(191) NOT NULL,
        \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 7. Product Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`Product\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`name\` VARCHAR(191) NOT NULL,
        \`price\` DOUBLE NOT NULL,
        \`category\` VARCHAR(191) NOT NULL,
        \`scopeChannel\` VARCHAR(50) DEFAULT 'NATIONAL',
        \`scopeEntity\` VARCHAR(191),
        \`organizationType\` VARCHAR(50),
        \`organizationId\` VARCHAR(191),
        \`profit\` DOUBLE DEFAULT 0.0,
        \`description\` TEXT,
        \`image\` VARCHAR(255),
        \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 8. Order Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`Order\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`orderNumber\` VARCHAR(191) NOT NULL UNIQUE,
        \`customerName\` VARCHAR(191) NOT NULL,
        \`total\` DOUBLE NOT NULL,
        \`status\` VARCHAR(50) DEFAULT 'Completed',
        \`itemsJson\` TEXT,
        \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 9. DonationPledge Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`DonationPledge\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`entityType\` VARCHAR(50) NOT NULL,
        \`entityId\` VARCHAR(191) NOT NULL,
        \`amount\` DOUBLE NOT NULL,
        \`tier\` VARCHAR(191),
        \`cause\` VARCHAR(191),
        \`donorName\` VARCHAR(191),
        \`donorEmail\` VARCHAR(191),
        \`status\` VARCHAR(50) DEFAULT 'PENDING_GATEWAY',
        \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 10. FinancialTransaction Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`FinancialTransaction\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`type\` VARCHAR(50) NOT NULL,
        \`category\` VARCHAR(191) NOT NULL,
        \`amount\` DOUBLE NOT NULL,
        \`period\` VARCHAR(50),
        \`stateId\` VARCHAR(191),
        \`clubId\` VARCHAR(191),
        \`description\` TEXT,
        \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 11. News Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`News\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`title\` VARCHAR(191) NOT NULL,
        \`summary\` TEXT NOT NULL,
        \`category\` VARCHAR(191) NOT NULL,
        \`author\` VARCHAR(191) NOT NULL,
        \`date\` VARCHAR(50) NOT NULL,
        \`state\` VARCHAR(191),
        \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('✅ All 11 MySQL Tables created successfully in `club` database!');

    // Seed Admin User
    const hash = bcrypt.hashSync('Password123!', 10);
    await connection.query(`
      INSERT INTO \`User\` (\`id\`, \`email\`, \`passwordHash\`, \`name\`, \`role\`, \`phone\`, \`stateCode\`, \`clubId\`)
      VALUES ('usr-lalit', 'pancholelalit52@gmail.com', '${hash}', 'Lalit Panchole', 'SUPER_ADMIN', '(800) 555-0192', 'TX', 'club-1')
      ON DUPLICATE KEY UPDATE \`name\`='Lalit Panchole';
    `);

    // Seed State Associations
    const states = [
      ['tx', 'Texas Hound Association', 'TX', 'UKC,PKC', 'Austin Sterling', 54, 3920, 7, 245000],
      ['al', 'Alabama State Association', 'AL', 'UKC', 'Marcus Vance', 15, 950, 4, 45000],
      ['ak', 'Alaska State Association', 'AK', 'PKC', 'Cody Campbell', 8, 420, 2, 18000],
      ['az', 'Arizona State Association', 'AZ', 'UKC,PKC', 'Frank Reynolds', 18, 1100, 5, 62000],
      ['ar', 'Arkansas State Association', 'AR', 'UKC', 'Dominic Rossi', 36, 2240, 6, 115000],
      ['ca', 'California State Association', 'CA', 'PKC', 'Elena Rostova', 31, 1980, 5, 98000],
      ['tn', 'Tennessee State Association', 'TN', 'UKC,PKC', 'Robert Miller', 42, 2890, 8, 185000]
    ];

    for (const s of states) {
      await connection.query(
        `INSERT INTO \`StateAssociation\` (\`id\`, \`name\`, \`code\`, \`organizations\`, \`adminName\`, \`clubsCount\`, \`membersCount\`, \`eventsCount\`, \`revenue\`)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE \`name\`=VALUES(\`name\`), \`organizations\`=VALUES(\`organizations\`);`,
        s
      );
    }

    // Seed Local Clubs
    const clubs = [
      ['club-1', 'Oak Ridge Hunting Club', 'Knoxville', 'Knox County', 'Tennessee', 'TN', 'tn', '37901', 18, 'Treeing Walker Coonhound', 'UKC (United Kennel Club)', 'Nite Hunt', 84, 6, 217, 6790, 'Robert Miller'],
      ['club-2', 'Cumberland Mountain Club', 'Middlesboro', 'Bell County', 'Kentucky', 'KY', 'ky', '40965', 64, 'English Redtick Coonhound', 'AKC (American Kennel Club)', 'Water Race', 96, 8, 304, 8940, 'Thomas Shelby'],
      ['club-tx-central', 'Central Texas Hound Club', 'Waco', 'McLennan County', 'Texas', 'TX', 'tx', '76701', 20, 'Treeing Walker Coonhound', 'Independent', 'Bench Show', 82, 6, 225, 8700, 'Caleb Vance']
    ];

    for (const c of clubs) {
      await connection.query(
        `INSERT INTO \`LocalClub\` (\`id\`, \`name\`, \`city\`, \`county\`, \`state\`, \`stateCode\`, \`stateId\`, \`zip\`, \`distanceMiles\`, \`dogType\`, \`federation\`, \`eventType\`, \`membersCount\`, \`eventsCount\`, \`entriesCount\`, \`revenue\`, \`adminName\`)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE \`name\`=VALUES(\`name\`);`,
        c
      );
    }

    // Seed Events
    const events = [
      ['evt-1', 'Nite Hunt & Treeing Contest', 'UKC (United Kennel Club)', 'Coonhounds', 'Nite Hunt', 'Oak Ridge Hunting Club', 'club-1', 'Tennessee', 'TN', 'Knoxville', 'September 19, 2026', 30.0, 43, 50, 'Registration Open'],
      ['evt-2', 'Fall Championship Hunt', 'PKC (Professional Kennel Club)', 'Coonhounds', 'Championship Hunt', 'Oak Ridge Hunting Club', 'club-1', 'Tennessee', 'TN', 'Knoxville', 'October 24, 2026', 45.0, 28, 60, 'Registration Open']
    ];

    for (const e of events) {
      await connection.query(
        `INSERT INTO \`Event\` (\`id\`, \`name\`, \`federation\`, \`sport\`, \`type\`, \`club\`, \`clubId\`, \`state\`, \`stateCode\`, \`city\`, \`date\`, \`fee\`, \`entriesCount\`, \`maxCapacity\`, \`status\`)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE \`name\`=VALUES(\`name\`);`,
        e
      );
    }

    console.log('🎉 Seed data successfully inserted into MySQL `club` database in phpMyAdmin!');
    await connection.end();

  } catch (err) {
    console.error('❌ MySQL Setup Error:', err.message);
  }
}

setupMySQL();
