import { program } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper functions
function toPascalCase(str) {
  return str.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}
function toCamelCase(str) {
    const pascal = toPascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toTitleCase(str) {
  return str.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}

program
  .command('create <name>')
  .description('Generate feature files for React')
  .option('-t, --type <type>', 'Specify the page type (dashboard or landing)', 'landing')
  .action((name, options) => {
    const { type } = options;

    if (type !== 'dashboard' && type !== 'landing') {
      console.error("Error: --type must be either 'dashboard' or 'landing'.");
      return;
    }

    console.log(`🚀 Generating feature '${name}' (Page Type: '${type}')...`);

    const pascalCaseName = toPascalCase(name);
    const camelCaseName = toCamelCase(name);
    const kebabCaseName = name.toLowerCase();
    const pluralKebabCaseName = kebabCaseName + 's';
    const titleCaseName = toTitleCase(name);

    // Daftar file umum yang selalu dibuat
    const commonFiles = [
      {
        template: 'model.template.ts',
        outputDir: 'src/models',
        filename: `${kebabCaseName}.ts`,
      },
      {
        template: 'schema.template.ts',
        outputDir: 'src/schemas',
        filename: `${pascalCaseName}Schema.ts`,
      },
      {
        template: 'service.template.ts',
        outputDir: 'src/services',
        filename: `${pascalCaseName}Service.ts`,
      },
    ];

    const commonTemplateDir = path.join(__dirname, 'templates', 'common');

    // Generate file-file umum
    commonFiles.forEach(fileInfo => {
      generateFile(commonTemplateDir, fileInfo);
    });
    
    // Generate file halaman secara kondisional
    const pageTemplateDir = path.join(__dirname, 'templates', type);
    const pageFileInfo = {
      template: 'page.template.tsx',
      outputDir: `src/pages/dashboard`,
      filename: `Manage${pascalCaseName}.tsx`,
    };
    generateFile(pageTemplateDir, pageFileInfo);

    // Fungsi utama untuk generate file
    function generateFile(templateDir, fileInfo) {
      const templatePath = path.join(templateDir, fileInfo.template);
      if (!fs.existsSync(templatePath)) {
        console.warn(`[SKIP] Template not found: ${templatePath}`);
        return;
      }
      
      let content = fs.readFileSync(templatePath, 'utf-8');
      
      content = content
        .replace(/__Name__/g, pascalCaseName)
        .replace(/__name__/g, camelCaseName)
        .replace(/__names__/g, pluralKebabCaseName)
        .replace(/__NAME_TITLE__/g, titleCaseName);

      const outputDir = path.join(process.cwd(), fileInfo.outputDir);
      fs.ensureDirSync(outputDir);

      const outputPath = path.join(outputDir, fileInfo.filename);
      fs.writeFileSync(outputPath, content);
      console.log(`✅ Created: ${outputPath}`);
    }

    console.log(`\n✨ Feature '${pascalCaseName}' generated successfully!`);
  });

program.parse(process.argv);