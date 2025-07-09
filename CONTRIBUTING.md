# Contributing to SERENITY-AI

Thank you for your interest in contributing to SERENITY-AI! This document provides guidelines and information for contributors.

## 🌟 Ways to Contribute

### Code Contributions
- Bug fixes and improvements
- New features and enhancements
- Performance optimizations
- Documentation improvements
- Test coverage improvements

### Non-Code Contributions
- UI/UX design improvements
- Documentation and tutorials
- Community support and moderation
- Translation and localization
- Bug reports and feature requests

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git version control
- Basic knowledge of React, TypeScript, and Tailwind CSS
- Familiarity with mental health and wellness principles

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/SERENITY-AI.git
   cd SERENITY-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd serene-ai-garden
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📝 Development Workflow

### Branch Naming Convention
- `feature/description-of-feature`
- `bugfix/description-of-bug`
- `hotfix/critical-fix`
- `docs/documentation-update`
- `refactor/code-improvement`

### Commit Message Format
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or modifying tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(chat): add voice recognition for AI conversations
fix(mood): resolve mood tracking data persistence issue
docs(readme): update installation instructions
```

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, well-documented code
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run test
   npm run lint
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Use our PR template
   - Provide a clear description of changes
   - Link to related issues
   - Request review from maintainers

## 🎨 Code Style Guidelines

### TypeScript
- Use strict TypeScript configuration
- Define proper interfaces and types
- Avoid `any` type when possible
- Use meaningful variable and function names

### React
- Use functional components with hooks
- Follow React best practices
- Use proper prop types and default values
- Implement error boundaries where appropriate

### Styling
- Use Tailwind CSS classes
- Follow mobile-first responsive design
- Maintain consistency with design system
- Use semantic HTML elements

### File Organization
```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── types/              # TypeScript type definitions
└── tests/              # Test files
```

## 🧪 Testing Guidelines

### Unit Tests
- Test individual components and functions
- Use React Testing Library for component tests
- Maintain at least 80% code coverage
- Mock external dependencies

### Integration Tests
- Test component interactions
- Test API integrations
- Test user workflows
- Use realistic test data

### Writing Tests
```typescript
// Example test structure
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup
  });

  it('should render correctly', () => {
    // Test implementation
  });

  it('should handle user interactions', () => {
    // Test user events
  });
});
```

## 🔒 Security Guidelines

### Sensitive Data
- Never commit API keys or secrets
- Use environment variables for configuration
- Sanitize user inputs
- Implement proper authentication

### Mental Health Considerations
- Handle crisis situations appropriately
- Implement content warnings
- Respect user privacy and anonymity
- Follow mental health best practices

## 📚 Documentation Standards

### Code Documentation
- Use JSDoc for function documentation
- Include examples in complex functions
- Document component props and usage
- Keep inline comments concise and helpful

### README Updates
- Update README for new features
- Include screenshots for UI changes
- Update installation instructions
- Document breaking changes

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Step-by-step instructions
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: OS, browser, version information
6. **Screenshots**: If applicable
7. **Additional Context**: Any other relevant information

Use our bug report template when creating issues.

## 💡 Feature Requests

For feature requests, please provide:

1. **Use Case**: Why is this feature needed?
2. **Description**: Detailed feature description
3. **Alternatives**: Any alternative solutions considered
4. **Implementation**: Suggestions for implementation
5. **Impact**: How this affects users and the system

## 🎯 Areas for Contribution

### High Priority
- AI conversation improvements
- Mobile responsiveness
- Accessibility features
- Performance optimizations
- Security enhancements

### Medium Priority
- New mindfulness exercises
- Advanced analytics
- Community features
- Integration with wearables
- Offline functionality

### Low Priority
- Additional games
- UI/UX refinements
- Documentation improvements
- Translation support
- Developer tools

## 🌐 Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Focus on constructive feedback
- Help newcomers get started
- Maintain professional communication
- Report inappropriate behavior

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Discord**: Real-time community chat
- **Email**: For sensitive matters

## 🔄 Review Process

### Code Review Checklist
- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No breaking changes without notice
- [ ] Security considerations addressed
- [ ] Performance impact evaluated

### Review Timeline
- Small changes: 1-2 days
- Medium changes: 3-5 days
- Large changes: 1-2 weeks
- Critical fixes: Same day

## 📈 Release Process

### Version Numbers
We follow [Semantic Versioning](https://semver.org/):
- `MAJOR.MINOR.PATCH`
- Major: Breaking changes
- Minor: New features (backward compatible)
- Patch: Bug fixes

### Release Schedule
- Major releases: Quarterly
- Minor releases: Monthly
- Patch releases: As needed

## 🏆 Recognition

### Contributors
- All contributors are recognized in README
- Significant contributions highlighted in releases
- Community recognition programs
- Opportunity for maintainer roles

### Contribution Types
- 🐛 Bug fixes
- ✨ New features
- 📚 Documentation
- 🎨 Design
- 🔧 Tools and infrastructure
- 🌍 Translation
- 💡 Ideas and suggestions

## 📞 Getting Help

### For Contributors
- Check existing issues and discussions
- Ask questions in GitHub Discussions
- Join our Discord community
- Reach out to maintainers

### For Users
- Check the documentation
- Search existing issues
- Create a new issue with details
- Contact support team

## 🙏 Thank You

Thank you for contributing to SERENITY-AI! Every contribution, no matter how small, helps make mental health support more accessible and effective for everyone.

---

**Building a better future for mental health, one commit at a time.**
