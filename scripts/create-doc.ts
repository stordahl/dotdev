#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as p from '@clack/prompts';
import ccConfig from '../content-collections';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

interface FieldInfo {
	name: string;
	type: string;
	optional: boolean;
	enumValues?: string[];
	description?: string;
}

interface CollectionInfo {
	name: string;
	directory: string;
	include: string;
	parser?: string;
	fields: FieldInfo[];
}

function parseValibotSchema(schema: unknown): FieldInfo[] {
	const fields: FieldInfo[] = [];

	if (!schema || typeof schema !== 'object') return fields;

	const schemaObj = schema as Record<string, unknown>;

	// Handle v.object()
	if (schemaObj.type === 'object' && schemaObj.entries) {
		for (const [name, entry] of Object.entries(schemaObj.entries as Record<string, unknown>)) {
			if (entry && typeof entry === 'object') {
				fields.push({
					name,
					type: getFieldType(entry),
					optional: (entry as Record<string, unknown>).issues !== undefined, // v.optional() adds issues property
					enumValues: getEnumValues(entry),
					description: getDescription(entry)
				});
			}
		}
	}

	return fields;
}

function getFieldType(entry: unknown): string {
	if (!entry || typeof entry !== 'object') return 'unknown';

	const entryObj = entry as Record<string, unknown>;

	// Handle v.literal()
	if (entryObj.type === 'literal') {
		return 'literal';
	}

	// Handle v.union()
	if (entryObj.type === 'union') {
		const options = (entryObj.options as Array<Record<string, unknown>>)
			?.map((opt: Record<string, unknown>) =>
				opt.type === 'literal' ? `'${opt.value}'` : String(opt.type)
			)
			.join(' | ');
		return options || 'union';
	}

	// Basic types
	switch (entryObj.type) {
		case 'string':
			return 'string';
		case 'boolean':
			return 'boolean';
		case 'number':
			return 'number';
		case 'date':
			return 'date';
		default:
			return String(entryObj.type) || 'unknown';
	}
}

function getEnumValues(entry: unknown): string[] | undefined {
	if (!entry || typeof entry !== 'object') return undefined;

	const entryObj = entry as Record<string, unknown>;

	if (entryObj.type === 'union' && entryObj.options) {
		const options = entryObj.options as Array<unknown>;
		return options
			.map((opt) => {
				if (typeof opt === 'object' && opt !== null) {
					const optObj = opt as Record<string, unknown>;
					// Valibot stores literal values in the 'literal' field
					if (optObj.type === 'literal' && optObj.literal !== undefined) {
						return String(optObj.literal);
					}
				}
				return undefined;
			})
			.filter((value): value is string => value !== undefined);
	}
	return undefined;
}

function getDescription(entry: unknown): string | undefined {
	if (!entry || typeof entry !== 'object') return undefined;

	const entryObj = entry as Record<string, unknown>;
	// Try to extract description from various schema properties
	return entryObj.description as string | undefined;
}

function getCollectionsInfo(): CollectionInfo[] {
	return ccConfig.collections.map((collection: unknown) => {
		const col = collection as Record<string, unknown>;
		return {
			name: col.name as string,
			directory: col.directory as string,
			include: col.include as string,
			parser: col.parser as string | undefined,
			fields: parseValibotSchema(col.schema)
		};
	});
}

async function selectCollection(): Promise<CollectionInfo> {
	const collections = getCollectionsInfo();

	const selected = await p.select({
		message: 'Choose a collection',
		options: collections.map((collection) => ({
			value: collection,
			label: collection.name,
			hint: `${collection.directory} • ${collection.parser || 'markdown'} • ${collection.fields.length} fields`
		}))
	});

	if (p.isCancel(selected)) {
		p.cancel('Operation cancelled.');
		process.exit(0);
	}

	return selected as CollectionInfo;
}

