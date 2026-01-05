"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const user_entity_1 = require("../src/user/entities/user.entity");
const subscription_entity_1 = require("../src/billing/entities/subscription.entity");
const plan_entity_1 = require("../src/billing/entities/plan.entity");
const usage_storage_entity_1 = require("../src/billing/entities/usage-storage.entity");
(0, dotenv_1.config)();
function getArgValue(flag, fallback) {
    const idx = process.argv.indexOf(flag);
    if (idx !== -1 && process.argv[idx + 1])
        return process.argv[idx + 1];
    return fallback;
}
async function setUserPlan() {
    const email = getArgValue('--email');
    const planId = getArgValue('--plan', 'pro');
    if (!email) {
        console.error('Usage: ts-node tools/set-user-plan.ts --email <email> [--plan pro]');
        process.exit(1);
    }
    const dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [user_entity_1.User, subscription_entity_1.Subscription, plan_entity_1.Plan, usage_storage_entity_1.UsageStorage],
        synchronize: false,
    });
    await dataSource.initialize();
    try {
        const userRepository = dataSource.getRepository(user_entity_1.User);
        const planRepository = dataSource.getRepository(plan_entity_1.Plan);
        const subscriptionRepository = dataSource.getRepository(subscription_entity_1.Subscription);
        const usageStorageRepository = dataSource.getRepository(usage_storage_entity_1.UsageStorage);
        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            throw new Error(`User not found for email: ${email}`);
        }
        const plan = await planRepository.findOne({ where: { id: planId } });
        if (!plan) {
            throw new Error(`Plan '${planId}' not found. Seed plans then retry.`);
        }
        let subscription = await subscriptionRepository.findOne({ where: { userId: user.id } });
        if (!subscription) {
            subscription = subscriptionRepository.create({
                userId: user.id,
                planId: plan.id,
                status: subscription_entity_1.SubscriptionStatus.ACTIVE,
            });
        }
        else {
            subscription.planId = plan.id;
            subscription.status = subscription_entity_1.SubscriptionStatus.ACTIVE;
        }
        await subscriptionRepository.save(subscription);
        let usageStorage = await usageStorageRepository.findOne({ where: { userId: user.id } });
        if (!usageStorage) {
            usageStorage = usageStorageRepository.create({ userId: user.id, bytesUsed: 0 });
            await usageStorageRepository.save(usageStorage);
        }
        console.log(`✅ Updated ${email} to plan '${plan.name}' (id: ${plan.id})`);
    }
    catch (error) {
        console.error('❌ Error updating user plan:', error);
        process.exitCode = 1;
    }
    finally {
        if (dataSource.isInitialized)
            await dataSource.destroy();
    }
}
setUserPlan()
    .then(() => process.exit(0))
    .catch((err) => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
});
//# sourceMappingURL=set-user-plan.js.map