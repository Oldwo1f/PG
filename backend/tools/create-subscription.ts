import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../src/user/entities/user.entity';
import { Plan } from '../src/billing/entities/plan.entity';
import { Subscription, SubscriptionStatus } from '../src/billing/entities/subscription.entity';
import { UsageStorage } from '../src/billing/entities/usage-storage.entity';
import { UsageMonthly } from '../src/billing/entities/usage-monthly.entity';
import { Image } from '../src/images/entities/image.entity';
import { Brand } from '../src/brand/entities/brand.entity';
import { Template } from '../src/template/entities/template.entity';

config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'perfectgenerations',
  entities: [User, Plan, Subscription, UsageStorage, UsageMonthly, Image, Brand, Template],
  synchronize: false,
});

async function createSubscription(): Promise<void> {
  try {
    await dataSource.initialize();
    console.log('✅ Connexion à la base de données établie');

    const userRepo = dataSource.getRepository(User);
    const planRepo = dataSource.getRepository(Plan);
    const subRepo = dataSource.getRepository(Subscription);

    const user = await userRepo.findOne({ where: { email: 'alexis@alexis.fr' } });
    const freePlan = await planRepo.findOne({ where: { id: 'free' } });

    if (!user) {
      console.log('❌ Utilisateur non trouvé');
      return;
    }

    if (!freePlan) {
      console.log('❌ Plan gratuit non trouvé');
      return;
    }

    const existing = await subRepo.findOne({ 
      where: { user: { id: user.id } },
      relations: ['user', 'plan']
    });

    if (existing) {
      console.log('✅ Abonnement existe déjà');
    } else {
      const sub = subRepo.create({ 
        user, 
        plan: freePlan, 
        status: SubscriptionStatus.ACTIVE 
      });
      await subRepo.save(sub);
      console.log('✅ Abonnement gratuit créé pour l\'utilisateur admin');
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

createSubscription();