async function promptForFields(fields: FieldInfo[]): Promise<Record<string, unknown>> {
	const data: Record<string, unknown> = {};

	p.note('Enter your document information', 'Document Details');

	for (const field of fields) {
		let value: unknown;

		if (field.type === 'boolean') {
			value = await p.confirm({
				message: field.name,
				initialValue: field.optional ? false : true
			});

			if (p.isCancel(value)) {
				p.cancel('Operation cancelled.');
				process.exit(0);
			}

			if (value !== null || !field.optional) {
				data[field.name] = value;
			}
		} else if (field.enumValues) {
			const selected = await p.select({
				message: field.name,
				options: field.enumValues.map((option) => ({
					value: option,
					label: option
				}))
			});

			if (p.isCancel(selected)) {
				p.cancel('Operation cancelled.');
				process.exit(0);
			}

			if (selected || !field.optional) {
				data[field.name] = selected;
			}
		} else {
			const placeholder = getPlaceholderForType(field.type);

			const input = await p.text({
				message: field.name,
				placeholder,
				validate: !field.optional
					? (value) => {
							if (!value || value.trim() === '') {
								return `${field.name} is required`;
							}
							return undefined;
						}
					: undefined
			});

			if (p.isCancel(input)) {
				p.cancel('Operation cancelled.');
				process.exit(0);
			}

			if (input || !field.optional) {
				// Type conversion based on field type
				if (field.type === 'boolean') {
					data[field.name] = input.toLowerCase() === 'true' || input.toLowerCase() === 'yes';
				} else if (field.type === 'number') {
					const num = parseFloat(input);
					data[field.name] = isNaN(num) ? input : num;
				} else {
					data[field.name] = input;
				}
			}
		}
	}

	return data;
}

function getPlaceholderForType(type: string): string {
	switch (type) {
		case 'string':
			return 'Enter text...';
		case 'date':
			return '2024-01-31';
		case 'boolean':
			return 'true or false';
		case 'number':
			return 'Enter number...';
		case 'url':
			return 'https://example.com';
		default:
			return 'Enter value...';
	}
}

function generateFileName(collection: CollectionInfo, data: Record<string, unknown>): string {
	if (data.title && typeof data.title === 'string') {
		return data.title
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-');
	}
	return `new-${collection.name}-${Date.now()}`;
}

function generateMarkdownFile(collection: CollectionInfo, data: Record<string, unknown>): string {
	let content = '---\n';

	// Add frontmatter fields (exclude content field)
	Object.entries(data).forEach(([key, value]) => {
		if (key !== 'content' && value !== undefined) {
			const stringValue = String(value);
			if (stringValue.includes('"')) {
				content += `${key}: '${stringValue}'\n`;
			} else {
				content += `${key}: ${stringValue}\n`;
			}
		}
	});

	content += '---\n\n';

	// Add content if provided
	if (data.content && typeof data.content === 'string') {
		content += data.content;
	} else {
		content += '\n<!-- Start writing your content here -->\n\n';
	}

	return content;
}

function generateJsonFile(collection: CollectionInfo, data: Record<string, unknown>): string {
	// Remove content field if present (JSON collections typically don't have it)
	const cleanData = { ...data };
	delete cleanData.content;

	return JSON.stringify(cleanData, null, 2);
}

async function createDocument(
	collection: CollectionInfo,
	data: Record<string, unknown>
): Promise<void> {
	const fileName = generateFileName(collection, data);
	const directory = path.join(projectRoot, collection.directory);

	// Ensure directory exists
	if (!fs.existsSync(directory)) {
		fs.mkdirSync(directory, { recursive: true });
	}

	let filePath: string;
	let content: string;

	if (collection.parser === 'json') {
		filePath = path.join(directory, `${fileName}.json`);
		content = generateJsonFile(collection, data);
	} else {
		filePath = path.join(directory, `${fileName}.md`);
		content = generateMarkdownFile(collection, data);
	}

	// Write file
	fs.writeFileSync(filePath, content, 'utf8');

	// Success message with preview
	p.note(`Created: ${filePath}`, '✅ Document created successfully!');

	const preview = await p.confirm({
		message: 'Would you like to see the content preview?',
		initialValue: true
	});

	if (p.isCancel(preview)) {
		p.cancel('Operation cancelled.');
		process.exit(0);
	}

	if (preview) {
		console.log('\n' + '─'.repeat(50));
		console.log(content);
		console.log('─'.repeat(50) + '\n');
	}
}

async function main() {
	try {
		// Welcome message
		console.clear();
		p.intro('🚀 Content Collection Document Generator');

		// Select collection
		const collection = await selectCollection();

		console.log(`✓ Selected collection: ${collection.name}`);

		// Prompt for fields
		const data = await promptForFields(collection.fields);

		// Create document
		await createDocument(collection, data);

		// Success outro
		p.outro('All done! 🎉');
	} catch (error) {
		p.cancel('An error occurred:');
		console.error(error);
		process.exit(1);
	}
}

// Handle script being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
	main();
}

export { main as createNewEntity };
