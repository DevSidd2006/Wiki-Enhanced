# Security Policy

## Supported Versions

We actively support the following versions of Wikipedia Enhanced:

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| 1.x     | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do Not Create a Public Issue

Please do not create a public GitHub issue for security vulnerabilities. This helps prevent malicious actors from exploiting the vulnerability before it's fixed.

### 2. Report Privately

Instead, please report security vulnerabilities by:

- **Email**: Send details to security@example.com
- **GitHub Security Advisories**: Use the private vulnerability reporting feature in our GitHub repository

### 3. Include These Details

When reporting a vulnerability, please include:

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Any suggested fixes (if you have them)
- Your contact information

### 4. Response Timeline

We will respond to security reports within:

- **24 hours**: Initial acknowledgment
- **7 days**: Detailed response with our assessment
- **30 days**: Resolution or status update

## Security Best Practices

### For Users

- Keep your API keys secure and never commit them to version control
- Use environment variables for all sensitive configuration
- Regularly rotate your API keys
- Use HTTPS in production environments
- Keep dependencies updated

### For Developers

- Follow secure coding practices
- Validate all user inputs
- Use parameterized queries to prevent injection attacks
- Implement proper error handling that doesn't expose sensitive information
- Regular security audits of dependencies

## Known Security Considerations

### API Keys

- **Gemini API Key**: Required for AI functionality - keep this secure
- **News API Key**: Optional but recommended for real news data
- Store all keys in environment variables, never in source code

### CORS Policy

- Current CORS policy allows all origins (`*`) for development
- In production, restrict to specific domains
- Configure appropriate CORS headers for your deployment

### Rate Limiting

- Implement rate limiting to prevent abuse
- Monitor API usage to detect unusual patterns
- Consider implementing user authentication for production use

### Input Validation

- All user inputs are validated before processing
- Text inputs are sanitized to prevent XSS attacks
- File uploads are not currently supported, reducing attack surface

## Dependency Security

We regularly audit our dependencies for security vulnerabilities:

```bash
npm audit
```

To fix vulnerabilities:

```bash
npm audit fix
```

## Deployment Security

### Environment Variables

Always use environment variables for sensitive configuration:

```bash
# Good
GEMINI_API_KEY=your_secure_key_here

# Bad - Never do this
const API_KEY = "your_secure_key_here";
```

### HTTPS

Always use HTTPS in production:

- Configure your hosting provider to use SSL certificates
- Redirect HTTP traffic to HTTPS
- Use secure headers

### Server Configuration

- Keep your Node.js version updated
- Use a reverse proxy (nginx, Apache) in production
- Configure proper firewall rules
- Regular security updates for your server

## Contact

For security-related questions or concerns:

- **Email**: security@example.com
- **GitHub**: Create a private security advisory
- **Response Time**: Within 24 hours

Thank you for helping keep Wikipedia Enhanced secure!
