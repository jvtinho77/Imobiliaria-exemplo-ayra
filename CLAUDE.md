# Aurora Imóveis - Configuração de Segurança

## 🔒 Medidas de Segurança Implementadas

### 1. Banco de Dados (Prisma + PostgreSQL)
- ✅ Client Prisma singleton para conexões eficientes
- ✅ Modelos tipados com TypeScript
- ✅ Enums para valores fixos (roles, status, tipos)
- ✅ Sanitização de inputs
- ✅ Prepared statements automáticos (SQL Injection protection)

### 2. Autenticação (NextAuth.js)
- ✅ JWT tokens com expiração (7 dias)
- ✅ bcryptjs para hashing de senhas (12 rounds)
- ✅ Validação de email
- ✅ Sessions seguras
- ✅ Proteção contra CSRF

### 3. API Security
- ✅ Middleware de segurança com headers HTTP
- ✅ CORS configurado
- ✅ Content Security Policy (CSP)
- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ XSS Protection
- ✅ Rate limiting ready

### 4. Environment Variables
- ✅ .env no .gitignore
- ✅ NEXTAUTH_SECRET para sessões
- ✅ JWT_SECRET para tokens
- ✅ DATABASE_URL segura
- ✅ .env.example para documentação

## 🚀 Comandos para Configurar

```bash
# Instalar dependências
npm install

# Gerar cliente Prisma
npm run db:generate

# Criar e rodar migrações
npm run db:migrate

# Popular banco com dados iniciais
npm run db:seed

# Abrir Prisma Studio (GUI do banco)
npm run db:studio

# Rodar desenvolvimento
npm run dev
```

## 👤 Acesso Admin Padrão
- **Email:** admin@aurora.imoveis
- **Senha:** admin123
- ⚠️ **Mude a senha em produção!**

## 📝 Checklist de Segurança para Produção

- [ ] Trocar todas as chaves secretas (.env)
- [ ] Usar HTTPS obrigatório
- [ ] Configurar rate limiting
- [ ] Adicionar captcha nos formulários
- [ ] Configurar logs de auditoria
- [ ] Implementar backup automático do DB
- [ ] Usar PostgreSQL em produção (não local)
- [ ] Configurar firewall
- [ ] Validar todos os inputs no backend
- [ ] Implementar testes de segurança

## 🛡️ Headers de Segurança Configurados

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'...
```

## 📁 Estrutura de API

```
/api/auth/[...nextauth]  - Autenticação (NextAuth)
/api/properties            - CRUD de imóveis
/api/properties/[id]      - Operações em imóvel específico
/api/contacts             - Formulário de contato
```

## 🔐 Validações Implementadas

- Sanitização de inputs (remove <>, trim)
- Validação de email (regex)
- Validação de senha (mínimo 8 caracteres)
- Limite de tamanho de inputs (1000 chars)
- Verificação de tipos (TypeScript)
