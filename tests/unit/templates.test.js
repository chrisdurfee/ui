import { describe, expect, it } from 'vitest';
import { Skeleton } from '../../src/components/atoms/skeleton.js';
import * as pages from '../../src/components/pages/pages.js';
import { AsideTemplate } from '../../src/components/pages/templates/aside-template.js';
import { FullTemplate } from '../../src/components/pages/templates/full-template.js';
import { MainColumn } from '../../src/components/pages/templates/template-atoms.js';
import * as templates from '../../src/components/pages/templates/templates.js';

describe('FullTemplate', () =>
{
	it('merges a custom class with the base classes', () =>
	{
		const layout = FullTemplate({ class: 'custom', id: 'main' }, []);
		expect(layout.class).toBe('body full-container flex flex-auto flex-col custom');
		expect(layout.id).toBe('main');
		expect(layout.tag).toBe('section');
	});

	it('does not add "undefined" without a class', () =>
	{
		const layout = FullTemplate({}, []);
		expect(layout.class).toBe('body full-container flex flex-auto flex-col');
		expect(layout.class).not.toContain('undefined');
	});
});

describe('MainColumn', () =>
{
	it('uses the default flex classes without a flex prop', () =>
	{
		const layout = MainColumn({ class: 'extra' }, []);
		expect(layout.class).toBe('col flex flex-auto flex-col extra');
		expect('flex' in layout).toBe(false);
	});

	it('keeps the legacy classes for flex: true', () =>
	{
		const layout = MainColumn({ flex: true }, []);
		expect(layout.class).toBe('col flex flex-none ');
		expect('flex' in layout).toBe(false);
	});

	it('uses a flex class string', () =>
	{
		const layout = MainColumn({ class: 'drawer', flex: 'flex flex-none md:flex-auto flex-col' }, []);
		expect(layout.class).toBe('col flex flex-none md:flex-auto flex-col drawer');
		expect('flex' in layout).toBe(false);
	});

	it('is used by AsideTemplate with its flex string', () =>
	{
		const layout = AsideTemplate({ left: null, right: null });
		const row = layout.children[0];
		const left = row.children[0];
		expect(left.class).toContain('flex flex-none md:flex-auto flex-col');
		expect('flex' in left).toBe(false);
	});
});

describe('page exports', () =>
{
	it('exports the pages and templates', () =>
	{
		expect(typeof pages.BasicPage).toBe('function');
		expect(typeof templates.Row).toBe('function');
		expect(typeof templates.FullTemplate).toBe('function');
	});
});

describe('Skeleton', () =>
{
	it('uses rounded-md by default', () =>
	{
		const layout = Skeleton({});
		expect(layout.class).toContain('rounded-md');
		expect(layout.class).not.toContain('undefined');
	});

	it('uses a plain rounded class without "rounded-undefined"', () =>
	{
		const layout = Skeleton({ class: 'rounded' });
		expect(layout.class).not.toContain('rounded-undefined');
		expect(layout.class).not.toContain('rounded-md');
		expect(layout.class).toContain('rounded');
	});

	it('uses a sized rounded class', () =>
	{
		const layout = Skeleton({ class: 'rounded-lg' });
		expect(layout.class).toContain('rounded-lg');
		expect(layout.class).not.toContain('rounded-md');
	});

	it('uses rounded-full for circles', () =>
	{
		const layout = Skeleton({ shape: 'circle' });
		expect(layout.class).toContain('rounded-full');
	});
});
