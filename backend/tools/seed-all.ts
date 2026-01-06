import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Plan } from '../src/billing/entities/plan.entity';
import { User, UserRole, UserStatus } from '../src/user/entities/user.entity';
import { Subscription, SubscriptionStatus } from '../src/billing/entities/subscription.entity';
import { UsageStorage } from '../src/billing/entities/usage-storage.entity';
import { UsageMonthly } from '../src/billing/entities/usage-monthly.entity';
import { Image } from '../src/images/entities/image.entity';
import { Brand } from '../src/brand/entities/brand.entity';
import { Template } from '../src/template/entities/template.entity';
import * as bcrypt from 'bcryptjs';

// Charger les variables d'environnement
config();

// Configuration de la base de données
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'perfectgenerations',
  entities: [User, Plan, Subscription, UsageStorage, UsageMonthly, Image, Brand, Template],
  synchronize: false,
});

async function seedAll(): Promise<void> {
  try {
    // Se connecter à la base de données
    await dataSource.initialize();
    console.log('✅ Connexion à la base de données établie');

    // 1. Seed des plans
    console.log('\n📦 Création des plans...');
    const planRepository = dataSource.getRepository(Plan);

    const plans: Partial<Plan>[] = [
      {
        id: 'free',
        name: 'Free',
        priceMonthly: 0,
        imageLimitMonthly: 50,
        storageLimitBytes: 15 * 1024 * 1024, // 15 MB
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
        storageLimitBytes: 100 * 1024 * 1024, // 100 MB
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
        storageLimitBytes: 500 * 1024 * 1024, // 500 MB
        templateLimit: 9999, // "Unlimited"
        brandLimit: 9999, // "Unlimited"
        teamMemberLimit: 3,
        integrationsIncluded: true,
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        priceMonthly: 99,
        imageLimitMonthly: -1, // Unlimited
        storageLimitBytes: -1, // Unlimited
        templateLimit: -1, // Unlimited
        brandLimit: -1, // Unlimited
        teamMemberLimit: -1, // Unlimited
        integrationsIncluded: true,
      },
    ];

    // Sauvegarder les plans (upsert)
    for (const planData of plans) {
      const existingPlan = await planRepository.findOne({ where: { id: planData.id } });
      if (existingPlan) {
        await planRepository.update(existingPlan.id, planData);
        console.log(`   ✅ Plan "${planData.name}" mis à jour`);
      } else {
        await planRepository.save(planData);
        console.log(`   ✅ Plan "${planData.name}" créé`);
      }
    }

    console.log('✅ Plans créés avec succès');

    // 2. Créer l'utilisateur admin
    console.log('\n👤 Création de l\'utilisateur admin...');
    const userRepository = dataSource.getRepository(User);

    const adminEmail = 'alexis@alexis.fr';
    const adminPassword = 'Alexis09';

    let adminUser = await userRepository.findOne({
      where: { email: adminEmail },
    });

    if (adminUser) {
      console.log(`   ⚠️  L'utilisateur ${adminEmail} existe déjà`);
      
      // Mettre à jour le rôle en admin si nécessaire
      if (adminUser.role !== UserRole.ADMIN) {
        adminUser.role = UserRole.ADMIN;
        adminUser.status = UserStatus.ACTIVE;
        adminUser.emailVerifiedAt = new Date();
        await userRepository.save(adminUser);
        console.log('   ✅ Utilisateur mis à jour avec le rôle ADMIN');
      } else {
        console.log('   ✅ L\'utilisateur est déjà admin');
      }
    } else {
      // Créer le nouvel utilisateur admin
      const hashedPassword = await bcrypt.hash(adminPassword, 12);

      adminUser = userRepository.create({
        email: adminEmail,
        password: hashedPassword,
        firstName: 'Alexis',
        lastName: 'Admin',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        emailVerifiedAt: new Date(),
        acceptNewsletter: false,
        imagesGeneratedThisMonth: 0,
      });

      adminUser = await userRepository.save(adminUser);
      console.log(`   ✅ Utilisateur admin créé: ${adminUser.id}`);
    }

    // 3. Créer l'abonnement gratuit pour l'admin
    console.log('\n💳 Création de l\'abonnement...');
    const subscriptionRepository = dataSource.getRepository(Subscription);
    const freePlan = await planRepository.findOne({ where: { id: 'free' } });

    if (freePlan) {
      const existingSubscription = await subscriptionRepository.findOne({
        where: { user: { id: adminUser.id } },
      });

      if (existingSubscription) {
        console.log('   ✅ Abonnement existe déjà');
      } else {
        const subscription = subscriptionRepository.create({
          user: adminUser,
          plan: freePlan,
          status: SubscriptionStatus.ACTIVE,
        });
        await subscriptionRepository.save(subscription);
        console.log('   ✅ Abonnement gratuit créé');
      }
    } else {
      console.log('   ⚠️  Plan gratuit non trouvé, création de l\'abonnement ignorée');
    }

    // 4. Créer l'enregistrement d'utilisation du stockage
    console.log('\n💾 Création de l\'enregistrement d\'utilisation du stockage...');
    const usageStorageRepository = dataSource.getRepository(UsageStorage);
    const existingStorage = await usageStorageRepository.findOne({
      where: { user: { id: adminUser.id } },
    });

    if (existingStorage) {
      console.log('   ✅ Enregistrement d\'utilisation du stockage existe déjà');
    } else {
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
  } catch (error) {
    console.error('❌ Erreur lors des seeds:', error);
    throw error;
  } finally {
    // Fermer la connexion
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('\n🔌 Connexion à la base de données fermée');
    }
  }
}

// Exécuter le script
seedAll()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });

