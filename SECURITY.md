# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: **saddaulsiam@gmail.com**

Please include:

- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Impact of the vulnerability
- Proof-of-concept or exploit code (if possible)

## Response Time

- Initial response: Within 48 hours
- Status updates: Every 5 business days
- Resolution timeline: Depends on severity and complexity

## Security Best Practices

When using this POS system:

1. **Change Default Credentials**
   - Update admin password immediately after installation
   - Use strong, unique passwords for all accounts

2. **Secure Your Environment**
   - Keep `.env` file secure (never commit to Git)
   - Use HTTPS in production
   - Enable firewall on server

3. **Regular Updates**
   - Keep the application updated to latest version
   - Update dependencies regularly
   - Monitor for security advisories

4. **Database Security**
   - Use strong database passwords
   - Restrict database access to application only
   - Regular backups with encryption

5. **Employee Access**
   - Use PIN-based authentication for cashiers
   - Implement role-based access control
   - Audit employee actions regularly

6. **Payment Security**
   - Use PCI-compliant payment processors
   - Never store full credit card numbers
   - Encrypt sensitive customer data

## Known Security Considerations

- Employee PINs are hashed with bcrypt
- JWT tokens expire after configured time
- All API endpoints require authentication (except login)
- SQL injection protected by Prisma ORM
- XSS protection via React's built-in escaping

Thank you for helping keep POS System secure! 🔒
