// Scripts/build-registry.js';
import { SERVER_URL } from '../environment.js';
import fs from 'fs';
import path from 'path';
import { Project } from 'ts-morph'; // Requires pnpm add -D ts-morph

const REGISTRY_ITEMS_DIR = path.join(process.cwd(), 'src/registry/new-york/items');
const REGISTRY_JSON_PATH = path.join(process.cwd(), 'registry.json');

// Initialize ts-morph project
const project = new Project({
    compilerOptions: {
        allowJs: true,
        jsx: 'react-jsx',
    },
});

// Valid dependency patterns
const REGISTRY_DEPENDENCY_REGEX = /@\/registry\/[^/]+\/items\/([^/]+)/;
const COMPONENT_DEPENDENCY_REGEX = /@\/components\/ui\/([^/]+)/;

function getDependencies(sourceFile) {
    const dependencies = new Set();
    const registryDependencies = new Set();

    const imports = sourceFile.getImportDeclarations();

    imports.forEach(importDecl => {
        const moduleSpecifier = importDecl.getModuleSpecifierValue();

        // 1. Registry Dependencies (@/components/ui/...)
        const componentMatch = moduleSpecifier.match(COMPONENT_DEPENDENCY_REGEX);
        if (componentMatch) {
            const depName = componentMatch[1];
            // Avoid self-reference
            if (depName !== sourceFile.getBaseNameWithoutExtension()) {
                registryDependencies.add(depName);
            }
            return;
        }

        // 2. Registry Dependencies (@/registry/...)
        const registryMatch = moduleSpecifier.match(REGISTRY_DEPENDENCY_REGEX);
        if (registryMatch) {
            registryDependencies.add(registryMatch[1]);
            return;
        }

        // 3. External Dependencies (node_modules)
        // Ignore relative imports, @/lib, @/hooks for now (or handle them if needed)
        if (!moduleSpecifier.startsWith('.') && !moduleSpecifier.startsWith('@/')) {
            dependencies.add(moduleSpecifier);
        }

    });

    return {
        dependencies: Array.from(dependencies),
        registryDependencies: Array.from(registryDependencies)
    };
}

async function buildRegistry() {
    if (!fs.existsSync(REGISTRY_ITEMS_DIR)) {
        console.error(`Directory not found: ${REGISTRY_ITEMS_DIR}`);
        process.exit(1);
    }

    const itemDirs = fs.readdirSync(REGISTRY_ITEMS_DIR).filter(d => fs.statSync(path.join(REGISTRY_ITEMS_DIR, d)).isDirectory());
    const localComponentNames = new Set(itemDirs);

    // Use SERVER_URL from environment.js as the source of truth
    let homepage = SERVER_URL;

    const items = [];

    for (const itemDirName of itemDirs) {
        const itemPath = path.join(REGISTRY_ITEMS_DIR, itemDirName);
        const name = itemDirName;
        const files = [];
        const allDependencies = new Set();
        const allRegistryDependencies = new Set();

        // Recursively find all .tsx files in the item directory, excluding demos
        const getFilesRecursively = (dir) => {
            const list = fs.readdirSync(dir);
            list.forEach(file => {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);
                if (stat.isDirectory()) {
                    getFilesRecursively(filePath);
                } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                    // Exclude demo files from being included in the registry item installation
                    if (file.toLowerCase().includes('demo')) return;

                    const content = fs.readFileSync(filePath, 'utf8');
                    const relativePath = path.relative(process.cwd(), filePath);
                    const sourceFile = project.createSourceFile(file, content, { overwrite: true });

                    const { dependencies, registryDependencies } = getDependencies(sourceFile);
                    dependencies.forEach(d => allDependencies.add(d));

                    // Convert local registry dependencies to full URLs
                    registryDependencies.forEach(d => {
                        if (localComponentNames.has(d)) {
                            allRegistryDependencies.add(`${homepage}/r/${d}.json`);
                        } else {
                            allRegistryDependencies.add(d);
                        }
                    });

                    files.push({
                        path: relativePath,
                        type: 'registry:ui',
                        content,
                    });
                }
            });
        };

        getFilesRecursively(itemPath);

        if (files.length > 0) {
            const title = name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

            items.push({
                name,
                type: 'registry:component',
                title,
                description: `A custom ${title} component.`,
                dependencies: Array.from(allDependencies),
                registryDependencies: Array.from(allRegistryDependencies),
                files: files.map(f => ({ path: f.path, type: f.type, content: f.content })),
            });
            console.log(`✓ Processed ${name}: files=${files.length}, deps=[${Array.from(allDependencies)}], regDeps=[${Array.from(allRegistryDependencies)}]`);
        }
    }

    // Update main registry.json manifest
    const manifest = {
        "$schema": "https://ui.shadcn.com/schema/registry.json",
        "name": "halp-ui-registry",
        "homepage": homepage,
        "items": items.map(item => ({
            name: item.name,
            type: item.type,
            title: item.title,
            description: item.description,
            dependencies: item.dependencies,
            registryDependencies: item.registryDependencies,
            files: item.files.map(f => ({ path: f.path, type: f.type })) // Manifest only needs paths
        }))
    };

    fs.writeFileSync(REGISTRY_JSON_PATH, JSON.stringify(manifest, null, 2));
    console.log(`🚀 Registry manifest updated! Run 'pnpm registry:build' to sync public/r/`);
}

buildRegistry();