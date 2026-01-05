import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../src/user/entities/user.entity';
import { Subscription, SubscriptionStatus } from '../src/billing/entities/subscription.entity';
import { Plan } from '../src/billing/entities/plan.entity';
import { UsageStorage } from '../src/billing/entities/usage-storage.entity';

config();

function getArgValue(flag: string, fallback?: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  return fallback;
}

async function setUserPlan(): Promise<void> {
  const email = getArgValue('--email');
  const planId = getArgValue('--plan', 'pro');

  if (!email) {
    console.error('Usage: ts-node tools/set-user-plan.ts --email <email> [--plan pro]');
    process.exit(1);
  }

  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [User, Subscription, Plan, UsageStorage],
    synchronize: false,
  });

  await dataSource.initialize();

  try {
    const userRepository = dataSource.getRepository(User);
    const planRepository = dataSource.getRepository(Plan);
    const subscriptionRepository = dataSource.getRepository(Subscription);
    const usageStorageRepository = dataSource.getRepository(UsageStorage);

    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error(`User not found for email: ${email}`);
    }

    const plan = await planRepository.findOne({ where: { id: planId! } });
    if (!plan) {
      throw new Error(`Plan '${planId}' not found. Seed plans then retry.`);
    }

    let subscription = await subscriptionRepository.findOne({ where: { userId: user.id } });
    if (!subscription) {
      subscription = subscriptionRepository.create({
        userId: user.id,
        planId: plan.id,
        status: SubscriptionStatus.ACTIVE,
      });
    } else {
      subscription.planId = plan.id;
      subscription.status = SubscriptionStatus.ACTIVE;
    }
    await subscriptionRepository.save(subscription);

    // Ensure storage usage row exists
    let usageStorage = await usageStorageRepository.findOne({ where: { userId: user.id } });
    if (!usageStorage) {
      usageStorage = usageStorageRepository.create({ userId: user.id, bytesUsed: 0 });
      await usageStorageRepository.save(usageStorage);
    }

    console.log(`✅ Updated ${email} to plan '${plan.name}' (id: ${plan.id})`);
  } catch (error) {
    console.error('❌ Error updating user plan:', error);
    process.exitCode = 1;
  } finally {
    if (dataSource.isInitialized) await dataSource.destroy();
  }
}

setUserPlan()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
  });
