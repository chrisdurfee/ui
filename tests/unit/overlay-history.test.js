import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * A fake session history. Traversals are async and fire a
 * popstate per traversal, like browsers do.
 *
 * @returns {object}
 */
const createFakeHistory = () =>
{
	const fake = {
		entries: [{ state: { location: 'route-1' } }],
		index: 0,
		queue: Promise.resolve(),
		get state()
		{
			return fake.entries[fake.index].state;
		},
		replaceState(state)
		{
			fake.entries[fake.index] = { state };
		},
		pushState(state)
		{
			fake.entries = fake.entries.slice(0, fake.index + 1);
			fake.entries.push({ state });
			fake.index++;
		},
		go(delta)
		{
			fake.queue = fake.queue.then(() =>
			{
				const next = Math.max(0, Math.min(fake.entries.length - 1, fake.index + delta));
				if (next === fake.index)
				{
					return;
				}

				fake.index = next;
				window.dispatchEvent(new PopStateEvent('popstate', { state: fake.state }));
			});
		},
		back()
		{
			fake.go(-1);
		}
	};
	return fake;
};

/**
 * Creates an overlay that unregisters on close.
 *
 * @param {object} api
 * @param {function|null} [after]
 * @returns {object}
 */
const createOverlay = (api, after = null) =>
{
	const overlay = {
		closed: 0,
		close()
		{
			overlay.closed++;
			api.popOverlayHistory(overlay, after);
		}
	};
	return overlay;
};

describe('overlay history', () =>
{
	let fake;
	let api;

	beforeEach(async () =>
	{
		vi.resetModules();
		fake = createFakeHistory();
		vi.spyOn(window, 'history', 'get').mockReturnValue(fake);
		api = await import('../../src/components/molecules/modals/overlay-history.js');
	});

	afterEach(() =>
	{
		vi.restoreAllMocks();
	});

	const settle = async () =>
	{
		await fake.queue;
		await new Promise((resolve) => setTimeout(resolve, 5));
	};

	it('restores the router state after a programmatic close', async () =>
	{
		const after = vi.fn();
		const overlay = createOverlay(api, after);
		api.pushOverlayHistory(overlay);
		expect(fake.index).toBe(1);
		expect(fake.entries[0].state).toEqual({ __overlayNeutral: true });

		overlay.close();
		await settle();

		expect(fake.index).toBe(0);
		expect(fake.entries[0].state).toEqual({ location: 'route-1' });
		expect(after).toHaveBeenCalledTimes(1);
	});

	it('keeps every callback when two overlays close quickly', async () =>
	{
		const afterA = vi.fn();
		const afterB = vi.fn();
		const a = createOverlay(api, afterA);
		const b = createOverlay(api, afterB);
		api.pushOverlayHistory(a);
		api.pushOverlayHistory(b);
		expect(fake.index).toBe(2);

		/**
		 * Both close before the first popstate arrives.
		 */
		b.close();
		a.close();
		await settle();

		expect(afterA).toHaveBeenCalledTimes(1);
		expect(afterB).toHaveBeenCalledTimes(1);
		expect(fake.index).toBe(0);
		expect(fake.entries[0].state).toEqual({ location: 'route-1' });
		expect(fake.entries[1].state).toEqual({ location: 'route-1' });
	});

	it('closes the top overlay on a back navigation', async () =>
	{
		const overlay = createOverlay(api);
		api.pushOverlayHistory(overlay);

		fake.back();
		await settle();

		expect(overlay.closed).toBe(1);
		expect(fake.index).toBe(0);
		expect(fake.entries[0].state).toEqual({ location: 'route-1' });
	});

	it('does not leave a dead entry when a lower overlay closes first', async () =>
	{
		const afterA = vi.fn();
		const afterB = vi.fn();
		const a = createOverlay(api, afterA);
		const b = createOverlay(api, afterB);
		api.pushOverlayHistory(a);
		api.pushOverlayHistory(b);

		/**
		 * Non-LIFO close: A (below) closes while B is still open.
		 */
		a.close();
		await settle();
		expect(afterA).toHaveBeenCalledTimes(1);
		expect(fake.index).toBe(2);

		b.close();
		await settle();

		expect(afterB).toHaveBeenCalledTimes(1);
		expect(fake.index).toBe(0);
		expect(fake.entries[0].state).toEqual({ location: 'route-1' });
	});

	it('unwinds handed-over entries on a back navigation', async () =>
	{
		const afterB = vi.fn();
		const a = createOverlay(api);
		const b = createOverlay(api, afterB);
		api.pushOverlayHistory(a);
		api.pushOverlayHistory(b);

		a.close();
		await settle();

		fake.back();
		await settle();
		await settle();

		expect(b.closed).toBe(1);
		expect(afterB).toHaveBeenCalledTimes(1);
		expect(fake.index).toBe(0);
		expect(fake.entries[0].state).toEqual({ location: 'route-1' });
	});
});
