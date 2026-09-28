import { describe, expect, it } from 'vitest';
import { escapeRegExp, isPathActive } from '../../src/utils/active-path.js';

describe('isPathActive', () =>
{
	it('matches the path and its children', () =>
	{
		expect(isPathActive('/users', '/users')).toBe(true);
		expect(isPathActive('/users', '/users/5')).toBe(true);
		expect(isPathActive('/users', '/users.json')).toBe(true);
		expect(isPathActive('/users', '/users?page=2')).toBe(true);
		expect(isPathActive('/users', '/users#top')).toBe(true);
	});

	it('is anchored to the start of the url', () =>
	{
		expect(isPathActive('/users', '/admin/users')).toBe(false);
		expect(isPathActive('/users', '/admin/users/5')).toBe(false);
	});

	it('does not match a longer segment', () =>
	{
		expect(isPathActive('/users', '/users-archive')).toBe(false);
		expect(isPathActive('/user', '/users')).toBe(false);
	});

	it('escapes regex characters in the path', () =>
	{
		expect(isPathActive('/a.b', '/axb')).toBe(false);
		expect(isPathActive('/a.b', '/a.b/c')).toBe(true);
		expect(isPathActive('/c++', '/c++/intro')).toBe(true);
		expect(() => isPathActive('/bad(path', '/bad(path')).not.toThrow();
		expect(isPathActive('/bad(path', '/bad(path')).toBe(true);
	});

	it('ignores a trailing slash on the path', () =>
	{
		expect(isPathActive('/users/', '/users/5')).toBe(true);
		expect(isPathActive('/users/', '/users')).toBe(true);
	});

	it('treats the root path as exact-ish', () =>
	{
		expect(isPathActive('/', '/')).toBe(true);
		expect(isPathActive('/', '/users')).toBe(false);
	});

	it('returns false for empty or invalid input', () =>
	{
		expect(isPathActive('', '/users')).toBe(false);
		// @ts-ignore
		expect(isPathActive(null, '/users')).toBe(false);
		// @ts-ignore
		expect(isPathActive('/users', null)).toBe(false);
	});

	it('caches and reuses the compiled pattern', () =>
	{
		expect(isPathActive('/cache', '/cache/1')).toBe(true);
		expect(isPathActive('/cache', '/cache/2')).toBe(true);
		expect(isPathActive('/cache', '/other')).toBe(false);
	});

	it('escapes all regex characters', () =>
	{
		const special = '.*+?^${}()|[]\\';
		const pattern = new RegExp('^' + escapeRegExp(special) + '$');
		expect(pattern.test(special)).toBe(true);
		expect(escapeRegExp('a.b')).toBe('a\\.b');
	});
});
