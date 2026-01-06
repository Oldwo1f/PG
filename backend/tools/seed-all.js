"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const plan_entity_1 = require("../src/billing/entities/plan.entity");
const user_entity_1 = require("../src/user/entities/user.entity");
const subscription_entity_1 = require("../src/billing/entities/subscription.entity");
const usage_storage_entity_1 = require("../src/billing/entities/usage-storage.entity");
const usage_monthly_entity_1 = require("../src/billing/entities/usage-monthly.entity");
const image_entity_1 = require("../src/images/entities/image.entity");
const brand_entity_1 = require("../src/brand/entities/brand.entity");
const template_entity_1 = require("../src/template/entities/template.entity");
const bcrypt = require("bcryptjs");
(0, dotenv_1.config)();
const dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'perfectgenerations',
    entities: [user_entity_1.User, plan_entity_1.Plan, subscription_entity_1.Subscription, usage_storage_entity_1.UsageStorage, usage_monthly_entity_1.UsageMonthly, image_entity_1.Image, brand_entity_1.Brand, template_entity_1.Template],
    synchronize: false,
});
async function seedAll() {
    try {
        await dataSource.initialize();
        console.log('✅ Connexion à la base de données établie');
        console.log('\n📦 Création des plans...');
        const planRepository = dataSource.getRepository(plan_entity_1.Plan);
        const plans = [
            {
                id: 'free',
                name: 'Free',
                priceMonthly: 0,
                imageLimitMonthly: 50,
                storageLimitBytes: 15 * 1024 * 1024,
                templateLimit: 3,
                brandLimit: 1,
                teamMemberLimit: 1,
                integrationsIncluded: true,
            },
            {
                id: 'starter',
                name: 'Starter',
                priceMonthly: 9,
                imageLimitMonthly: 500,
                storageLimitBytes: 100 * 1024 * 1024,
                templateLimit: 20,
                brandLimit: 5,
                teamMemberLimit: 1,
                integrationsIncluded: true,
            },
            {
                id: 'pro',
                name: 'Pro',
                priceMonthly: 49,
                imageLimitMonthly: 5000,
                storageLimitBytes: 500 * 1024 * 1024,
                templateLimit: 9999,
                brandLimit: 9999,
                teamMemberLimit: 3,
                integrationsIncluded: true,
            },
            {
                id: 'enterprise',
                name: 'Enterprise',
                priceMonthly: 99,
                imageLimitMonthly: -1,
                storageLimitBytes: -1,
                templateLimit: -1,
                brandLimit: -1,
                teamMemberLimit: -1,
                integrationsIncluded: true,
            },
        ];
        for (const planData of plans) {
            const existingPlan = await planRepository.findOne({ where: { id: planData.id } });
            if (existingPlan) {
                await planRepository.update(existingPlan.id, planData);
                console.log(`   ✅ Plan "${planData.name}" mis à jour`);
            }
            else {
                await planRepository.save(planData);
                console.log(`   ✅ Plan "${planData.name}" créé`);
            }
        }
        console.log('✅ Plans créés avec succès');
        console.log('\n👤 Création de l\'utilisateur admin...');
        const userRepository = dataSource.getRepository(user_entity_1.User);
        const adminEmail = 'alexis@alexis.fr';
        const adminPassword = 'Alexis09';
        let adminUser = await userRepository.findOne({
            where: { email: adminEmail },
        });
        if (adminUser) {
            console.log(`   ⚠️  L'utilisateur ${adminEmail} existe déjà`);
            if (adminUser.role !== user_entity_1.UserRole.ADMIN) {
                adminUser.role = user_entity_1.UserRole.ADMIN;
                adminUser.status = user_entity_1.UserStatus.ACTIVE;
                adminUser.emailVerifiedAt = new Date();
                await userRepository.save(adminUser);
                console.log('   ✅ Utilisateur mis à jour avec le rôle ADMIN');
            }
            else {
                console.log('   ✅ L\'utilisateur est déjà admin');
            }
        }
        else {
            const hashedPassword = await bcrypt.hash(adminPassword, 12);
            adminUser = userRepository.create({
                email: adminEmail,
                password: hashedPassword,
                firstName: 'Alexis',
                lastName: 'Admin',
                role: user_entity_1.UserRole.ADMIN,
                status: user_entity_1.UserStatus.ACTIVE,
                emailVerifiedAt: new Date(),
                acceptNewsletter: false,
                imagesGeneratedThisMonth: 0,
            });
            adminUser = await userRepository.save(adminUser);
            console.log(`   ✅ Utilisateur admin créé: ${adminUser.id}`);
        }
        console.log('\n💳 Création de l\'abonnement...');
        const subscriptionRepository = dataSource.getRepository(subscription_entity_1.Subscription);
        const freePlan = await planRepository.findOne({ where: { id: 'free' } });
        if (freePlan) {
            const existingSubscription = await subscriptionRepository.findOne({
                where: { user: { id: adminUser.id } },
            });
            if (existingSubscription) {
                console.log('   ✅ Abonnement existe déjà');
            }
            else {
                const subscription = subscriptionRepository.create({
                    user: adminUser,
                    plan: freePlan,
                    status: subscription_entity_1.SubscriptionStatus.ACTIVE,
                });
                await subscriptionRepository.save(subscription);
                console.log('   ✅ Abonnement gratuit créé');
            }
        }
        else {
            console.log('   ⚠️  Plan gratuit non trouvé, création de l\'abonnement ignorée');
        }
        console.log('\n💾 Création de l\'enregistrement d\'utilisation du stockage...');
        const usageStorageRepository = dataSource.getRepository(usage_storage_entity_1.UsageStorage);
        const existingStorage = await usageStorageRepository.findOne({
            where: { user: { id: adminUser.id } },
        });
        if (existingStorage) {
            console.log('   ✅ Enregistrement d\'utilisation du stockage existe déjà');
        }
        else {
            const usageStorage = usageStorageRepository.create({
                user: adminUser,
                bytesUsed: 0,
            });
            await usageStorageRepository.save(usageStorage);
            console.log('   ✅ Enregistrement d\'utilisation du stockage créé');
        }
        console.log('\n🎉 Seeds terminés avec succès!');
        console.log('\n📋 Informations de connexion:');
        console.log(`   Email: ${adminEmail}`);
        console.log(`   Mot de passe: ${adminPassword}`);
        console.log('   Rôle: ADMIN');
        console.log('   URL Admin: https://adminperfectgeneration.aito-flow.com');
    }
    catch (error) {
        console.error('❌ Erreur lors des seeds:', error);
        throw error;
    }
    finally {
        if (dataSource.isInitialized) {
            await dataSource.destroy();
            console.log('\n🔌 Connexion à la base de données fermée');
        }
    }
}
seedAll()
    .then(() => {
    process.exit(0);
})
    .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
});
//# sourceMappingURL=seed-all.js.map