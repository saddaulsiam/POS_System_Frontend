# Contributing to POS System

Thank you for considering contributing to the POS System! 🎉

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/saddaulsiam/POS_System_Frontend/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (OS, Node version, etc.)

### Suggesting Features

1. Check [Issues](https://github.com/saddaulsiam/POS_System_Frontend/issues) for existing feature requests
2. Create a new issue with:
   - Clear description of the feature
   - Use case and benefits
   - Possible implementation approach

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Write clear commit messages
   - Add tests if applicable
   - Update documentation

4. **Test your changes**

   ```bash
   npm run dev        # Test in development
   npm run build      # Ensure it builds
   npm run package    # Test Electron build
   ```

5. **Commit with meaningful messages**

   ```bash
   git commit -m "feat: add customer export feature"
   ```

6. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Clear title and description
   - Reference any related issues
   - Include screenshots if UI changes

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/POS_System_Frontend.git
cd POS_System_Frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development
npm run dev
```

## Code Style

- Use **TypeScript** for type safety
- Follow **Prettier** formatting (run `npm run format`)
- Use **ES6+** modern JavaScript features
- Write **meaningful** variable and function names
- Add **comments** for complex logic

## Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

**Examples:**

```
feat: add product export to CSV
fix: resolve inventory calculation issue
docs: update README with new setup instructions
style: format code with prettier
refactor: simplify product variant logic
```

## Questions?

Feel free to ask questions in:

- [GitHub Discussions](https://github.com/saddaulsiam/POS_System_Frontend/discussions)
- [Issues](https://github.com/saddaulsiam/POS_System_Frontend/issues)

Thank you for contributing! 🚀
