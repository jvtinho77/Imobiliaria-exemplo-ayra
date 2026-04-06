import { PrismaClient, PropertyType } from '@prisma/client'
import { hashPassword } from '../src/lib/security.js'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hashPassword('admin123')
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aurora.imoveis' },
    update: {},
    create: {
      email: 'admin@aurora.imoveis',
      password: adminPassword,
      name: 'Administrador',
      role: 'ADMIN',
    },
  })

  console.log('Admin user created:', admin.email)

  // Create sample properties
  const properties = [
    {
      title: 'Cobertura Horizon',
      description: 'Cobertura de luxo com vista panorâmica',
      price: 8500000,
      location: 'Vila Nova Conceição, SP',
      type: PropertyType.PENTHOUSE,
      bedrooms: 4,
      bathrooms: 5,
      area: 350,
      images: ['/assets/modern.png'],
      featured: true,
    },
    {
      title: 'Villa Serena Lux',
      description: 'Mansão exclusiva em condomínio fechado',
      price: 15200000,
      location: 'Jardim Europa, SP',
      type: PropertyType.HOUSE,
      bedrooms: 5,
      bathrooms: 7,
      area: 820,
      images: ['/assets/villa.png'],
      featured: true,
    },
  ]

  for (const property of properties) {
    await prisma.property.create({
      data: property,
    })
  }

  console.log('Sample properties created')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
