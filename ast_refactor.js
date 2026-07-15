const { Project, SyntaxKind } = require('ts-morph');
const fs = require('fs');
const path = require('path');

const project = new Project();
project.addSourceFilesAtPaths('c:/Users/Priscilla Anokye/InternLink/app/**/*.tsx');
project.addSourceFilesAtPaths('c:/Users/Priscilla Anokye/InternLink/src/**/*.tsx');

const sourceFiles = project.getSourceFiles();

for (const sourceFile of sourceFiles) {
    if (sourceFile.getFilePath().includes('SplashScreen')) continue;
    let modified = false;

    // 1. Remove duplicated `const colors = useThemeColor()` or `const styles = React.useMemo(...)`
    const varDecls = sourceFile.getDescendantsOfKind(SyntaxKind.VariableDeclaration);
    let colorsDecls = [];
    let stylesDecls = [];
    
    for (const v of varDecls) {
        if (v.getName() === 'colors' && v.getInitializer() && v.getInitializer().getText().includes('useThemeColor')) {
            colorsDecls.push(v);
        }
        if (v.getName() === 'styles' && v.getInitializer() && v.getInitializer().getText().includes('React.useMemo')) {
            stylesDecls.push(v);
        }
    }
    
    // If multiple `const colors`, remove all but the first (in the same block)
    // Actually, just remove the statements of the duplicates
    if (colorsDecls.length > 1) {
        for (let i = 1; i < colorsDecls.length; i++) {
            colorsDecls[i].getFirstAncestorByKind(SyntaxKind.VariableStatement)?.remove();
            modified = true;
        }
    }
    if (stylesDecls.length > 1) {
        for (let i = 1; i < stylesDecls.length; i++) {
            stylesDecls[i].getFirstAncestorByKind(SyntaxKind.VariableStatement)?.remove();
            modified = true;
        }
    }

    // 2. Ensure `import { useThemeColor }` exists if we use `useThemeColor`
    const text = sourceFile.getFullText();
    if (text.includes('useThemeColor()')) {
        const imports = sourceFile.getImportDeclarations();
        const hasImport = imports.some(i => i.getNamedImports().some(n => n.getName() === 'useThemeColor'));
        if (!hasImport) {
            let rootRelativePath = path.relative('c:/Users/Priscilla Anokye/InternLink', sourceFile.getFilePath());
            let depth = rootRelativePath.split(path.sep).length - 1;
            let prefix = '../'.repeat(depth);
            sourceFile.addImportDeclaration({
                namedImports: ['useThemeColor'],
                moduleSpecifier: `${prefix}src/hooks/useThemeColor`
            });
            modified = true;
        }
    }

    // 3. Ensure `import React` exists if we use `React.useMemo`
    if (text.includes('React.useMemo')) {
        const imports = sourceFile.getImportDeclarations();
        const hasReact = imports.some(i => i.getDefaultImport()?.getText() === 'React' || i.getNamedImports().some(n => n.getName() === 'React'));
        if (!hasReact) {
            sourceFile.addImportDeclaration({
                defaultImport: 'React',
                moduleSpecifier: 'react'
            });
            modified = true;
        }
    }

    // 4. Inject hooks into functions if they use `colors.` but lack `const colors = useThemeColor();`
    // Find default exported function or const
    if (text.includes('colors.') && !text.includes('const colors = useThemeColor();')) {
        // Fallback for missing hooks
        const funcs = sourceFile.getFunctions();
        for (const f of funcs) {
            if (f.isExported() || f.isDefaultExport()) {
                f.insertStatements(0, `const colors = useThemeColor();\n  const styles = React.useMemo(() => createStyles(colors), [colors]);`);
                modified = true;
            }
        }
        const vars = sourceFile.getVariableDeclarations();
        for (const v of vars) {
            const init = v.getInitializer();
            if (init && (init.getKind() === SyntaxKind.ArrowFunction || init.getKind() === SyntaxKind.FunctionExpression)) {
                if (v.getFirstAncestorByKind(SyntaxKind.VariableStatement)?.isExported() || text.includes(`export default ${v.getName()}`)) {
                    init.insertStatements(0, `const colors = useThemeColor();\n  const styles = React.useMemo(() => createStyles(colors), [colors]);`);
                    modified = true;
                }
            }
        }
    }

    if (modified) {
        sourceFile.saveSync();
        console.log(`Fixed AST in ${sourceFile.getBaseName()}`);
    }
}
